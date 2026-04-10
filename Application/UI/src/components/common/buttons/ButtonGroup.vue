<template>
  <div class="af-button-group" role="group">
    <slot />
  </div>
</template>

<script setup lang="ts">
// presentational wrapper
</script>

<style scoped>
.af-button-group {
  display: inline-flex;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  overflow: hidden;
}

.af-button-group :deep(button) {
  border-radius: 0;
}

.af-button-group :deep(button + button) {
  border-left: 1px solid var(--border-subtle);
}
</style>
