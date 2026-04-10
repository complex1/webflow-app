<template>
  <div class="af-spacer" :style="{ height: sizeValue }" aria-hidden="true" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { spacingScale, type SpacingToken } from '@/components/common/tokens'

const props = withDefaults(
  defineProps<{ size?: SpacingToken }>(),
  { size: 'md' }
)

const sizeValue = computed(() => spacingScale[props.size])
</script>

<style scoped>
.af-spacer {
  width: 100%;
}
</style>
