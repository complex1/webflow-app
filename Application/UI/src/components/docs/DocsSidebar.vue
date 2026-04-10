<template>
  <aside class="docs-sidebar">
    <div class="sidebar-title">Documentation</div>
    <nav class="sidebar-links" aria-label="Documentation sections">
      <template v-for="item in DOCS_NAV" :key="item.id">
        <div v-if="item.children?.length" class="sidebar-group">
          <span class="sidebar-group__label">{{ item.label }}</span>
          <a
            v-for="child in item.children"
            :key="child.id"
            :href="hashHref(child.id)"
            class="sidebar-group__link"
          >
            {{ child.label }}
          </a>
        </div>
        <a v-else class="sidebar-link--top" :href="hashHref(item.id)">{{ item.label }}</a>
      </template>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { DOCS_NAV } from './docsNav'

function hashHref(id: string) {
  return `#${id}`
}
</script>

<style scoped>
.docs-sidebar {
  position: sticky;
  top: 20px;
  align-self: start;
  border: 1px solid var(--border-subtle);
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: 16px;
}

.sidebar-title {
  font-size: var(--label);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.sidebar-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: var(--label);
}

.sidebar-link--top {
  color: var(--accent-blue);
  text-decoration: none;
  font-weight: 500;
}

.sidebar-link--top:hover {
  text-decoration: underline;
}

.sidebar-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sidebar-group__label {
  font-size: var(--meta);
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.sidebar-group__link {
  padding-left: 8px;
  color: var(--accent-blue);
  text-decoration: none;
  border-left: 2px solid var(--border-subtle);
}

.sidebar-group__link:hover {
  border-left-color: var(--accent-blue);
  text-decoration: underline;
}
</style>
