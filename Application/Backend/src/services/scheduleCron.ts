import { CronExpressionParser } from 'cron-parser';

/**
 * Normalize classic 5-field cron (minute hour dom mon dow) to cron-parser v5 format
 * with a seconds field (0 = run at second 0 of that minute).
 */
export function normalizeCronExpression(expression: string): string {
  const t = expression.trim();
  const parts = t.split(/\s+/).filter(Boolean);
  if (parts.length === 5) {
    return `0 ${t}`;
  }
  return t;
}

export function isValidCronExpression(expression: string, timezone: string): boolean {
  try {
    const expr = normalizeCronExpression(expression);
    CronExpressionParser.parse(expr, { tz: timezone || 'UTC' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Next fire time strictly after `currentDate` (misfired windows are skipped).
 */
export function computeNextRun(cronExpression: string, timezone: string, currentDate: Date): Date {
  const expr = normalizeCronExpression(cronExpression);
  const parsed = CronExpressionParser.parse(expr, {
    currentDate,
    tz: timezone || 'UTC',
  });
  return parsed.next().toDate();
}
