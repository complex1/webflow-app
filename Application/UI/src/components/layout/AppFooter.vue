<template>
  <footer class="app-footer">
    <div class="footer-content">
      <span class="footer-brand">API Flux</span>
      <span class="footer-separator">•</span>
      <span class="footer-tagline">See your systems flow</span>
    </div>
    <div class="footer-info">
      <span class="footer-version">v1.0.0</span>
      <span class="footer-separator">•</span>
      <span class="footer-copyright">© 2025 API Flux</span>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Footer component - Neo-Systemic design
</script>

<style scoped>
.footer-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.footer-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.footer-brand {
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
}

.footer-tagline {
  font-style: italic;
  color: var(--color-text-tertiary);
}

.footer-version {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  background: var(--color-background-code);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
}

.footer-separator {
  color: var(--color-text-tertiary);
  opacity: 0.5;
}

.footer-copyright {
  color: var(--color-text-tertiary);
}

.app-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@media (max-width: 768px) {
  .app-footer {
    flex-direction: column;
    gap: var(--spacing-xs);
  }
  
  .footer-content,
  .footer-info {
    gap: var(--spacing-xs);
  }
}
</style>
