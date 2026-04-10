<template>
  <span class="af-tooltip" @mouseenter="show = true" @mouseleave="show = false">
    <slot />
    <Transition name="af-fade">
      <span v-if="show" class="af-tooltip__bubble" role="tooltip">
        {{ text }}
      </span>
    </Transition>
  </span>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ text: string }>()

const show = ref(false)
</script>

<style scoped>
.af-tooltip {
  position: relative;
  display: inline-flex;
}

.af-tooltip__bubble {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  color: var(--text-secondary);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  white-space: nowrap;
  font-size: var(--text-xs);
  z-index: var(--z-popover);
}

.af-fade-enter-active,
.af-fade-leave-active {
  transition: opacity var(--transition-default);
}

.af-fade-enter-from,
.af-fade-leave-to {
  opacity: 0;
}
</style>
