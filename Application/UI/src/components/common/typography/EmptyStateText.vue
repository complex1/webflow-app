<template>
  <div class="af-empty-text">
    <Heading :level="3" tone="secondary">
      <slot name="title">Nothing here yet</slot>
    </Heading>
    <Text tone="muted" variant="sm">
      <slot>
        Add resources or configure this panel to start orchestrating your flow.
      </slot>
    </Text>
  </div>
</template>

<script setup lang="ts">
import Heading from './Heading.vue'
import Text from './Text.vue'
</script>

<style scoped>
.af-empty-text {
  text-align: center;
  padding: var(--space-4);
  border: 1px dashed var(--border-subtle);
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--bg-elevated) 60%, transparent);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}
</style>
