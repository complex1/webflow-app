<template>
  <Stack gap="xs">
    <CodeEditor
      :model-value="internalValue"
      :extensions="jsonExtensions"
      :readonly="readonly"
      :min-height="minHeight"
      :max-height="maxHeight"
      @update:model-value="onInput"
    />
    <InlineMessage v-if="error" tone="error" icon="exclamation-triangle">{{
      error
    }}</InlineMessage>
    <Inline gap="sm">
      <Button variant="ghost" size="sm" type="button" @click="format"
        >Format JSON</Button
      >
    </Inline>
  </Stack>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { json } from "@codemirror/lang-json";
import CodeEditor from "./CodeEditor.vue";
import { InlineMessage } from "@/components/common/feedback";
import { Button } from "@/components/common/buttons";
import { Inline, Stack } from "@/components/common/foundation";

const props = defineProps<{
  modelValue: unknown;
  readonly?: boolean;
  minHeight?: string;
  maxHeight?: string;
}>();
const emit = defineEmits<{ (e: "update:modelValue", value: unknown): void }>();

const serialize = (value: unknown) => {
  try {
    return JSON.stringify(value ?? {}, null, 2);
  } catch {
    return '{\n  "key": "value"\n}';
  }
};

const internalValue = ref(serialize(props.modelValue));
const error = ref("");

const jsonExtensions = computed(() => [json()]);

watch(
  () => props.modelValue,
  (value) => {
    internalValue.value = serialize(value);
    error.value = "";
  }
);

const onInput = (value: string) => {
  internalValue.value = value;
  try {
    const parsed = JSON.parse(value);
    emit("update:modelValue", parsed);
    error.value = "";
  } catch (err: any) {
    error.value = err.message;
  }
};

const validate = () => {
  try {
    JSON.parse(internalValue.value);
    error.value = "";
  } catch (err: any) {
    error.value = err.message;
  }
};

const format = () => {
  try {
    const parsed = JSON.parse(internalValue.value);
    const formatted = JSON.stringify(parsed, null, 2);
    internalValue.value = formatted;
    emit("update:modelValue", parsed);
    error.value = "";
  } catch (err: any) {
    error.value = "Invalid JSON";
  }
};

validate();
</script>
