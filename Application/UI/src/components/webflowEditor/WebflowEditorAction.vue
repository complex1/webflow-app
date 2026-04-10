<template>
  <div class="webflow-editor-action">
    <template v-if="mode === 'view'">
      <Heading
        v-if="linkedEnvFiles && linkedEnvFiles.length > 0"
        :level="5"
        class="mr-2"
        >Env File:</Heading
      >
      <SelectInput
        v-if="linkedEnvFiles && linkedEnvFiles.length > 0"
        :options="envFileOptions"
        v-model="selectedEnvFile"
        placeholder="Select Env File"
        @update:modelValue="emit('changeEnvFile', Number($event))"
      />
      <div class="run-history" v-tooltip="'Run history'">
        <label class="run-history__label" for="webflow-run-picker">Run history</label>
        <WebflowExecutionPicker
          trigger-id="webflow-run-picker"
          :webflow-id="webflowId"
          :model-value="selectedRunId"
          :disabled="runPickerDisabled"
          :refresh-token="runPickerRefreshToken"
          @update:model-value="onPickerRun($event)"
        />
      </div>
      <button
        v-if="selectedRunId"
        class="icon-btn icon-btn--sm"
        type="button"
        @click="emit('open-run-report')"
        v-tooltip="'Execution report'"
      >
        <Icon name="history" />
      </button>
      <button
        class="icon-btn icon-btn--sm"
        type="button"
        :disabled="executeDisabled"
        @click="emit('execute')"
        v-tooltip="'Run on server'"
      >
        <Icon name="play" />
      </button>
      <button
        class="icon-btn icon-btn--sm"
        type="button"
        @click="emit('enterEdit')"
        v-tooltip="'Edit canvas'"
      >
        <Icon name="pencil" />
      </button>
      <button
        class="icon-btn icon-btn--sm"
        type="button"
        @click="emit('export')"
        v-tooltip="'Export Web Flow'"
      >
        <Icon name="download" />
      </button>
      <Popover
        v-if="shareControlsAvailable"
        v-model:open="sharePopoverOpen"
        position="bottom-center"
        :show-arrow="true"
      >
        <button
          class="icon-btn icon-btn--sm"
          type="button"
          v-tooltip="'Public share link'"
          aria-label="Public share link"
        >
          <Icon name="link" />
        </button>
        <template #content>
          <div class="share-popover">
            <Text variant="sm" weight="medium" class="share-popover__title">Documentation link</Text>
            <Text variant="sm" tone="muted" class="share-popover__hint">
              Anyone with the link can view this flow (no sign-in). Env values and runs stay private.
            </Text>
            <label v-if="!shareSettingsLoading" class="share-popover__toggle">
              <input
                type="checkbox"
                :checked="publicShareEnabled"
                @change="onToggleShare"
              />
              <span>Enable public link</span>
            </label>
            <Text v-else variant="sm" tone="muted">Loading…</Text>
            <div v-if="publicShareEnabled && publicSharePath && !shareSettingsLoading" class="share-popover__row">
              <code class="share-popover__code">{{ fullShareUrl }}</code>
              <button type="button" class="share-popover__copy" @click="emit('copy-public-link')">
                Copy
              </button>
            </div>
          </div>
        </template>
      </Popover>
    </template>

    <template v-else>
      <Popover v-model:open="showPopover" position="bottom-center" :show-arrow="true">
        <button class="icon-btn icon-btn--sm" type="button" v-tooltip="'Add Node'">
          <Icon name="plus" />
        </button>
        <template #content>
          <div class="popover">
            <button class="popover__item" type="button" @click="choose('api')">API node</button>
            <button class="popover__item" type="button" @click="choose('curl')">cURL node</button>
            <button
              v-if="hasOpenApiConfig"
              class="popover__item"
              type="button"
              @click="choose('openapi')"
            >
              OpenAPI node
            </button>
            <button class="popover__item" type="button" @click="choose('transform')">
              Transform node
            </button>
          </div>
        </template>
      </Popover>
      <button
        class="icon-btn icon-btn--sm"
        type="button"
        @click="emit('openTestRun')"
        v-tooltip="'Test run (local)'"
      >
        <Icon name="angle-right" />
      </button>
      <button
        class="icon-btn icon-btn--sm"
        type="button"
        :disabled="saveDisabled"
        @click="emit('save')"
        v-tooltip="'Save Web Flow'"
      >
        <Icon name="save" />
      </button>
      <button
        class="icon-btn icon-btn--sm"
        type="button"
        @click="emit('cancelEdit')"
        v-tooltip="'Exit edit mode'"
      >
        <Icon name="times" />
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import Icon from "@/components/common/utils/Icon.vue";
import Popover from "@/components/common/overlay/Popover.vue";
import type { WebflowLinkedEnvFiles } from "@/services/webflow";
import WebflowExecutionPicker from "./WebflowExecutionPicker.vue";
import SelectInput from "../common/forms/SelectInput.vue";
import Heading from "../common/typography/Heading.vue";
import Text from "../common/typography/Text.vue";
import type { NodeOption } from "@/types";

