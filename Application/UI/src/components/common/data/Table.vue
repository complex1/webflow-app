<template>
  <div class="af-table">
    <div class="af-table__header">
      <slot name="header">
        <div class="af-table__default-header">
          <Heading :level="3">Table</Heading>
        </div>
      </slot>
      <div class="af-table__header-actions">
        <slot name="header-actions" />
      </div>
    </div>

    <div class="af-table__controls">
      <slot name="controls" />
    </div>

    <table>
      <thead>
        <slot name="columns">
          <tr>
            <th v-for="column in columns" :key="column.key" @click="onSort(column)">
              <Inline gap="xs" align="center">
                <span>{{ column.label }}</span>
                <Icon v-if="sortable(column)" :name="sortIcon(column.key)" />
              </Inline>
            </th>
          </tr>
        </slot>
      </thead>
      <tbody>
        <slot>
          <tr v-for="row in sortedRows" :key="row[idField]">
            <td v-for="column in columns" :key="column.key">
              <slot :name="`cell-${column.key}`" :row="row">
                {{ row[column.key] }}
              </slot>
            </td>
          </tr>
        </slot>
      </tbody>
    </table>

    <div class="af-table__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Heading } from '@/components/common/typography'
import { Inline } from '@/components/common/foundation'
import Icon from '@/components/common/utils/Icon.vue'

type SortDirection = 'asc' | 'desc'

interface Column<T> {
  key: keyof T & string
  label: string
  sortable?: boolean
}

const props = withDefaults(
  defineProps<{
    rows: Record<string, any>[]
    columns: Column<Record<string, any>>[]
    idField?: string
  }>(),
  {
    idField: 'id'
  }
)

const sortKey = ref<string | null>(null)
const direction = ref<SortDirection>('asc')

const onSort = (column: Column<Record<string, any>>) => {
  if (!column.sortable) return
  if (sortKey.value === column.key) {
    direction.value = direction.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = column.key
    direction.value = 'asc'
  }
}

const sortable = (column: Column<Record<string, any>>) => column.sortable

const sortIcon = (key: string) => {
  if (sortKey.value !== key) return 'arrows-v'
  return direction.value === 'asc' ? 'chevron-up' : 'chevron-down'
}

const sortedRows = computed(() => {
  if (!sortKey.value) return props.rows
  const sorted = [...props.rows].sort((a, b) => {
    const valueA = a[sortKey.value as string]
    const valueB = b[sortKey.value as string]
    if (valueA === valueB) return 0
    if (direction.value === 'asc') return valueA > valueB ? 1 : -1
    return valueA < valueB ? 1 : -1
  })
  return sorted
})
</script>

<style scoped>
.af-table {
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  background: var(--bg-secondary);
  display: flex;
  flex-direction: column;
}

.af-table__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3);
  border-bottom: 1px solid var(--border-default);
}

.af-table__controls {
  padding: var(--space-3);
  border-bottom: 1px solid var(--border-default);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  text-align: left;
  padding: var(--space-3);
  border-bottom: 1px solid var(--border-default);
}

th {
  cursor: pointer;
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.af-table__footer {
  padding: var(--space-3);
}
</style>
