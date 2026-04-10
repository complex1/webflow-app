<template>
  <div class="af-table">

    <div v-if="$slots.controls" class="af-table__controls">
      <slot name="controls" />
    </div>

    <div class="af-table__container">
      <table>
        <thead>
          <slot name="columns">
            <tr>
              <th
                v-for="column in columns"
                :key="column.key"
                :style="column.style"
                @click="onSort(column)"
              >
                <Inline gap="xs" align="center">
                  <span>{{ column.label }}</span>
                  <Icon v-if="column.sortable" :name="sortIcon(column.key)" />
                </Inline>
              </th>
            </tr>
          </slot>
        </thead>
        <tbody>
          <tr v-for="row in sortedRows" :key="row[idField]">
            <td v-for="column in columns" :key="column.key">
              <slot :name="`cell-${column.key}`" :row="row">
                {{ row[column.key] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Inline } from '@/components/common/foundation'
import Icon from '@/components/common/utils/Icon.vue'

type SortDirection = 'asc' | 'desc'

export interface TableColumn<T> {
  key: keyof T & string
  label: string
  sortable?: boolean
  style?: Record<string, string>
}

const props = withDefaults(
  defineProps<{
    title?: string
    rows: Record<string, any>[]
    columns: TableColumn<Record<string, any>>[]
    idField?: string
  }>(),
  {
    title: 'Dataset',
    idField: 'id'
  }
)

const sortKey = ref<string | null>(null)
const direction = ref<SortDirection>('asc')

const onSort = (column: TableColumn<Record<string, any>>) => {
  if (!column.sortable) return
  if (sortKey.value === column.key) {
    direction.value = direction.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = column.key
    direction.value = 'asc'
  }
}

const sortIcon = (key: string) => {
  if (sortKey.value !== key) return 'arrows-v'
  return direction.value === 'asc' ? 'chevron-up' : 'chevron-down'
}

const sortedRows = computed(() => {
  if (!sortKey.value) return props.rows
  return [...props.rows].sort((a, b) => {
    const valueA = a[sortKey.value as string]
    const valueB = b[sortKey.value as string]
    if (valueA === valueB) return 0
    if (direction.value === 'asc') return valueA > valueB ? 1 : -1
    return valueA < valueB ? 1 : -1
  })
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

.af-table__header-actions {
  display: inline-flex;
  gap: var(--space-2);
}

.af-table__controls {
  padding: var(--space-3);
  border-bottom: 1px solid var(--border-default);
}

.af-table__container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: var(--bg-secondary);
}

th,
td {
  padding: var(--space-3);
  border-bottom: 1px solid var(--border-default);
  text-align: left;
}

th {
  color: var(--text-secondary);
  font-size: var(--text-sm);
  cursor: pointer;
}

tbody tr:hover {
  background: color-mix(in srgb, var(--accent-blue) 8%, transparent);
}

.af-table__footer {
  padding: var(--space-3);
  border-top: 1px solid var(--border-default);
}
</style>
