<template>
  <p class="af-helper-text" :id="id">
    <slot />
  </p>
</template>

<script setup lang="ts">
const props = defineProps<{ id?: string }>()
const id = props.id
</script>

<style scoped>
.af-helper-text {
  margin: 0;
  font-size: var(--text-xs);
  color: var(--text-muted);
}
</style>
