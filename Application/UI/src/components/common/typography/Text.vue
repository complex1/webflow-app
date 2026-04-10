<template>
  <component :is="tag" class="af-text" :style="textStyle">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  textSizeMap,
  toneMap,
  type TextVariant,
  type Tone
} from '@/components/common/tokens'

type Weight = 'regular' | 'medium' | 'semibold'

const weightMap: Record<Weight, number> = {
  regular: 400,
  medium: 500,
  semibold: 600
}

const props = withDefaults(
  defineProps<{
    as?: keyof HTMLElementTagNameMap
    variant?: TextVariant
    tone?: Tone
    weight?: Weight
    monospace?: boolean
  }>(),
  {
    as: 'p',
    variant: 'md',
    tone: 'primary',
    weight: 'regular',
    monospace: false
  }
)

const tag = computed(() => props.as ?? 'p')

const textStyle = computed(() => ({
  fontSize: textSizeMap[props.variant],
  color: toneMap[props.tone],
  fontWeight: weightMap[props.weight],
  fontFamily: props.monospace ? 'var(--font-mono)' : undefined
}))
</script>

<style scoped>
.af-text {
  margin: 0;
  line-height: 1.5;
}
</style>
