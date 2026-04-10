<script setup lang="ts">
import Icon from '@/components/common/utils/Icon.vue'
</script>

<template>
  <section id="env" class="m-section container" aria-labelledby="env-heading">
    <div class="split">
      <div class="copy">
        <p class="kicker">Configure</p>
        <h2 id="env-heading" class="m-h2">Environments, not copy-paste</h2>
        <p class="m-lead">
          Store base URLs, tokens, and keys once. Link them to flows so the same graph runs against
          staging or prod.
        </p>
        <router-link class="doc-link" to="/docs-open#env-files">
          <Icon name="book" />
          Environment files in docs
        </router-link>
      </div>

      <div class="env-panel" aria-label="Example environment file">
        <header class="env-panel__bar">
          <span class="env-panel__name">staging.env</span>
          <span class="env-panel__badge">linked</span>
        </header>
        <pre class="env-panel__pre"><code><span class="k">BASE_URL</span>=<span class="v">https://api.staging.example.com</span>
<span class="k">API_TOKEN</span>=<span class="secret">••••••••••••</span>
<span class="k">TIMEOUT_MS</span>=<span class="v">15000</span></code></pre>
      </div>
    </div>
  </section>
</template>

<style scoped>
.m-section {
  padding: 48px 20px;
  max-width: 1120px;
  margin: 0 auto;
}

.kicker {
  margin: 0 0 8px;
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.m-h2 {
  margin: 0;
  font-size: clamp(1.35rem, 2.5vw, 1.65rem);
  letter-spacing: -0.02em;
}

.m-lead {
  margin: 10px 0 0;
  color: var(--text-secondary);
  font-size: var(--text-lg);
  line-height: 1.55;
}

.split {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 1fr);
  gap: 32px;
  align-items: center;
}

.copy {
  max-width: 52ch;
}

.doc-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 18px;
  min-height: 44px;
  padding: 0 4px;
  color: var(--accent-blue);
  font-weight: 600;
  font-size: var(--text-md);
  text-decoration: none;
  border-radius: var(--radius-md);
}

.doc-link:hover {
  text-decoration: underline;
}

.doc-link:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
  padding: 4px 8px;
  margin-left: -8px;
}

.env-panel {
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
  background: color-mix(in srgb, var(--bg-secondary) 94%, var(--bg-primary));
  overflow: hidden;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25);
}

.env-panel__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border-subtle);
  background: color-mix(in srgb, var(--bg-elevated) 50%, transparent);
}

.env-panel__name {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

.env-panel__badge {
  font-size: var(--text-xxs);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 4px 8px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--success-green) 22%, transparent);
  color: var(--success-green);
  font-weight: 600;
}

.env-panel__pre {
  margin: 0;
  padding: 14px 16px 18px;
  font-family: var(--font-mono);
  font-size: 11px;
  line-height: 1.65;
  color: var(--text-secondary);
  overflow-x: auto;
}

.env-panel__pre .k {
  color: var(--transform-node-color);
}

.env-panel__pre .v {
  color: var(--text-primary);
}

.env-panel__pre .secret {
  color: var(--text-muted);
  letter-spacing: 0.12em;
}

@media (max-width: 860px) {
  .split {
    grid-template-columns: 1fr;
  }
}
</style>
