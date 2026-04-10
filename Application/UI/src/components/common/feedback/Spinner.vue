<template>
  <span class="af-spinner" role="status" aria-live="polite">
    <span class="sr-only">Loading</span>
  </span>
</template>

<style scoped>
.af-spinner {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  /* rgba — html2canvas cannot parse color-mix() */
  border: 2px solid rgba(59, 130, 246, 0.35);
  border-top-color: var(--accent-blue);
  animation: spin 0.8s linear infinite;
  display: inline-block;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
