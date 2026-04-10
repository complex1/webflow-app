<template>
  <Inline gap="xs" align="center" fullWidth class="transform-method">
    <Icon name="sliders-h" size="xxs" class="transform-method__icon" />
    <Popover>
      <TruncateText
        class="transform-method__text"
        :title="props.node.transform"
        >{{ props.node.transform }}</TruncateText
      >
      <template #content>
        <CodeEditor
          :modelValue="props.node.transform"
          :readOnly="true"
          language="javascript"
          height="300px"
        />
      </template>
    </Popover>
  </Inline>
</template>
<script setup lang="ts">
import type TransformNode from "@/apifluxCore/classes/transformNode";
import CodeEditor from "@/components/common/data/CodeEditor.vue";
import TruncateText from "@/components/common/typography/TruncateText.vue";

const props = defineProps<{
  node: TransformNode;
}>();
</script>
<style scoped>
.transform-method {
  padding: var(--space-1);
  background-color: rgba(0, 0, 0, 0.1);
}
.transform-method__icon {
  color: var(--text-muted);
  background: var(--transform-node-header-color);
  border-radius: var(--radius-xs);
  padding: var(--space-1);
}
.transform-method__text {
  flex-grow: 1;
  padding: 0 var(--space-1);
  font-size: var(--text-xs);
  border-radius: var(--radius-xs);
  font-family: var(--font-mono);
  color: var(--text-primary);
  background: var(--bg-soft);
}
.transform-method__text:hover {
  text-decoration: underline;
  cursor: pointer;
}
</style>
<style scoped>
.transform-method .af-popover {
  width: calc(100% - 24px);
}
</style>