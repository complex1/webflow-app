<script setup lang="ts">
import Button from '@/components/common/buttons/Button.vue'
</script>

<template>
  <section id="use-cases" class="m-section container" aria-labelledby="use-heading">
    <h2 id="use-heading" class="m-h2 center">Where teams use API Flux</h2>
    <p class="m-sub center">One line each—then jump into the playground with the same nodes as production.</p>

    <ul class="grid" role="list">
      <li class="uc">
        <h3 class="uc-title">Prototype integrations</h3>
        <p class="uc-outcome">Chain vendor APIs before you commit to backend code.</p>
        <router-link to="/example-playground" class="uc-cta">
          <Button variant="ghost" size="sm" icon="angle-right">Open playground</Button>
        </router-link>
      </li>
      <li class="uc">
        <h3 class="uc-title">Debug production paths</h3>
        <p class="uc-outcome">Replay flows with history instead of scattered curl snippets.</p>
        <router-link to="/register" class="uc-cta">
          <Button variant="ghost" size="sm" icon="desktop">Create account</Button>
        </router-link>
      </li>
      <li class="uc">
        <h3 class="uc-title">Hand off to QA</h3>
        <p class="uc-outcome">Share a stable, read-only graph others can execute on demand.</p>
        <router-link to="/docs-open#sharing" class="uc-cta">
          <Button variant="ghost" size="sm" icon="book">Sharing in docs</Button>
        </router-link>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.m-section {
  padding: 32px 20px 48px;
  max-width: 1120px;
  margin: 0 auto;
}

.m-h2 {
  margin: 0;
  font-size: clamp(1.35rem, 2.5vw, 1.65rem);
  letter-spacing: -0.02em;
  text-align: center;
}

.m-sub {
  margin: 10px auto 0;
  max-width: 52ch;
  color: var(--text-secondary);
  font-size: var(--text-lg);
  line-height: 1.55;
  text-align: center;
}

.grid {
  list-style: none;
  margin: 28px 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.uc {
  padding: 20px 20px 16px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
  background: color-mix(in srgb, var(--bg-secondary) 88%, var(--bg-primary));
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.uc-title {
  margin: 0;
  font-size: var(--text-lg);
}

.uc-outcome {
  margin: 10px 0 0;
  flex: 1;
  font-size: var(--text-md);
  color: var(--text-secondary);
  line-height: 1.5;
}

.uc-cta {
  margin-top: 16px;
  min-height: 40px;
  display: inline-flex;
  align-items: center;
}
</style>
