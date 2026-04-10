<script setup lang="ts">
import Icon from '@/components/common/utils/Icon.vue'
</script>

<template>
  <section id="history" class="m-section container" aria-labelledby="history-heading">
    <div class="m-section__intro">
      <p class="kicker">Observability</p>
      <h2 id="history-heading" class="m-h2">Run history you can open and compare</h2>
      <p class="m-lead">
        Every execution is listed with time and outcome—drill into payloads without rerunning blind.
      </p>
    </div>

    <div class="history-strip" role="list" aria-label="Example run history">
      <div class="history-row history-row--head" aria-hidden="true">
        <span>Run</span>
        <span>When</span>
        <span>Status</span>
      </div>
      <div class="history-row" role="listitem">
        <span class="mono">#1284</span>
        <span class="muted">Today · 14:02</span>
        <span class="ok"><Icon name="check" /> 200</span>
      </div>
      <div class="history-row" role="listitem">
        <span class="mono">#1283</span>
        <span class="muted">Today · 11:41</span>
        <span class="ok"><Icon name="check" /> 200</span>
      </div>
      <div class="history-row" role="listitem">
        <span class="mono">#1282</span>
        <span class="muted">Yesterday</span>
        <span class="warn"><Icon name="exclamation-triangle" /> 429</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.m-section {
  padding: 48px 20px 32px;
  max-width: 1120px;
  margin: 0 auto;
}

.m-section__intro {
  max-width: 56ch;
  margin-bottom: 22px;
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

.history-strip {
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
  background: color-mix(in srgb, var(--bg-secondary) 92%, var(--bg-primary));
  overflow: hidden;
}

.history-row {
  display: grid;
  grid-template-columns: 100px 1fr 120px;
  gap: 12px;
  align-items: center;
  padding: 12px 16px;
  font-size: var(--text-md);
  border-bottom: 1px solid var(--border-subtle);
}

.history-row:last-child {
  border-bottom: none;
}

.history-row--head {
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  background: color-mix(in srgb, var(--bg-elevated) 40%, transparent);
}

.mono {
  font-family: var(--font-mono);
  font-weight: 600;
  color: var(--text-primary);
}

.muted {
  color: var(--text-secondary);
}

.ok {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--success-green);
  font-weight: 600;
}

.warn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--warning-yellow);
  font-weight: 600;
}

@media (max-width: 560px) {
  .history-row {
    grid-template-columns: 1fr;
    gap: 4px;
  }

  .history-row--head {
    display: none;
  }
}
</style>
