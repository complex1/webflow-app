<template>
  <div ref="rootRef" class="wf-ex-picker">
    <button
      :id="triggerId"
      type="button"
      class="wf-ex-picker__trigger"
      :disabled="disabled || !webflowId"
      :aria-expanded="open"
      aria-haspopup="listbox"
      @click="toggleOpen"
    >
      <span class="wf-ex-picker__trigger-text">
        <template v-if="selectedSummary && modelValue === selectedSummary.id">
          <span class="wf-ex-picker__trigger-id">#{{ selectedSummary.id }}</span>
          <Badge class="wf-ex-picker__trigger-badge" :variant="statusBadgeVariant(selectedSummary.status)">{{
            selectedSummary.status
          }}</Badge>
          <span class="wf-ex-picker__trigger-time">{{ formatRunTime(selectedSummary.createdAt) }}</span>
        </template>
        <template v-else-if="modelValue != null && modelValue > 0">
          #{{ modelValue }}
        </template>
        <template v-else>
          {{ disabled ? "—" : "Select run…" }}
        </template>
      </span>
      <Icon name="chevron-down" class="wf-ex-picker__chevron" />
    </button>

    <div v-if="open" class="wf-ex-picker__panel" role="listbox" :aria-label="ariaLabel" tabindex="-1">
      <div
        ref="listRef"
        class="wf-ex-picker__list"
        @scroll.passive="onListScroll"
      >
        <button
          v-if="modelValue != null"
          type="button"
          class="wf-ex-picker__option wf-ex-picker__option--clear"
          @click="clearSelection"
        >
          Clear selection
        </button>
        <button
          v-for="ex in mergedItems"
          :key="ex.id"
          type="button"
          class="wf-ex-picker__option"
          :class="{ 'is-selected': modelValue === ex.id }"
          role="option"
          :aria-selected="modelValue === ex.id"
          @click="selectRun(ex.id)"
        >
          <div class="wf-ex-picker__option-row">
            <span class="wf-ex-picker__option-id">#{{ ex.id }}</span>
            <Badge :variant="statusBadgeVariant(ex.status)">{{ ex.status }}</Badge>
          </div>
          <span class="wf-ex-picker__option-sub">{{ formatRunTime(ex.createdAt) }}</span>
        </button>
        <div v-if="loading && mergedItems.length === 0" class="wf-ex-picker__hint">Loading…</div>
        <div v-else-if="!loading && mergedItems.length === 0" class="wf-ex-picker__hint">No runs yet.</div>
        <div v-if="loadingMore" class="wf-ex-picker__hint">Loading more…</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { onClickOutside } from "@vueuse/core";
import Icon from "@/components/common/utils/Icon.vue";
import Badge from "@/components/common/feedback/Badge.vue";
import {
  webFlowService,
  type WebFlowExecutionSummary,
  type WebFlowExecutionStatus,
} from "@/services/webflow";

const PAGE_SIZE = 20;

