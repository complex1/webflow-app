<template>
  <header class="af-top-bar">
    <div class="af-top-bar__section">
      <slot />
    </div>
    <div class="af-top-bar__actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<style scoped>
.af-top-bar {
  height: 56px;
  padding: 0 var(--space-4);
  border-bottom: 1px solid var(--border-default);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-secondary);
}

.af-top-bar__actions {
  display: inline-flex;
  gap: var(--space-2);
}
</style>
