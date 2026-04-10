<script setup lang="ts">
import Icon from '@/components/common/utils/Icon.vue'
</script>

<template>
  <section id="run" class="m-section container" aria-labelledby="run-heading">
    <div class="split">
      <div class="copy">
        <p class="kicker">Run</p>
        <h2 id="run-heading" class="m-h2">Server-side runs, real responses</h2>
        <p class="m-lead">
          Execute the whole graph from our backend—see status codes, bodies, and errors in one
          panel, the same way as in the editor.
        </p>
        <div class="badges">
          <span class="pill">
            <Icon name="server" />
            Server-side execution
          </span>
        </div>
      </div>

      <div class="run-panel" aria-label="Example execution response">
        <header class="run-panel__bar">
          <span class="run-panel__status">200 OK</span>
          <span class="run-panel__meta">124 ms</span>
        </header>
        <div class="run-panel__body">
          <p class="run-panel__label">Response body</p>
          <pre class="run-panel__pre"><code>{
  "<span class="j">users</span>": [
    { "<span class="j">id</span>": <span class="n">1</span>, "<span class="j">name</span>": <span class="s">"Ada"</span> }
  ]
}</code></pre>
        </div>
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

.badges {
  margin-top: 18px;
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-primary);
  border: 1px solid color-mix(in srgb, var(--accent-blue) 35%, var(--border-default));
  background: color-mix(in srgb, var(--accent-blue) 12%, transparent);
}

.run-panel {
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
  background: color-mix(in srgb, var(--bg-secondary) 94%, var(--bg-primary));
  overflow: hidden;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25);
}

.run-panel__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border-subtle);
  background: color-mix(in srgb, var(--success-green) 12%, transparent);
}

.run-panel__status {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--success-green);
}

.run-panel__meta {
  font-size: var(--text-xs);
  color: var(--text-muted);
  font-family: var(--font-mono);
}

.run-panel__body {
  padding: 12px 14px 16px;
}

.run-panel__label {
  margin: 0 0 8px;
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
}

.run-panel__pre {
  margin: 0;
  padding: 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--bg-primary);
  font-family: var(--font-mono);
  font-size: 11px;
  line-height: 1.55;
  color: var(--text-secondary);
  overflow-x: auto;
}

.run-panel__pre .j {
  color: var(--transform-node-color);
}

.run-panel__pre .n {
  color: var(--warning-yellow);
}

.run-panel__pre .s {
  color: var(--success-green);
}

@media (max-width: 860px) {
  .split {
    grid-template-columns: 1fr;
  }
}
</style>