const props = withDefaults(
  defineProps<{
    webflowId: number;
    modelValue: number | null;
    disabled?: boolean;
    /** Increment to reset cache (e.g. new run finished). */
    refreshToken?: number;
    ariaLabel?: string;
    /** For &lt;label for&gt; association. */
    triggerId?: string;
  }>(),
  {
    disabled: false,
    refreshToken: 0,
    ariaLabel: "Run history",
    triggerId: undefined,
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", id: number | null): void;
}>();

const rootRef = ref<HTMLElement | null>(null);
const listRef = ref<HTMLElement | null>(null);

const open = ref(false);

const items = ref<WebFlowExecutionSummary[]>([]);
const page = ref(1);
const totalPages = ref(1);
const loading = ref(false);
const loadingMore = ref(false);
let fetchGeneration = 0;

const selectedSummary = ref<WebFlowExecutionSummary | null>(null);

function statusBadgeVariant(
  status: WebFlowExecutionStatus | string
): "success" | "error" | "warning" | "default" {
  if (status === "completed") return "success";
  if (status === "failed") return "error";
  if (status === "running") return "warning";
  return "default";
}

watch(
  () => props.webflowId,
  () => {
    fetchGeneration++;
    items.value = [];
    page.value = 1;
    totalPages.value = 1;
    selectedSummary.value = null;
    void hydrateSelectedLabel();
  }
);

watch(
  () => props.refreshToken,
  () => {
    if (!open.value) {
      items.value = [];
    }
    void hydrateSelectedLabel();
    if (open.value) {
      void resetAndLoadFirstPage();
    }
  }
);

watch(
  () => props.modelValue,
  () => {
    void hydrateSelectedLabel();
  }
);

async function hydrateSelectedLabel() {
  const id = props.modelValue;
  const wf = props.webflowId;
  if (!id || !wf || Number.isNaN(wf) || wf <= 0) {
    selectedSummary.value = null;
    return;
  }
  const inList = items.value.find((e) => e.id === id);
  if (inList) {
    selectedSummary.value = inList;
    return;
  }
  try {
    const ex = await webFlowService.getExecution(wf, id);
    selectedSummary.value = {
      id: ex.id,
      webFlowId: ex.webFlowId,
      status: ex.status,
      errorSummary: ex.errorSummary,
      createdAt: ex.createdAt,
      updatedAt: ex.updatedAt,
    };
  } catch {
    selectedSummary.value = null;
  }
}

onMounted(() => {
  void hydrateSelectedLabel();
});

const mergedItems = computed(() => {
  const id = props.modelValue;
  if (!id || !selectedSummary.value || selectedSummary.value.id !== id) {
    return items.value;
  }
  if (items.value.some((e) => e.id === id)) {
    return items.value;
  }
  return [selectedSummary.value, ...items.value];
});

function formatRunTime(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

onClickOutside(rootRef, () => {
  open.value = false;
});

function toggleOpen() {
  if (props.disabled || !props.webflowId) return;
  open.value = !open.value;
  if (open.value) {
    void resetAndLoadFirstPage();
  }
}

async function resetAndLoadFirstPage() {
  const wf = props.webflowId;
  if (!wf || Number.isNaN(wf) || wf <= 0) return;
  const gen = ++fetchGeneration;
  items.value = [];
  page.value = 1;
  totalPages.value = 1;
  loading.value = true;
  loadingMore.value = false;
  try {
    const res = await webFlowService.listExecutions(wf, 1, PAGE_SIZE);
    if (gen !== fetchGeneration) return;
    items.value = res.executions;
    page.value = res.pagination.page;
    totalPages.value = res.pagination.pages;
  } catch {
    if (gen === fetchGeneration) {
      items.value = [];
    }
  } finally {
    if (gen === fetchGeneration) {
      loading.value = false;
    }
  }
}

async function loadNextPage() {
  const wf = props.webflowId;
  if (!wf || loadingMore.value || loading.value) return;
  if (page.value >= totalPages.value) return;
  const gen = fetchGeneration;
  loadingMore.value = true;
  try {
    const next = page.value + 1;
    const res = await webFlowService.listExecutions(wf, next, PAGE_SIZE);
    if (gen !== fetchGeneration) return;
    const existing = new Set(items.value.map((e) => e.id));
    for (const ex of res.executions) {
      if (!existing.has(ex.id)) {
        items.value.push(ex);
        existing.add(ex.id);
      }
    }
    page.value = res.pagination.page;
    totalPages.value = res.pagination.pages;
  } finally {
    if (gen === fetchGeneration) {
      loadingMore.value = false;
    }
  }
}

function onListScroll() {
  const el = listRef.value;
  if (!el) return;
  const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 48;
  if (nearBottom) {
    void loadNextPage();
  }
}

function selectRun(id: number) {
  emit("update:modelValue", id);
  const picked = mergedItems.value.find((e) => e.id === id);
  if (picked) {
    selectedSummary.value = picked;
  }
  open.value = false;
}

function clearSelection() {
  emit("update:modelValue", null);
  selectedSummary.value = null;
  open.value = false;
}
</script>

<style scoped>
.wf-ex-picker {
  position: relative;
  min-width: 200px;
  max-width: 320px;
}

.wf-ex-picker__trigger {
  width: 100%;
  min-height: 32px;
  padding: 4px 32px 4px 10px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--bg-elevated);
  color: var(--text-primary);
  font-size: var(--text-sm, 0.875rem);
  text-align: left;
  cursor: pointer;
  position: relative;
}

.wf-ex-picker__trigger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.wf-ex-picker__trigger-text {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.wf-ex-picker__trigger-id {
  font-weight: 500;
}

.wf-ex-picker__trigger-time {
  font-size: 0.75rem;
  color: var(--text-muted);
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wf-ex-picker__trigger-badge {
  flex-shrink: 0;
}

.wf-ex-picker__chevron {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--text-muted);
  font-size: 0.75rem;
}

.wf-ex-picker__panel {
  position: absolute;
  z-index: 50;
  left: 0;
  right: 0;
  margin-top: 4px;
  padding: 8px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--bg-secondary);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  gap: 0;
  min-width: min(360px, 92vw);
}

.wf-ex-picker__list {
  max-height: min(280px, 50vh);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.wf-ex-picker__option {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: 8px 10px;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  text-align: left;
  width: 100%;
  font-size: var(--text-sm, 0.875rem);
}

.wf-ex-picker__option--clear {
  color: var(--text-muted);
  font-size: 0.8125rem;
}

.wf-ex-picker__option:hover,
.wf-ex-picker__option.is-selected {
  background: color-mix(in srgb, var(--accent-blue) 14%, transparent);
}

.wf-ex-picker__option-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
}

.wf-ex-picker__option-id {
  font-weight: 600;
}

.wf-ex-picker__option-sub {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.wf-ex-picker__hint {
  padding: 10px;
  font-size: var(--text-sm, 0.875rem);
  color: var(--text-muted);
  text-align: center;
}
</style>
