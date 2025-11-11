<template>
  <div class="docs-example">
    <!-- Example Header -->
    <div class="docs-example-header">
      <h4 class="docs-example-title">{{ title || 'Example' }}</h4>
      <div class="docs-example-tabs" v-if="showTabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          class="docs-example-tab"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Demo Content -->
    <div v-if="activeTab === 'demo'" class="docs-example-demo">
      <slot name="demo">
        <slot></slot>
      </slot>
    </div>

    <!-- Code Content -->
    <div v-if="activeTab === 'code'" class="docs-example-content">
      <DocsCodeBlock 
        :code="code" 
        :language="language"
        :show-copy="showCopy"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import DocsCodeBlock from './DocsCodeBlock.vue'

interface Tab {
  id: string
  label: string
}

interface Props {
  title?: string
  code?: string
  language?: string
  showTabs?: boolean
  showCopy?: boolean
  defaultTab?: 'demo' | 'code'
}

const props = withDefaults(defineProps<Props>(), {
  language: 'vue',
  showTabs: true,
  showCopy: true,
  defaultTab: 'demo'
})

const activeTab = ref(props.defaultTab)

const tabs = computed((): Tab[] => {
  const tabList: Tab[] = [
    { id: 'demo', label: 'Demo' }
  ]
  
  if (props.code) {
    tabList.push({ id: 'code', label: 'Code' })
  }
  
  return tabList
})
</script>

<style scoped>
/* Styles are inherited from documentation.css */
</style>