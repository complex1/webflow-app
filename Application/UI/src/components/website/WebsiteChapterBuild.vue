<script setup lang="ts">
import Icon from '@/components/common/utils/Icon.vue'
</script>

<template>
  <section id="build" class="m-section container" aria-labelledby="build-heading">
    <div class="m-section__intro">
      <p class="kicker">Build</p>
      <h2 id="build-heading" class="m-h2">Nodes you actually use</h2>
      <p class="m-lead">
        Drag, connect, and label—same mental model as the editor. No toy shapes: these are the real
        node types.
      </p>
    </div>

    <div class="node-lane" role="list">
      <article class="lane-card lane-card--http" role="listitem">
        <div class="lane-icon" aria-hidden="true">
          <Icon name="globe" />
        </div>
        <h3 class="lane-title">HTTP (API)</h3>
        <p class="lane-copy">Call REST endpoints with env-backed URLs and bodies.</p>
      </article>
      <div class="lane-connector" aria-hidden="true">
        <span class="lane-arrow" />
      </div>
      <article class="lane-card lane-card--transform" role="listitem">
        <div class="lane-icon" aria-hidden="true">
          <Icon name="sliders-h" />
        </div>
        <h3 class="lane-title">Transform</h3>
        <p class="lane-copy">Map, filter, and reshape JSON between steps.</p>
      </article>
      <div class="lane-connector" aria-hidden="true">
        <span class="lane-arrow" />
      </div>
      <article class="lane-card lane-card--openapi" role="listitem">
        <div class="lane-icon" aria-hidden="true">
          <Icon name="file" />
        </div>
        <h3 class="lane-title">OpenAPI</h3>
        <p class="lane-copy">Import a spec and call operations by name.</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.m-section {
  padding: 56px 20px 24px;
  max-width: 1120px;
  margin: 0 auto;
}

.m-section__intro {
  max-width: 56ch;
  margin-bottom: 28px;
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

.node-lane {
  display: flex;
  align-items: stretch;
  gap: 0;
  flex-wrap: wrap;
  justify-content: center;
}

.lane-card {
  flex: 1 1 200px;
  max-width: 280px;
  padding: 18px 18px 20px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
  background: color-mix(in srgb, var(--bg-secondary) 90%, var(--bg-primary));
}

.lane-card--http {
  border-color: color-mix(in srgb, var(--http-node-color) 45%, var(--border-default));
}

.lane-card--transform {
  border-color: color-mix(in srgb, var(--transform-node-color) 45%, var(--border-default));
}

.lane-card--openapi {
  border-color: color-mix(in srgb, var(--warning-yellow) 40%, var(--border-default));
}

.lane-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  background: color-mix(in srgb, var(--bg-elevated) 80%, transparent);
  color: var(--text-secondary);
  font-size: 18px;
}

.lane-title {
  margin: 0;
  font-size: var(--text-lg);
}

.lane-copy {
  margin: 8px 0 0;
  font-size: var(--text-md);
  color: var(--text-secondary);
  line-height: 1.5;
}

.lane-connector {
  display: flex;
  align-items: center;
  padding: 0 4px;
  color: var(--text-muted);
}

.lane-arrow {
  width: 28px;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--accent-blue),
    transparent
  );
  position: relative;
}

.lane-arrow::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  border: 5px solid transparent;
  border-left-color: var(--accent-blue);
}

@media (max-width: 900px) {
  .lane-connector {
    width: 100%;
    justify-content: center;
    padding: 8px 0;
  }

  .lane-arrow {
    width: 2px;
    height: 24px;
    background: linear-gradient(
      180deg,
      transparent,
      var(--accent-blue),
      transparent
    );
  }

  .lane-arrow::after {
    right: auto;
    left: 50%;
    top: auto;
    bottom: 0;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: var(--accent-blue);
    border-left-color: transparent;
  }

  .node-lane {
    flex-direction: column;
    align-items: center;
  }
}
</style>
