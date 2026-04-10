<template>
  <div class="af-alert" :class="`af-alert--${variant}`" role="alert">
    <Icon v-if="icon" :name="icon" class="af-alert__icon" />
    <div class="af-alert__body">
      <strong v-if="title">{{ title }}</strong>
      <p>
        <slot />
      </p>
    </div>
    <button v-if="dismissible" class="af-alert__close" type="button" @click="$emit('dismiss')">
      <Icon name="times" />
    </button>
  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/common/utils/Icon.vue'

type Variant = 'info' | 'success' | 'warning' | 'error'

withDefaults(
  defineProps<{
    title?: string
    variant?: Variant
    icon?: string
    dismissible?: boolean
  }>(),
  {
    variant: 'info',
    icon: 'info-circle',
    dismissible: false
  }
)

defineEmits<{ (e: 'dismiss'): void }>()
</script>

<style scoped>
.af-alert {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-default);
  /* rgba — html2canvas cannot parse color-mix() */
  background: rgba(31, 41, 55, 0.82);
}

.af-alert__icon {
  margin-top: 2px;
}

.af-alert p {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.af-alert__close {
  margin-left: auto;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
}

.af-alert--success {
  border-color: rgba(34, 197, 94, 0.35);
}

.af-alert--warning {
  border-color: rgba(245, 158, 11, 0.35);
}

.af-alert--error {
  border-color: rgba(239, 68, 68, 0.45);
}
</style>
