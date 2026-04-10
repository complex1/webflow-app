<template>
  <Box background="transparent" :bordered="false" padding="lg" radius="lg">
    <Stack gap="md">
      <Inline justify="space-between" align="center">
        <div>
          <Heading :level="3">Environment files</Heading>
          <Text variant="sm" tone="secondary">Manage workspace configuration per environment.</Text>
        </div>
        <Button icon="plus" @click="$emit('create')">Add environment</Button>
      </Inline>

      <div v-if="loading" class="env-list__loading">
        <Spinner />
        <Text tone="secondary">Loading environments…</Text>
      </div>
      <EmptyStateText v-else-if="!rows.length">
        <template #title>No environment files</template>
        Create an environment to store secrets per deployment target.
      </EmptyStateText>
      <div v-else class="env-card-grid">
        <EnvironmentCard
          v-for="env in rows"
          :key="env.id"
          :environment="env"
          @view="$emit('view', env)"
          @edit="$emit('edit', env)"
          @delete="$emit('delete', env)"
          @clone="$emit('clone', env)"
        />
      </div>

      <Pagination v-if="totalPages > 1" :page="page" :total-pages="totalPages" @update:page="$emit('update:page', $event)" />
    </Stack>
  </Box>
</template>

<script setup lang="ts">
import { Box, Stack, Inline } from '@/components/common/foundation'
import { Text, Heading, EmptyStateText } from '@/components/common/typography'
import { Button } from '@/components/common/buttons'
import { computed, toRefs } from 'vue'
import { Pagination } from '@/components/common/data'
import { Spinner } from '@/components/common/feedback'
import { EnvironmentCard } from '@/components/environmentFile'

const props = defineProps<{
  rows: Array<{
    id: number
    name: string
    description?: string
    updatedAt?: string
    configs: any[]
  }>
  page: number
  totalPages: number
  loading?: boolean
}>()

const { rows, page, totalPages } = toRefs(props)
const loading = computed(() => props.loading ?? false)
</script>

<style scoped>
.env-list__loading {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--text-secondary);
}

.env-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-3);
}
</style>
