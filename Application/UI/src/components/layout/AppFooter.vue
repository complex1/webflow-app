<template>
  <footer class="app-footer">
    <slot>
      <Text variant="xs" tone="muted">© {{ new Date().getFullYear() }} Apiflux</Text>
    </slot>
  </footer>
</template>

<script setup lang="ts">
import { Text } from '@/components/common/typography'
</script>

<style scoped>
.app-footer {
  height: 48px;
  border-top: 1px solid var(--border-default);
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-4);
}
</style>
