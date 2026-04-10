<template>
  <div class="run-detail-panel" role="region" aria-label="Run details">
    <div class="run-detail-panel__head">
      <Heading :level="5" class="run-detail-panel__title">
        {{ detail ? `Run #${detail.id}` : `Run #${runId}` }}
      </Heading>
      <button
        type="button"
        class="run-detail-panel__close"
        aria-label="Close run details"
        @click="emit('clear')"
      >
        <Icon name="times" size="sm" />
      </button>
    </div>

    <div v-if="detail && !loading && !detailError" class="run-detail-panel__report-row">
      <button type="button" class="run-detail-panel__report-btn" @click="emit('open-report')">
        Full execution report
      </button>
    </div>

    <div v-if="loading" class="run-detail-panel__loading">
      <Spinner />
      <Text tone="muted">Loading…</Text>
    </div>
    <Alert v-else-if="detailError" variant="error">{{ detailError }}</Alert>
    <template v-else-if="detail">
      <section class="run-detail-panel__meta" aria-label="Run summary">
        <dl class="run-detail-panel__dl">
          <div class="run-detail-panel__dl-row">
            <dt>Status</dt>
            <dd>
              <Badge :variant="statusVariant(detail.status)">{{ detail.status }}</Badge>
            </dd>
          </div>
          <div v-if="detail.errorSummary" class="run-detail-panel__dl-row">
            <dt>Error summary</dt>
            <dd class="run-detail-panel__error-dd">{{ detail.errorSummary }}</dd>
          </div>
          <div class="run-detail-panel__dl-row">
            <dt>Started</dt>
            <dd>{{ formatTime(detail.createdAt) }}</dd>
          </div>
          <div v-if="detail.status !== 'running'" class="run-detail-panel__dl-row">
            <dt>Finished</dt>
            <dd>{{ formatTime(detail.updatedAt) }}</dd>
          </div>
          <div class="run-detail-panel__dl-row">
            <dt>Duration</dt>
            <dd>{{ executionDurationLabel }}</dd>
          </div>
        </dl>
      </section>

      <Heading :level="6" class="run-detail-panel__nodes-title">Nodes</Heading>
      <ul class="run-detail-panel__timeline">
        <li
          v-for="(step, idx) in detail.nodeTimeline"
          :key="`${step.nodeId}-${idx}`"
          class="run-detail-panel__step run-detail-panel__step--clickable"
          role="button"
          tabindex="0"
          @click="emit('open-node-detail', step.nodeId)"
          @keydown.enter.prevent="emit('open-node-detail', step.nodeId)"
          @keydown.space.prevent="emit('open-node-detail', step.nodeId)"
        >
          <div class="run-detail-panel__step-head">
            <Badge :variant="nodeStatusVariant(step.status)">{{ step.status }}</Badge>
            <strong>{{ step.nodeName || step.nodeId }}</strong>
            <span class="run-detail-panel__type">{{ step.nodeType }}</span>
          </div>
          <div v-if="step.error" class="run-detail-panel__err">{{ step.error }}</div>
        </li>
      </ul>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Spinner from '@/components/common/feedback/Spinner.vue'
import Text from '@/components/common/typography/Text.vue'
import Badge from '@/components/common/feedback/Badge.vue'
import Alert from '@/components/common/feedback/Alert.vue'
import Heading from '@/components/common/typography/Heading.vue'
import Icon from '@/components/common/utils/Icon.vue'
import {
  webFlowService,
  type WebFlowExecutionDetail,
  type NodeTimelineEntry,
} from '@/services/webflow'

const props = defineProps<{
  webflowId: number
  runId: number
}>()

const emit = defineEmits<{
  (e: 'open-node-detail', nodeId: string): void
  (e: 'open-report'): void
  (e: 'clear'): void
  (e: 'sync-canvas-from-run', payload: {
    executionId: number
    nodeTimeline: NodeTimelineEntry[]
    variablePool: Record<string, unknown> | null | undefined
  }): void
}>()

const loading = ref(false)
const detail = ref<WebFlowExecutionDetail | null>(null)
const detailError = ref<string | null>(null)

const statusVariant = (s: string) => {
  if (s === 'completed') return 'success' as const
  if (s === 'failed') return 'error' as const
  return 'default' as const
}

const nodeStatusVariant = (s: string) => {
  if (s === 'SUCCESS') return 'success' as const
  if (s === 'FAILURE') return 'error' as const
  return 'default' as const
}

