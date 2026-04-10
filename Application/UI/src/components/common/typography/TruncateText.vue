<template>
  <span class="af-truncate-text" :style="{ maxWidth }" v-tooltip="textTitle">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{ maxWidth?: string; title?: string }>(),
  { maxWidth: '100%' }
)

const maxWidth = computed(() => props.maxWidth)
const textTitle = computed(() => props.title)
</script>

<style scoped>
.af-truncate-text {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}
</style>
