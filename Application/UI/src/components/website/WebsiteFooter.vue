<script setup lang="ts">
defineProps<{ year: number }>()
</script>

<template>
  <footer>
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="brand" style="gap: 10px">
            <ProductLogo size="32" />
            <span>API Flux — open-source visual API workflows.</span>
          </div>
          <div class="tiny" style="margin-top: 10px">
            Design, run, and share flows with a canvas editor and server-side execution.
          </div>
          <div class="tiny" style="margin-top: 6px">© {{ year }} · MIT License</div>
        </div>
        <nav class="footer-links" aria-label="Footer">
          <a href="#top">Top</a>
          <a href="#build">Build</a>
          <a href="#env">Environments</a>
          <a href="#run">Run</a>
          <a href="#history">History</a>
          <a href="#features">Features</a>
          <router-link to="/docs-open">Docs</router-link>
          <a href="#cta">Get started</a>
          <a
            href="https://github.com/complex1/webflow-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </nav>
      </div>
    </div>
  </footer>
</template>

<style scoped>
footer {
  border-top: 1px solid var(--border-subtle);
  padding: 56px 0;
  background: color-mix(in srgb, var(--bg-secondary) 92%, var(--bg-primary));
  position: relative;
  z-index: 2;
}

.brand {
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 18px;
  color: var(--text-primary);
}

.tiny {
  font-size: var(--text-sm);
  color: var(--text-muted);
  max-width: 52ch;
}

.footer-grid {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 32px;
  flex-wrap: wrap;
}

.footer-links {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  max-width: 420px;
  justify-content: flex-end;
}

.footer-links a {
  color: var(--text-secondary);
  padding: 8px 10px;
  border-radius: 10px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  font-size: var(--text-md);
}

.footer-links a:hover {
  color: var(--text-primary);
  background: color-mix(in srgb, var(--bg-elevated) 70%, var(--bg-primary));
}
</style>
