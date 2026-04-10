<template>
  <nav class="af-breadcrumbs" aria-label="Breadcrumb">
    <ol>
      <li v-for="(item, index) in items" :key="item.label">
        <button
          class="af-breadcrumb"
          :disabled="index === items.length - 1"
          type="button"
          @click="$emit('navigate', item)"
        >
          {{ item.label }}
        </button>
        <span v-if="index < items.length - 1" class="af-breadcrumb__divider">/</span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
interface BreadcrumbItem {
  label: string
  href?: string
  value?: string
}

withDefaults(defineProps<{ items: BreadcrumbItem[] }>(), { items: () => [] })

defineEmits<{ (e: 'navigate', item: BreadcrumbItem): void }>()
</script>

<style scoped>
.af-breadcrumbs ol {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--space-1);
  color: var(--text-secondary);
}

.af-breadcrumb {
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: var(--text-sm);
}

.af-breadcrumb:disabled {
  color: var(--text-muted);
  cursor: default;
}
</style>
