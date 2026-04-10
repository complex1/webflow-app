<template>
  <AppLayout>
    <template #logo>
      <Heading :level="3">Scheduler</Heading>
    </template>

    <Inline gap="md" align="center" wrap class="scheduler-toolbar">
      <Text variant="sm" tone="muted">
        Run web flows on a cron schedule. Uses server execution with the selected linked env file.
      </Text>
      <Button variant="primary" type="button" size="sm" @click="openCreate">Add schedule</Button>
    </Inline>

    <Alert v-if="error" variant="error" dismissible @dismiss="error = ''">
      {{ error }}
    </Alert>

    <div v-if="loading" class="scheduler-loading">
      <Text tone="muted">Loading schedules…</Text>
    </div>

    <div v-else class="scheduler-table-wrap">
      <table class="scheduler-table" aria-label="Scheduled web flows">
        <thead>
          <tr>
            <th>Name</th>
            <th>Web flow</th>
            <th>Cron</th>
            <th>Timezone</th>
            <th>Enabled</th>
            <th>Next run</th>
            <th>Last run</th>
            <th>Last outcome</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in schedules" :key="s.id">
            <td>{{ s.name || "—" }}</td>
            <td>
              <router-link class="scheduler-link" :to="editorLink(s.webFlowId)">{{ s.webFlow?.name || s.webFlowId }}</router-link>
            </td>
            <td><code class="scheduler-mono">{{ s.cronExpression }}</code></td>
            <td>{{ s.timezone }}</td>
            <td>
              <input
                type="checkbox"
                :checked="s.enabled"
                :aria-label="`Enable schedule ${s.id}`"
                @change="onToggleEnabled(s, ($event.target as HTMLInputElement).checked)"
              />
            </td>
            <td>{{ formatDt(s.nextRunAt) }}</td>
            <td>{{ formatDt(s.lastRunAt) }}</td>
            <td>
              <template v-if="s.lastExecution">
                <Badge :variant="s.lastExecution.status === 'completed' ? 'success' : s.lastExecution.status === 'failed' ? 'error' : 'default'">
                  {{ s.lastExecution.status }}
                </Badge>
                <router-link
                  v-if="s.lastExecution.id"
                  class="scheduler-link scheduler-link--sm"
                  :to="editorLink(s.webFlowId, s.lastExecution.id)"
                >
                  Open run
                </router-link>
              </template>
              <Text v-else variant="sm" tone="muted" as="span">—</Text>
            </td>
            <td>
              <Button variant="secondary" type="button" size="sm" @click="openExecutions(s)">Runs</Button>
              <Button variant="secondary" type="button" size="sm" @click="confirmDelete(s)">Delete</Button>
            </td>
          </tr>
          <tr v-if="schedules.length === 0">
            <td colspan="9">
              <Text tone="muted">No schedules yet. Add one to run a flow on a timer.</Text>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Drawer :open="drawerOpen" title="New schedule" @close="drawerOpen = false">
      <form class="scheduler-form" @submit.prevent="submitCreate">
        <label class="scheduler-field">
          <span>Web flow</span>
          <select v-model="formWebFlowIdStr" class="scheduler-select" required @change="onFormWebflowChange">
            <option value="" disabled>Select a web flow</option>
            <option v-for="w in webflowOptions" :key="w.id" :value="String(w.id)">{{ w.name }}</option>
          </select>
        </label>
        <label class="scheduler-field">
          <span>Label (optional)</span>
          <input v-model="form.name" type="text" class="scheduler-input" placeholder="Nightly sync" />
        </label>
        <label class="scheduler-field">
          <span>Cron expression</span>
          <input
            v-model="form.cronExpression"
            type="text"
            class="scheduler-input"
            required
            placeholder="0 * * * * (every hour, standard 5-field)"
          />
        </label>
        <label class="scheduler-field">
          <span>Timezone</span>
          <input v-model="form.timezone" type="text" class="scheduler-input" placeholder="UTC" required />
        </label>
        <label class="scheduler-field">
          <span>Env file (optional)</span>
          <select v-model.number="formEnvFileId" class="scheduler-select">
            <option :value="null">None</option>
            <option v-for="f in linkedEnvFiles" :key="f.id" :value="f.id">{{ f.name }}</option>
          </select>
        </label>
        <Inline gap="sm" class="scheduler-form-actions">
          <Button variant="primary" type="submit" size="sm" :loading="saving">Create</Button>
          <Button variant="secondary" type="button" size="sm" @click="drawerOpen = false">Cancel</Button>
        </Inline>
      </form>
    </Drawer>

    <Modal :open="runsModal.open" title="Scheduled runs" width="min(640px, 94vw)" @close="runsModal.open = false">
      <div v-if="runsModal.loading" class="scheduler-loading">
        <Text tone="muted">Loading…</Text>
      </div>
      <table v-else class="scheduler-table scheduler-table--compact">
        <thead>
          <tr>
            <th>Run</th>
            <th>Status</th>
            <th>Time</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ex in runsModal.rows" :key="ex.id">
            <td>#{{ ex.id }}</td>
            <td>
              <Badge :variant="ex.status === 'completed' ? 'success' : ex.status === 'failed' ? 'error' : 'default'">{{
                ex.status
              }}</Badge>
            </td>
            <td>{{ formatDt(ex.createdAt) }}</td>
            <td>
              <router-link
                v-if="runsModal.webFlowId"
                class="scheduler-link"
                :to="editorLink(runsModal.webFlowId, ex.id)"
                @click="runsModal.open = false"
              >
                Open
              </router-link>
            </td>
          </tr>
          <tr v-if="runsModal.rows.length === 0">
            <td colspan="4"><Text tone="muted">No runs yet.</Text></td>
          </tr>
        </tbody>
      </table>
    </Modal>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import AppLayout from "@/components/layout/AppLayout.vue";
