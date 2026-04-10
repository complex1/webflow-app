<template>
  <div
    class="af-divider"
    :class="[`af-divider--${orientation}`]"
    role="separator"
    :aria-orientation="orientation"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{ orientation?: 'horizontal' | 'vertical' }>(),
  {
    orientation: 'horizontal'
  }
)

const orientation = computed(() => props.orientation)
</script>

<style scoped>
.af-divider {
  background: var(--border-subtle);
  flex-shrink: 0;
}

.af-divider--horizontal {
  width: 100%;
  height: 1px;
}

.af-divider--vertical {
  width: 1px;
  height: 100%;
}
</style>
