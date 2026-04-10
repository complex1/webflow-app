import { Op } from 'sequelize';
import WebFlowSchedule from '../models/WebFlowSchedule';
import { enqueueWebFlowExecution } from './webflowExecutionService';
import { computeNextRun } from './scheduleCron';
import { resolveEnvForLinkedEnvFile } from './scheduleEnv';

const TICK_MS = 60_000;

let intervalHandle: ReturnType<typeof setInterval> | null = null;
let tickRunning = false;

/**
 * In-process scheduler: single Node instance + SQLite only.
 * Multiple app replicas would need a single leader or an external queue (Redis, etc.).
 * Misfires while the server is down are skipped; next run is computed from "now" after a due fire is processed.
 */
export function startWebflowSchedulerLoop(): void {
  if (intervalHandle != null) {
    return;
  }
  intervalHandle = setInterval(() => {
    void tick();
  }, TICK_MS);
  void tick();
}

export function stopWebflowSchedulerLoop(): void {
  if (intervalHandle != null) {
    clearInterval(intervalHandle);
    intervalHandle = null;
  }
}

async function tick(): Promise<void> {
  if (tickRunning) {
    return;
  }
  tickRunning = true;
  const now = new Date();
  try {
    const due = await WebFlowSchedule.findAll({
      where: {
        enabled: true,
        nextRunAt: { [Op.lte]: now },
      },
    });

    for (const schedule of due) {
      const nextFire = computeNextRun(schedule.cronExpression, schedule.timezone, now);
      await schedule.update({
        lastRunAt: now,
        nextRunAt: nextFire,
      });

      try {
        const env = await resolveEnvForLinkedEnvFile(
          schedule.userId,
          schedule.webFlowId,
          schedule.envFileId
        );
        await enqueueWebFlowExecution({
          webFlowId: schedule.webFlowId,
          userId: schedule.userId,
          env,
          scheduleId: schedule.id,
        });
      } catch (e) {
        console.error('[scheduler] Failed to enqueue execution for schedule', schedule.id, e);
      }
    }
  } catch (e) {
    console.error('[scheduler] Tick error:', e);
  } finally {
    tickRunning = false;
  }
}
