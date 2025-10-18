<template>
  <nav :class="breadcrumbClasses" aria-label="Breadcrumb">
    <ol class="ui-breadcrumb-list">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="ui-breadcrumb-item"
        :class="{ 'ui-breadcrumb-item--active': index === items.length - 1 }"
      >
        <component
          :is="getItemComponent(item, index)"
          :href="item.href"
          :to="item.to"
          :class="getItemClasses(item, index)"
          @click="handleItemClick(item, index)"
        >
          <i v-if="item.icon" :class="item.icon" class="ui-breadcrumb-icon"></i>
          <span class="ui-breadcrumb-text">{{ item.text }}</span>
        </component>
        
        <i
          v-if="index < items.length - 1"
          :class="separatorIcon"
          class="ui-breadcrumb-separator"
        ></i>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface BreadcrumbItem {
  text: string
  href?: string
  to?: string | object
  icon?: string
  disabled?: boolean
  clickable?: boolean
}

interface Props {
  items: BreadcrumbItem[]
  separator?: string
  separatorIcon?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'minimal' | 'pills'
  maxItems?: number
  showHome?: boolean
  homeIcon?: string
  homeText?: string
  homeHref?: string
  homeTo?: string | object
}

const props = withDefaults(defineProps<Props>(), {
  separator: '/',
  separatorIcon: 'fas fa-chevron-right',
  size: 'md',
  variant: 'default',
  maxItems: 5,
  showHome: false,
  homeIcon: 'fas fa-home',
  homeText: 'Home',
  homeHref: '/',
  homeTo: '/'
})

const emit = defineEmits<{
  itemClick: [item: BreadcrumbItem, index: number]
}>()

const breadcrumbClasses = computed(() => [
  'ui-breadcrumb',
  `ui-breadcrumb--${props.size}`,
  `ui-breadcrumb--${props.variant}`
])

const getItemComponent = (item: BreadcrumbItem, index: number) => {
  if (item.href) return 'a'
  if (item.to) return 'router-link'
  if (item.clickable !== false) return 'button'
  return 'span'
}

const getItemClasses = (item: BreadcrumbItem, index: number) => {
  const isLast = index === props.items.length - 1
  const isClickable = item.href || item.to || item.clickable !== false
  
  return [
    'ui-breadcrumb-link',
    {
      'ui-breadcrumb-link--active': isLast,
      'ui-breadcrumb-link--disabled': item.disabled,
      'ui-breadcrumb-link--clickable': isClickable && !item.disabled
    }
  ]
}

const handleItemClick = (item: BreadcrumbItem, index: number) => {
  if (!item.disabled) {
    emit('itemClick', item, index)
  }
}

// Process items to include home if needed
const processedItems = computed(() => {
  let items = [...props.items]
  
  if (props.showHome) {
    const homeItem: BreadcrumbItem = {
      text: props.homeText,
      href: props.homeHref,
      to: props.homeTo,
      icon: props.homeIcon
    }
    items = [homeItem, ...items]
  }
  
  // Limit items if maxItems is set
  if (props.maxItems && items.length > props.maxItems) {
    const start = items.slice(0, 1)
    const end = items.slice(-(props.maxItems - 2))
    const ellipsis: BreadcrumbItem = {
      text: '...',
      disabled: true
    }
    items = [...start, ellipsis, ...end]
  }
  
  return items
})
</script>

<style scoped>
/* Base breadcrumb styles */
.ui-breadcrumb {
  display: flex;
  align-items: center;
}

/* Size variants */
.ui-breadcrumb--sm {
  font-size: var(--font-size-sm);
}

.ui-breadcrumb--md {
  font-size: var(--font-size-base);
}

.ui-breadcrumb--lg {
  font-size: var(--font-size-lg);
}

/* Variant styles */
.ui-breadcrumb--default {
  background: var(--color-background-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-sm) var(--spacing-md);
}

.ui-breadcrumb--minimal {
  background: transparent;
}

.ui-breadcrumb--pills {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  padding: var(--spacing-sm) var(--spacing-md);
}

/* Breadcrumb list */
.ui-breadcrumb-list {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin: 0;
  padding: 0;
  list-style: none;
}

.ui-breadcrumb-item {
  display: flex;
  align-items: center;
}

.ui-breadcrumb-item--active .ui-breadcrumb-text {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
}

/* Breadcrumb links */
.ui-breadcrumb-link {
  display: flex;
  align-items: center;
  color: var(--color-text-secondary);
  transition: color var(--transition-fast);
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.ui-breadcrumb-link--active {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
}

.ui-breadcrumb-link--disabled {
  color: var(--color-gray-400);
  cursor: not-allowed;
}

.ui-breadcrumb-link--clickable {
  cursor: pointer;
}

.ui-breadcrumb-link--clickable:hover {
  color: var(--color-primary);
}

/* Breadcrumb elements */
.ui-breadcrumb-icon {
  margin-right: var(--spacing-xs);
  font-size: var(--font-size-sm);
}

.ui-breadcrumb-text {
  white-space: nowrap;
}

.ui-breadcrumb-separator {
  color: var(--color-gray-400);
  margin: 0 var(--spacing-sm);
  font-size: var(--font-size-xs);
}

/* Pills variant specific styles */
.ui-breadcrumb--pills .ui-breadcrumb-link--active {
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border-radius: var(--radius-full);
  padding: var(--spacing-xs) var(--spacing-md);
}

.ui-breadcrumb--pills .ui-breadcrumb-link--clickable:hover {
  background: var(--color-gray-100);
  border-radius: var(--radius-full);
  padding: var(--spacing-xs) var(--spacing-md);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .ui-breadcrumb-list {
    gap: 2px;
  }
  
  .ui-breadcrumb-text {
    font-size: var(--font-size-sm);
  }
  
  .ui-breadcrumb-separator {
    margin: 0 var(--spacing-xs);
  }
}

/* Focus styles for accessibility */
.ui-breadcrumb-link:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--color-primary);
  border-radius: var(--radius-sm);
}

/* Animation for active state */
.ui-breadcrumb-link--active {
  position: relative;
}

.ui-breadcrumb-link--active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--color-primary);
  border-radius: 1px;
}
</style>
