<template>
  <component
    :is="tag"
    class="af-stack"
    :class="{
      'af-stack--full-width': fullWidth,
      'af-stack--full-height': fullHeight
    }"
    :style="stackStyle"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import { spacingScale, type SpacingToken } from '@/components/common/tokens'

const props = withDefaults(
  defineProps<{
    as?: keyof HTMLElementTagNameMap
    gap?: SpacingToken
    align?: CSSProperties['alignItems']
    justify?: CSSProperties['justifyContent']
    fullWidth?: boolean
    fullHeight?: boolean
  }>(),
  {
    as: 'div',
    gap: 'md',
    align: 'stretch',
    justify: 'flex-start',
    fullWidth: false,
    fullHeight: false
  }
)

const tag = computed(() => props.as ?? 'div')

const stackStyle = computed<CSSProperties>(() => ({
  gap: spacingScale[props.gap],
  alignItems: props.align,
  justifyContent: props.justify
}))
</script>

<style scoped>
.af-stack {
  display: flex;
  flex-direction: column;
}

.af-stack--full-width {
  width: 100%;
}

.af-stack--full-height {
  height: 100%;
}
</style>
