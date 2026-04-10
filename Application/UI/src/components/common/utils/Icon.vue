<template>
  <i class="af-icon pi" :class="iconClass" :style="iconStyle" aria-hidden="true" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { iconSizeMap, toneMap, type IconSize, type Tone } from '@/components/common/tokens'

const props = withDefaults(
  defineProps<{ name: string; size?: IconSize; tone?: Tone }>(),
  {
    size: 'md',
    tone: 'inherit'
  }
)

const iconClass = computed(() => [`pi-${props.name}`])

const iconStyle = computed(() => ({
  fontSize: iconSizeMap[props.size],
  color: toneMap[props.tone]
}))
</script>

<style scoped>
.af-icon {
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