import Heading from "@/components/common/typography/Heading.vue";
import Text from "@/components/common/typography/Text.vue";
import Button from "@/components/common/buttons/Button.vue";
import Inline from "@/components/common/foundation/Inline.vue";
import { Alert } from "@/components/common/feedback";
import Badge from "@/components/common/feedback/Badge.vue";
import Drawer from "@/components/common/overlay/Drawer.vue";
import Modal from "@/components/common/overlay/Modal.vue";
import { scheduleService, type WebFlowSchedule } from "@/services/scheduler";
import { webFlowService, type WebFlow } from "@/services/webflow";

const schedules = ref<WebFlowSchedule[]>([]);
const webflows = ref<WebFlow[]>([]);
const loading = ref(false);
const saving = ref(false);
const error = ref("");

const drawerOpen = ref(false);
const form = ref({
  name: "",
  cronExpression: "0 * * * *",
  timezone: "UTC",
});
const formWebFlowIdStr = ref("");
const formEnvFileId = ref<number | null>(null);
const linkedEnvFiles = ref<{ id: number; name: string }[]>([]);

const webflowOptions = computed(() => webflows.value.filter((w) => !w.isFolder));

const runsModal = ref({
  open: false,
  loading: false,
  scheduleId: 0,
  webFlowId: 0,
  rows: [] as { id: number; status: string; createdAt: string }[],
});

function editorLink(webFlowId: number, runId?: number) {
  const q: Record<string, string> = { id: String(webFlowId) };
  if (runId != null) q.runId = String(runId);
  return { path: "/webflow/editor", query: q };
}

