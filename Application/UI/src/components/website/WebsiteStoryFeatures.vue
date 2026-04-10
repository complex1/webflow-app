<script setup lang="ts">
import Icon from '@/components/common/utils/Icon.vue'
</script>

<template>
  <section id="features" class="m-section container" aria-labelledby="features-heading">
    <h2 id="features-heading" class="m-h2 center">Everything ties back to the graph</h2>
    <p class="m-sub center">
      Same vocabulary everywhere: canvas, runs, environments—no parallel concepts to learn.
    </p>

    <ul class="grid" role="list">
      <li class="card">
        <div class="card-icon" aria-hidden="true">
          <Icon name="sitemap" />
        </div>
        <h3 class="card-title">Visual webflows</h3>
        <p class="card-copy">Arrange API steps as a flow you can read at a glance.</p>
      </li>
      <li class="card">
        <div class="card-icon" aria-hidden="true">
          <Icon name="history" />
        </div>
        <h3 class="card-title">Execution history</h3>
        <p class="card-copy">Reopen past runs and inspect request/response pairs.</p>
      </li>
      <li class="card">
        <div class="card-icon" aria-hidden="true">
          <Icon name="folder-open" />
        </div>
        <h3 class="card-title">Environments</h3>
        <p class="card-copy">Promote the same flow across URLs and secrets safely.</p>
      </li>
      <li class="card">
        <div class="card-icon" aria-hidden="true">
          <Icon name="share-alt" />
        </div>
        <h3 class="card-title">Sharing</h3>
        <p class="card-copy">Share read-only flows with a link when you need alignment.</p>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.m-section {
  padding: 40px 20px 32px;
  max-width: 1120px;
  margin: 0 auto;
}

.m-h2 {
  margin: 0;
  font-size: clamp(1.35rem, 2.5vw, 1.65rem);
  letter-spacing: -0.02em;
}

.m-h2.center,
.m-sub.center {
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}

.m-sub {
  margin: 10px auto 0;
  max-width: 52ch;
  color: var(--text-secondary);
  font-size: var(--text-lg);
  line-height: 1.55;
}

.grid {
  list-style: none;
  margin: 28px 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.card {
  padding: 18px 18px 20px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
  background: color-mix(in srgb, var(--bg-secondary) 85%, var(--bg-primary));
}

.card-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  background: color-mix(in srgb, var(--accent-blue) 14%, transparent);
  color: var(--accent-blue);
  font-size: 18px;
}

.card-title {
  margin: 0;
  font-size: var(--text-lg);
}

.card-copy {
  margin: 8px 0 0;
  font-size: var(--text-md);
  color: var(--text-secondary);
  line-height: 1.45;
}
</style>
