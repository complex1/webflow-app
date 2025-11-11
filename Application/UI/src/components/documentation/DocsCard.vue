<template>
  <div class="docs-card">
    <!-- Card Header -->
    <div class="docs-card-header" v-if="title || badge || $slots.header">
      <slot name="header">
        <h3 class="docs-card-title">{{ title }}</h3>
        <span v-if="badge" class="docs-card-badge" :class="badgeVariant">
          {{ badge }}
        </span>
      </slot>
    </div>

    <!-- Card Content -->
    <div class="docs-card-content">
      <slot></slot>
    </div>

    <!-- Card Footer -->
    <div v-if="$slots.footer" class="docs-card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  badge?: string
  badgeVariant?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
}

withDefaults(defineProps<Props>(), {
  badgeVariant: 'primary'
})
</script>

<script lang="ts">
export default {
  name: 'DocsCard'
}
</script>

<style scoped>
.docs-card-content {
  flex: 1;
}

.docs-card-footer {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border-subtle);
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
}
</style>