const props = withDefaults(
  defineProps<{
    mode: "view" | "edit";
    linkedEnvFiles: WebflowLinkedEnvFiles[];
    hasOpenApiConfig?: boolean;
    executeDisabled?: boolean;
    saveDisabled?: boolean;
    webflowId: number;
    /** Bumps when runs list should refresh (e.g. new execution finished). */
    runPickerRefreshToken?: number;
    selectedRunId: number | null;
    /** When true, show public share popover (owner editor only). */
    shareControlsAvailable?: boolean;
    publicShareEnabled?: boolean;
    publicSharePath?: string | null;
    shareSettingsLoading?: boolean;
  }>(),
  {
    runPickerRefreshToken: 0,
    selectedRunId: null,
    saveDisabled: false,
    shareControlsAvailable: false,
    publicShareEnabled: false,
    publicSharePath: null,
    shareSettingsLoading: false,
  }
);

const emit = defineEmits<{
  (e: "execute"): void;
  (e: "save"): void;
  (e: "add", type: NodeOption): void;
  (e: "changeEnvFile", envFileId: number): void;
  (e: "export"): void;
  (e: "select-run", id: number | null): void;
  (e: "open-run-report"): void;
  (e: "enterEdit"): void;
  (e: "cancelEdit"): void;
  (e: "openTestRun"): void;
  (e: "toggle-public-share", enabled: boolean): void;
  (e: "copy-public-link"): void;
}>();

const executeDisabled = computed(() => props.executeDisabled === true);

const saveDisabled = computed(() => props.saveDisabled === true);

const runPickerDisabled = computed(() => {
  return !Number.isFinite(props.webflowId) || props.webflowId <= 0;
});

function onPickerRun(id: number | null) {
  emit("select-run", id);
}

const selectedEnvFile = ref<number | null>(null);

const showPopover = ref(false);
const sharePopoverOpen = ref(false);

const fullShareUrl = computed(() => {
  const p = props.publicSharePath;
  if (!p) return "";
  if (typeof window === "undefined") return p;
  return `${window.location.origin}${p}`;
});

function onToggleShare(e: Event) {
  const el = e.target as HTMLInputElement;
  emit("toggle-public-share", el.checked);
}

const choose = (type: NodeOption) => {
  showPopover.value = false;
  emit("add", type);
};

const envFileOptions = computed(() => {
  return (
    props.linkedEnvFiles?.map((file) => ({
      label: file.name,
      value: file.id,
    })) || []
  );
});

watch(
  () => props.linkedEnvFiles,
  (newVal) => {
    if (props.mode !== "view") return;
    if (newVal && newVal.length > 0) {
      selectedEnvFile.value = newVal[0]?.id || null;
      emit("changeEnvFile", newVal[0]?.id || -1);
    }
  }
);
</script>

<style scoped>
.webflow-editor-action {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
  position: relative;
  align-items: center;
}

.icon-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--bg-elevated);
  color: var(--text-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color var(--transition-default),
    box-shadow var(--transition-default);
}

.icon-btn--sm {
  width: 32px;
  height: 32px;
}

.icon-btn:hover:not(:disabled) {
  border-color: var(--accent-blue);
  box-shadow: var(--focus-ring);
}

.icon-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.popover {
  min-width: 160px;
}

.popover__item {
  width: 100%;
  text-align: left;
  padding: 10px 14px;
  background: transparent;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
}

.popover__item:hover {
  background: color-mix(in srgb, var(--accent-blue) 12%, transparent);
}

.run-history {
  position: relative;
  min-width: 200px;
  max-width: 280px;
}
.run-history__label {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
.share-popover {
  padding: 12px 14px;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.share-popover__title {
  margin: 0;
}

.share-popover__hint {
  margin: 0;
  line-height: 1.4;
}

.share-popover__toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: var(--text-sm, 0.875rem);
  color: var(--text-primary);
}

.share-popover__toggle input {
  cursor: pointer;
}

.share-popover__row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.share-popover__code {
  flex: 1;
  min-width: 0;
  font-size: 0.75rem;
  word-break: break-all;
  padding: 6px 8px;
  border-radius: var(--radius-sm);
  background: var(--bg-subtle, rgba(255, 255, 255, 0.06));
  color: var(--text-primary);
}

.share-popover__copy {
  flex-shrink: 0;
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-subtle);
  background: var(--bg-elevated);
  color: var(--text-primary);
  font-size: var(--text-sm, 0.875rem);
  cursor: pointer;
}

.share-popover__copy:hover {
  border-color: var(--accent-blue);
}
</style>
