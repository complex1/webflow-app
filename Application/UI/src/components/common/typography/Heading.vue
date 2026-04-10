<template>
  <component :is="tag" class="af-heading" :class="`af-heading--h${level}`" :style="headingStyle">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { toneMap, type Tone } from '@/components/common/tokens'

const sizeMap = {
  1: '24px',
  2: '20px',
  3: '18px',
  4: '16px',
  5: '14px',
  6: '12px',
} as const

type HeadingLevel = keyof typeof sizeMap

const props = withDefaults(
  defineProps<{
    level?: HeadingLevel
    tone?: Tone
    align?: 'left' | 'center' | 'right'
  }>(),
  {
    level: 2,
    tone: 'primary',
    align: 'left'
  }
)

const tag = computed(() => `h${props.level}`)
const level = computed(() => props.level)

const headingStyle = computed(() => ({
  color: toneMap[props.tone],
  fontSize: sizeMap[props.level],
  textAlign: props.align as string
}))
</script>

<style scoped>
.af-heading {
  margin: 0;
  font-weight: 600;
  line-height: 1.3;
}
</style>
