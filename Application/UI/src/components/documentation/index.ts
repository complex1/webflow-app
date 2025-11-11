// Documentation Components Export
export { default as DocsLayout } from './DocsLayout.vue'
export { default as DocsNavigation } from './DocsNavigation.vue'
export { default as DocsCard } from './DocsCard.vue'
export { default as DocsExample } from './DocsExample.vue'
export { default as DocsCodeBlock } from './DocsCodeBlock.vue'
export { default as DocsAlert } from './DocsAlert.vue'
export { default as DocsPropsTable } from './DocsPropsTable.vue'

// Export types for TypeScript support
export interface BreadcrumbItem {
  label: string
  to?: string
}

export interface NavigationItem {
  label: string
  to?: string
  icon?: string
  children?: NavigationItem[]
}

export interface NavigationSection {
  title: string
  items: NavigationItem[]
}

export interface Property {
  name: string
  type: string
  required?: boolean
  default?: string | number | boolean
  description: string
}