const formatTime = (iso: string) => {
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

const executionDurationLabel = computed(() => {
  const d = detail.value
  if (!d) return '—'
  if (d.status === 'running') return 'In progress…'
  try {
    const start = new Date(d.createdAt).getTime()
    const end = new Date(d.updatedAt).getTime()
    if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return '—'
    const ms = end - start
    if (ms < 1000) return `${Math.round(ms)} ms`
    if (ms < 60_000) return `${(ms / 1000).toFixed(1)} s`
    const m = Math.floor(ms / 60_000)
    const s = Math.round((ms % 60_000) / 1000)
    return `${m}m ${s}s`
  } catch {
    return '—'
  }
})

const emitCanvasSync = (ex: WebFlowExecutionDetail) => {
  emit('sync-canvas-from-run', {
    executionId: ex.id,
    nodeTimeline: ex.nodeTimeline || [],
    variablePool: ex.variablePool ?? null,
  })
}

const loadDetail = async (id: number) => {
  loading.value = true
  detailError.value = null
  detail.value = null
  try {
    let ex = await webFlowService.getExecution(props.webflowId, id)
    emitCanvasSync(ex)
    const maxPolls = 150
    let polls = 0
    while (ex.status === 'running' && polls < maxPolls) {
      await new Promise((r) => setTimeout(r, 600))
      ex = await webFlowService.getExecution(props.webflowId, id)
      polls += 1
      emitCanvasSync(ex)
    }
    detail.value = ex
  } catch {
    detailError.value = 'Could not load this run.'
  } finally {
    loading.value = false
  }
}

watch(
  () => [props.webflowId, props.runId] as const,
  ([wfId, runId]) => {
    if (!wfId || Number.isNaN(wfId) || !runId) return
    void loadDetail(runId)
  },
  { immediate: true }
)
</script>

<style scoped>
.run-detail-panel {
  position: absolute;
  right: var(--space-3, 12px);
  bottom: var(--space-3, 12px);
  z-index: 10;
  width: min(380px, calc(100% - 24px));
  max-height: min(52vh, 520px);
  display: flex;
  flex-direction: column;
  padding: var(--space-3);
  border-radius: var(--radius-md, 8px);
  border: 1px solid var(--color-border-subtle, var(--border-subtle));
  background: var(--color-surface-elevated, var(--bg-elevated));
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  overflow: hidden;
}
.run-detail-panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
  flex-shrink: 0;
}
.run-detail-panel__title {
  margin: 0;
  font-size: var(--text-md);
}
.run-detail-panel__close {
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: var(--radius-sm);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.run-detail-panel__close:hover {
  color: var(--text-primary);
  background: var(--color-surface-hover, rgba(0, 0, 0, 0.06));
}
.run-detail-panel__report-row {
  flex-shrink: 0;
  margin-bottom: var(--space-2);
}
.run-detail-panel__report-btn {
  border: none;
  background: transparent;
  padding: 0;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--accent-blue, #1976d2);
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.run-detail-panel__report-btn:hover {
  opacity: 0.88;
}
.run-detail-panel__loading {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: var(--space-2) 0;
}
.run-detail-panel__meta {
  flex-shrink: 0;
  border: 1px solid var(--color-border-subtle, #e0e0e0);
  border-radius: var(--radius-md, 8px);
  padding: var(--space-2);
  /* background: var(--color-surface-muted, #f5f5f5); */
  margin-bottom: var(--space-2);
}
.run-detail-panel__dl {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.run-detail-panel__dl-row {
  display: grid;
  grid-template-columns: 6.5rem 1fr;
  gap: 8px;
  align-items: start;
  font-size: 0.8rem;
}
.run-detail-panel__dl-row dt {
  margin: 0;
  font-weight: 600;
  color: var(--text-muted);
}
.run-detail-panel__dl-row dd {
  margin: 0;
  word-break: break-word;
}
.run-detail-panel__error-dd {
  color: var(--color-danger, #c62828);
}
.run-detail-panel__nodes-title {
  margin: 0 0 var(--space-2);
  font-size: var(--text-sm);
  flex-shrink: 0;
}
.run-detail-panel__timeline {
  list-style: none;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  max-height: 300px;
  overflow-y: auto;
}
.run-detail-panel__step {
  border: 1px solid var(--color-border-subtle, #e0e0e0);
  border-radius: var(--radius-sm, 6px);
  padding: var(--space-2);
  font-size: 0.8rem;
}
.run-detail-panel__step--clickable {
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}
.run-detail-panel__step--clickable:hover {
  background: var(--color-surface-hover, rgba(0, 0, 0, 0.04));
  border-color: var(--accent-blue, #1976d2);
}
.run-detail-panel__step--clickable:focus-visible {
  outline: 2px solid var(--accent-blue, #1976d2);
  outline-offset: 2px;
}
.run-detail-panel__step-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}
.run-detail-panel__type {
  font-size: 0.7rem;
  opacity: 0.75;
}
.run-detail-panel__hint {
  font-size: 0.75rem;
  opacity: 0.85;
}
.run-detail-panel__err {
  color: var(--color-danger, #c62828);
  font-size: 0.8rem;
  margin: 4px 0;
}
.run-detail-panel__json {
  margin: 0;
  font-size: 0.7rem;
  max-height: 120px;
  overflow: auto;
  background: var(--color-surface-muted, #eee);
  padding: 6px;
  border-radius: 4px;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