function formatDt(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

async function loadWebflows() {
  const data = await webFlowService.list(null, 1, 5000);
  webflows.value = data.webFlows;
}

async function loadSchedules() {
  loading.value = true;
  error.value = "";
  try {
    schedules.value = await scheduleService.list();
  } catch (e: unknown) {
    const err = e as { response?: { data?: { error?: string } } };
    error.value = err?.response?.data?.error || "Failed to load schedules";
  } finally {
    loading.value = false;
  }
}

async function onFormWebflowChange() {
  const id = Number.parseInt(formWebFlowIdStr.value, 10);
  linkedEnvFiles.value = [];
  formEnvFileId.value = null;
  if (!id) return;
  try {
    const res = await webFlowService.getLinkedEnvFiles(id, 1, 100);
    linkedEnvFiles.value = res.envFiles.map((f) => ({ id: f.id, name: f.name }));
  } catch {
    linkedEnvFiles.value = [];
  }
}

function openCreate() {
  form.value = {
    name: "",
    cronExpression: "0 * * * *",
    timezone: "UTC",
  };
  formWebFlowIdStr.value = "";
  formEnvFileId.value = null;
  linkedEnvFiles.value = [];
  drawerOpen.value = true;
}

async function submitCreate() {
  const webFlowId = Number.parseInt(formWebFlowIdStr.value, 10);
  if (!Number.isFinite(webFlowId) || webFlowId <= 0) {
    error.value = "Select a web flow";
    return;
  }
  saving.value = true;
  error.value = "";
  try {
    await scheduleService.create({
      webFlowId,
      name: form.value.name.trim() || undefined,
      cronExpression: form.value.cronExpression.trim(),
      timezone: form.value.timezone.trim() || "UTC",
      enabled: true,
      envFileId: formEnvFileId.value,
    });
    drawerOpen.value = false;
    await loadSchedules();
  } catch (e: unknown) {
    const err = e as { response?: { data?: { error?: string } } };
    error.value = err?.response?.data?.error || "Failed to create schedule";
  } finally {
    saving.value = false;
  }
}

async function onToggleEnabled(s: WebFlowSchedule, enabled: boolean) {
  try {
    await scheduleService.update(s.id, { enabled });
    await loadSchedules();
  } catch (e: unknown) {
    const err = e as { response?: { data?: { error?: string } } };
    error.value = err?.response?.data?.error || "Failed to update";
  }
}

function confirmDelete(s: WebFlowSchedule) {
  if (!window.confirm(`Delete schedule "${s.name || s.webFlow?.name || s.id}"?`)) return;
  void (async () => {
    try {
      await scheduleService.remove(s.id);
      await loadSchedules();
    } catch (e: unknown) {
      const err = e as { response?: { data?: { error?: string } } };
      error.value = err?.response?.data?.error || "Failed to delete";
    }
  })();
}

async function openExecutions(s: WebFlowSchedule) {
  runsModal.value = {
    open: true,
    loading: true,
    scheduleId: s.id,
    webFlowId: s.webFlowId,
    rows: [],
  };
  try {
    const data = await scheduleService.listExecutions(s.id, 1, 50);
    runsModal.value.rows = data.executions;
  } catch {
    runsModal.value.rows = [];
  } finally {
    runsModal.value.loading = false;
  }
}

watch(drawerOpen, (open) => {
  if (open && formWebFlowIdStr.value) {
    void onFormWebflowChange();
  }
});

onMounted(async () => {
  await loadWebflows();
  await loadSchedules();
});
</script>

<style scoped>
.scheduler-toolbar {
  margin-bottom: var(--space-4);
}

.scheduler-loading {
  padding: var(--space-4);
}

.scheduler-table-wrap {
  overflow: auto;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
}

.scheduler-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-sm, 0.875rem);
}

.scheduler-table th,
.scheduler-table td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid var(--border-subtle);
}

.scheduler-table th {
  font-weight: 600;
  color: var(--text-muted);
  background: var(--bg-secondary);
}

.scheduler-mono {
  font-size: 0.75rem;
}

.scheduler-link {
  color: var(--accent-blue);
  text-decoration: none;
}

.scheduler-link:hover {
  text-decoration: underline;
}

.scheduler-link--sm {
  display: inline-block;
  margin-left: 8px;
  font-size: 0.75rem;
}

.scheduler-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  min-width: min(360px, 88vw);
}

.scheduler-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: var(--text-sm);
}

.scheduler-field span {
  color: var(--text-muted);
}

.scheduler-input,
.scheduler-select {
  padding: 8px 10px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--bg-elevated);
  color: var(--text-primary);
}

.scheduler-form-actions {
  margin-top: var(--space-2);
}

.scheduler-table--compact {
  margin-top: var(--space-2);
}
</style>
