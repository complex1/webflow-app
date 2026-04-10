<template>
  <aside class="app-sidebar" :class="{ 'is-collapsed': collapsed }">
    <header class="app-sidebar__header">
      <Avatar size="lg" name="Apiflux Ops" />
      <div v-if="!collapsed" class="app-sidebar__header-meta">
        <Text variant="sm" weight="semibold">Apiflux Ops</Text>
        <Text variant="xs" tone="muted">Workspace team</Text>
      </div>
      <button class="app-sidebar__toggle" type="button" @click="$emit('toggle')">
        <Icon :name="collapsed ? 'chevron-right' : 'chevron-left'" />
      </button>
    </header>

    <nav class="app-sidebar__nav">
      <button
        v-for="item in sidebarOptions"
        :key="item.name"
        class="app-sidebar__nav-item"
        :class="{ 'is-active': item.active, 'is-collapsed': collapsed }"
        type="button"
        @click="$router.push(item.route)"
        v-tooltip="collapsed ? item.name : null"
      >
        <Icon :name="item.icon" />
        <span v-if="!collapsed">{{ item.name }}</span>
      </button>
    </nav>

    <footer class="app-sidebar__footer" v-if="!collapsed">
      <Inline gap="xs" align="center">
        <Icon name="life-buoy" />
        <Text variant="xs" tone="muted">Support Center</Text>
      </Inline>
    </footer>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
import { watch } from 'vue'
withDefaults(defineProps<{ collapsed?: boolean }>(), { collapsed: false })

const sidebarOptions = [
  { name: 'Web Flows', icon: 'sitemap', route: '/webflows', active: true },
  { name: 'Scheduler', icon: 'calendar', route: '/scheduler', active: false },
  { name: 'Environments', icon: 'cloud', route: '/environments', active: false },
  { name: 'Profile', icon: 'user', route: '/profile', active: false },
  { name: 'Documentation', icon: 'book', route: '/docs', active: false }
]

watch(
  () => route.path,
  (newPath) => {
    sidebarOptions.forEach((item) => {
      item.active = newPath.startsWith(item.route)
    })
  },
  { immediate: true }
)
</script>

<style scoped>
.app-sidebar {
  position: relative;
  width: 240px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-default);
  padding: var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  transition: width var(--transition-default);
}

.app-sidebar.is-collapsed {
  width: 80px;
}

.app-sidebar__header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.app-sidebar__header-meta {
  display: flex;
  flex-direction: column;
}

.app-sidebar__toggle {
  position: absolute;
  right: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  transform: translate(50%, 0);
  border: 1px solid var(--border-default);
  background: var(--bg-elevated);
  color: var(--text-secondary);
  cursor: pointer;
}

.app-sidebar__nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.app-sidebar__nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2);
  border-radius: var(--radius-md);
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: background var(--transition-default), color var(--transition-default);
}

.app-sidebar__nav-item.is-active {
  background: color-mix(in srgb, var(--accent-blue) 18%, transparent);
  color: var(--text-primary);
}

.app-sidebar__nav-item.is-collapsed span {
  display: none;
}

.app-sidebar__footer {
  padding-top: var(--space-2);
  border-top: 1px solid var(--border-subtle);
}
</style>
