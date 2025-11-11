<template>
  <div class="docs-props-table-container">
    <table class="docs-table docs-props-table">
      <thead>
        <tr>
          <th>Property</th>
          <th>Type</th>
          <th>Required</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="prop in properties" :key="prop.name">
          <td>
            <code class="docs-props-name">{{ prop.name }}</code>
          </td>
          <td>
            <code class="docs-props-type">{{ prop.type }}</code>
          </td>
          <td>
            <span 
              class="docs-props-required" 
              v-if="prop.required"
            >
              Yes
            </span>
            <span v-else class="docs-props-optional">No</span>
          </td>
          <td>
            <code 
              v-if="prop.default !== undefined" 
              class="docs-props-default"
            >
              {{ prop.default }}
            </code>
            <span v-else class="docs-props-default">-</span>
          </td>
          <td class="docs-text">{{ prop.description }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
interface Property {
  name: string
  type: string
  required?: boolean
  default?: string | number | boolean
  description: string
}

interface Props {
  properties: Property[]
}

defineProps<Props>()
</script>

<style scoped>
.docs-props-table-container {
  overflow-x: auto;
}

.docs-props-optional {
  color: var(--color-text-tertiary);
  font-size: var(--font-size-xs);
}
</style>