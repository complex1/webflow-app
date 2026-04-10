<template>
  <p class="af-error-text" :id="id">
    <slot />
  </p>
</template>

<script setup lang="ts">
const props = defineProps<{ id?: string }>()
const id = props.id
</script>

<style scoped>
.af-error-text {
  margin: 0;
  font-size: var(--text-xs);
  color: var(--error-red);
}
</style>
