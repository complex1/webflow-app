<template>
  <code class="af-code-text" :style="style">
    <slot />
  </code>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { toneMap, textSizeMap, type TextVariant, type Tone } from '@/components/common/tokens'

const props = withDefaults(
  defineProps<{
    variant?: TextVariant
    tone?: Tone
  }>(),
  {
    variant: 'sm',
    tone: 'secondary'
  }
)

const style = computed(() => ({
  fontSize: textSizeMap[props.variant],
  color: toneMap[props.tone]
}))
</script>

<style scoped>
.af-code-text {
  font-family: var(--font-mono);
  padding: 0 var(--space-2);
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-subtle);
}
</style>
