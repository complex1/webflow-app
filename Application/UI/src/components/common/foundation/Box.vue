<template>
  <component
    :is="tag"
    class="af-box"
    :class="{
      'af-box--interactive': interactive,
      'af-box--full-width': fullWidth,
      'af-box--full-height': fullHeight
    }"
    :style="boxStyle"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { radiusScale, spacingScale, type RadiusToken, type SpacingToken } from '@/components/common/tokens'

const backgroundMap = {
  primary: 'var(--bg-primary)',
  secondary: 'var(--bg-secondary)',
  elevated: 'var(--bg-elevated)',
  transparent: 'transparent'
} as const

type BackgroundToken = keyof typeof backgroundMap

const props = withDefaults(
  defineProps<{
    as?: keyof HTMLElementTagNameMap
    padding?: SpacingToken
    background?: BackgroundToken
    radius?: RadiusToken
    bordered?: boolean
    interactive?: boolean
    fullWidth?: boolean
    fullHeight?: boolean
    display?: 'block' | 'flex' | 'inline-flex'
    direction?: 'row' | 'column'
    align?: string
    justify?: string
    gap?: SpacingToken
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
    alignContent?: string
  }>(),
  {
    as: 'div',
    padding: 'md',
    background: 'secondary',
    radius: 'md',
    bordered: true,
    interactive: false,
    fullWidth: false,
    fullHeight: false,
    display: 'block',
    direction: 'column',
    align: 'stretch',
    justify: 'flex-start',
    wrap: 'nowrap',
    alignContent: 'stretch'
  }
)

const tag = computed(() => props.as ?? 'div')

const boxStyle = computed(() => ({
  padding: spacingScale[props.padding],
  background: backgroundMap[props.background],
  borderRadius: radiusScale[props.radius],
  border: props.bordered ? '1px solid var(--border-default)' : '1px solid transparent',
  display: props.display,
  flexDirection: props.display?.includes('flex') ? props.direction : undefined,
  alignItems: props.display?.includes('flex') ? props.align : undefined,
  justifyContent: props.display?.includes('flex') ? props.justify : undefined,
  gap: props.gap ? spacingScale[props.gap] : undefined,
  flexWrap: props.display?.includes('flex') ? props.wrap : undefined,
  alignContent: props.display?.includes('flex') ? props.alignContent : undefined
}))
</script>

<style scoped>
.af-box {
  display: block;
  color: var(--text-primary);
  transition: border-color var(--transition-default), background var(--transition-default);
}

.af-box--full-width {
  width: 100%;
}

.af-box--full-height {
  height: 100%;
}

.af-box--interactive:hover {
  border-color: var(--accent-blue);
}

.af-box--interactive:focus-within {
  box-shadow: var(--focus-ring);
  border-color: var(--accent-blue);
}
</style>
