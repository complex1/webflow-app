<template>
  <component
    :is="tag"
    class="af-inline"
    :class="{
      'af-inline--wrap': wrap,
      'af-inline--full-width': fullWidth
    }"
    :style="inlineStyle"
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
    wrap?: boolean
    fullWidth?: boolean
  }>(),
  {
    as: 'div',
    gap: 'sm',
    align: 'center',
    justify: 'flex-start',
    wrap: false,
    fullWidth: false
  }
)

const tag = computed(() => props.as ?? 'div')

const inlineStyle = computed<CSSProperties>(() => ({
  gap: spacingScale[props.gap],
  alignItems: props.align,
  justifyContent: props.justify
}))
</script>

<style scoped>
.af-inline {
  display: inline-flex;
  align-items: center;
}

.af-inline--wrap {
  flex-wrap: wrap;
}

.af-inline--full-width {
  width: 100%;
}
</style>
