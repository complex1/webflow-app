<template>
  <nav class="docs-navigation">
    <div v-for="section in navigation" :key="section.title" class="docs-nav-section">
      <div class="docs-nav-section-title">{{ section.title }}</div>
      <ul class="docs-nav">
        <li v-for="item in section.items" :key="item.label" class="docs-nav-item">
          <router-link 
            v-if="item.to"
            :to="item.to" 
            class="docs-nav-link"
            active-class="active"
          >
            <i v-if="item.icon" :class="item.icon"></i>
            {{ item.label }}
          </router-link>
          <span v-else class="docs-nav-link">
            <i v-if="item.icon" :class="item.icon"></i>
            {{ item.label }}
          </span>
          
          <!-- Nested navigation -->
          <ul v-if="item.children?.length" class="docs-nav docs-nav-nested">
            <li v-for="child in item.children" :key="child.label" class="docs-nav-item">
              <router-link 
                v-if="child.to"
                :to="child.to" 
                class="docs-nav-link docs-nav-link-nested"
                active-class="active"
              >
                <i v-if="child.icon" :class="child.icon"></i>
                {{ child.label }}
              </router-link>
              <span v-else class="docs-nav-link docs-nav-link-nested">
                <i v-if="child.icon" :class="child.icon"></i>
                {{ child.label }}
              </span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
interface NavigationItem {
  label: string
  to?: string
  icon?: string
  children?: NavigationItem[]
}

interface NavigationSection {
  title: string
  items: NavigationItem[]
}

interface Props {
  navigation: NavigationSection[]
}

defineProps<Props>()
</script>

<script lang="ts">
export default {
  name: 'DocsNavigation'
}
</script>

<style scoped>
.docs-navigation {
  width: 100%;
}

.docs-nav-nested {
  margin-left: var(--spacing-md);
  margin-top: var(--spacing-xs);
}

.docs-nav-link-nested {
  font-size: var(--font-size-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
}

.docs-nav-link-nested::before {
  content: '→';
  margin-right: var(--spacing-xs);
  color: var(--color-text-tertiary);
  font-size: var(--font-size-xs);
}
</style>