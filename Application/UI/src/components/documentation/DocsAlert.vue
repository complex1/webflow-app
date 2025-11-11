<template>
  <div class="docs-alert" :class="alertClass">
    <i class="docs-alert-icon" :class="iconClass"></i>
    <div class="docs-alert-content">
      <div v-if="title" class="docs-alert-title">{{ title }}</div>
      <div class="docs-alert-text">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  type?: 'info' | 'success' | 'warning' | 'danger'
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info'
})

const alertClass = computed(() => `docs-alert-${props.type}`)

const iconClass = computed(() => {
  const icons = {
    info: 'fas fa-info-circle',
    success: 'fas fa-check-circle',
    warning: 'fas fa-exclamation-triangle',
    danger: 'fas fa-exclamation-circle'
  }
  return icons[props.type]
})
</script>

<script lang="ts">
export default {
  name: 'DocsAlert'
}
</script>

<style scoped>
/* Styles are inherited from documentation.css */
</style>