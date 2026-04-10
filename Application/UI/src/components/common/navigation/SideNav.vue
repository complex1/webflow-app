<template>
  <nav class="af-side-nav">
    <slot />
  </nav>
</template>

<style scoped>
.af-side-nav {
  width: 240px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-default);
  padding: var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}
</style>
