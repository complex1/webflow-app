<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Button from '@/components/common/buttons/Button.vue'
import Icon from '@/components/common/utils/Icon.vue'
import { trackMarketingEvent } from '@/composables/useMarketingAnalytics'

const prefersReducedMotion = ref(true)

onMounted(() => {
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
})

const flowActive = ref(false)
let flowTimer: ReturnType<typeof setTimeout> | undefined

function triggerFlow() {
  trackMarketingEvent('cta_hero_run_sample')
  if (prefersReducedMotion.value) return
  flowActive.value = true
  clearTimeout(flowTimer)
  flowTimer = setTimeout(() => {
    flowActive.value = false
  }, 2400)
}

const flowClass = computed(() => ({
  'canvas--flow': flowActive.value && !prefersReducedMotion.value,
  'canvas--static': prefersReducedMotion.value,
}))

function onPrimary() {
  trackMarketingEvent('cta_hero_primary')
}

function onSecondary() {
  trackMarketingEvent('cta_hero_secondary')
}

function onDocs() {
  trackMarketingEvent('cta_hero_docs')
}
</script>

<template>
  <main id="top" class="container hero">
    <div class="hero-grid">
      <section class="hero-copy reveal" aria-labelledby="hero-heading">
        <p class="eyebrow">API Flux</p>
        <h1 id="hero-heading" class="headline">Build API flows visually</h1>
        <p class="subhead">
          Connect HTTP, Transform, and OpenAPI nodes—then run on the server with history you can
          replay.
        </p>
        <div class="cta-row">
          <router-link to="/register" class="cta-link" @click="onPrimary">
            <Button variant="primary" icon="desktop" data-analytics="cta_hero_primary">
              Get started
            </Button>
          </router-link>
          <router-link to="/example-playground" class="cta-link" @click="onSecondary">
            <Button variant="secondary" icon="angle-right" data-analytics="cta_hero_secondary">
              Try playground
            </Button>
          </router-link>
          <router-link to="/docs-open" class="cta-link" @click="onDocs">
            <Button variant="ghost" icon="book"> Docs </Button>
          </router-link>
        </div>
      </section>

      <div
        class="canvas-shell"
        :class="flowClass"
        role="img"
        aria-label="Sample webflow: three connected nodes—HTTP GET, Transform, then OpenAPI—with animated data flow when you run the sample."
      >
        <div class="canvas-chrome">
          <span class="chrome-dot" aria-hidden="true" />
          <span class="chrome-dot" aria-hidden="true" />
          <span class="chrome-dot" aria-hidden="true" />
          <span class="chrome-title">Editor · sample flow</span>
        </div>

        <div class="canvas-body">
          <svg
            class="flow-svg"
            viewBox="0 0 560 200"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="flow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color: var(--accent-blue); stop-opacity: 0.2" />
                <stop offset="50%" style="stop-color: var(--accent-blue); stop-opacity: 1" />
                <stop offset="100%" style="stop-color: var(--accent-blue); stop-opacity: 0.2" />
              </linearGradient>
            </defs>
            <!-- Edge 1 -->
            <path
              class="edge edge--back"
              d="M 138 100 C 175 100 195 100 228 100"
              fill="none"
            />
            <path
              class="edge edge--front"
              d="M 138 100 C 175 100 195 100 228 100"
              fill="none"
            />
            <!-- Edge 2 -->
            <path
              class="edge edge--back"
              d="M 358 100 C 395 100 415 100 448 100"
              fill="none"
            />
            <path
              class="edge edge--front"
              d="M 358 100 C 395 100 415 100 448 100"
              fill="none"
            />
          </svg>

          <div class="nodes-row">
            <article class="wf-node wf-node--http">
              <header>HTTP</header>
              <p>GET /users</p>
            </article>
            <article class="wf-node wf-node--transform">
              <header>Transform</header>
              <p>Map + pick fields</p>
            </article>
            <article class="wf-node wf-node--openapi">
              <header>OpenAPI</header>
              <p>POST /notify</p>
            </article>
          </div>

          <div class="canvas-actions">
            <button
              type="button"
              class="run-btn"
              :aria-pressed="flowActive"
              @click="triggerFlow"
            >
              <span class="run-glow" aria-hidden="true" />
              <Icon name="play" class="run-icon" />
              Run sample
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.hero {
  margin: 0 auto;
  padding: clamp(48px, 8vw, 88px) 20px 56px;
  position: relative;
  z-index: 1;
  max-width: 1200px;
}

.hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 1.05fr);
  gap: clamp(24px, 4vw, 48px);
  align-items: center;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.headline {
  font-size: clamp(2rem, 4.5vw, 2.75rem);
  line-height: 1.1;
  margin: 0;
  letter-spacing: -0.03em;
  font-weight: 700;
}

.subhead {
  margin: 14px 0 0;
  max-width: 42ch;
  color: var(--text-secondary);
  font-size: var(--text-lg);
  line-height: 1.5;
}

.cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin-top: 22px;
}

.cta-link {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
}

.canvas-shell {
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
  background: color-mix(in srgb, var(--bg-secondary) 88%, var(--bg-primary));
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--accent-blue) 12%, transparent),
    0 24px 48px rgba(0, 0, 0, 0.35);
  overflow: hidden;
}

.canvas-chrome {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border-subtle);
  background: color-mix(in srgb, var(--bg-elevated) 55%, transparent);
}

.chrome-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--border-default);
  opacity: 0.85;
}

.chrome-title {
  margin-left: auto;
  font-size: var(--text-xs);
  color: var(--text-muted);
  font-family: var(--font-mono);
}

.canvas-body {
  position: relative;
  padding: 20px 16px 56px;
  min-height: 220px;
}

.flow-svg {
  position: absolute;
  left: 0;
  right: 0;
  top: 56px;
  width: 100%;
  height: 88px;
  pointer-events: none;
}

.edge {
  stroke-width: 3;
  stroke-linecap: round;
}

.edge--back {
  stroke: color-mix(in srgb, var(--text-muted) 35%, transparent);
}

.edge--front {
  stroke: url(#flow-grad);
  stroke-dasharray: 8 14;
  opacity: 0.35;
}

.canvas--flow .edge--front {
  animation: edge-dash 1.1s linear infinite;
  opacity: 0.95;
}

.canvas--static .edge--front {
  stroke-dasharray: none;
  opacity: 0.45;
}

@keyframes edge-dash {
  to {
    stroke-dashoffset: -44;
  }
}

.nodes-row {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  z-index: 1;
}

.wf-node {
  flex: 1;
  min-width: 0;
  max-width: 168px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-default);
  overflow: hidden;
  font-size: var(--text-xs);
  transition:
    transform var(--dur-med) var(--ease-out),
    box-shadow var(--dur-med) var(--ease-out);
}

.canvas--flow .wf-node {
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--accent-blue) 45%, transparent);
}

.wf-node header {
  padding: 6px 10px;
  font-weight: 600;
  font-size: var(--text-xs);
  letter-spacing: 0.02em;
}

.wf-node p {
  margin: 0;
  padding: 8px 10px 10px;
  font-family: var(--font-mono);
  color: var(--text-secondary);
  font-size: 10px;
  line-height: 1.35;
}

.wf-node--http header {
  background: var(--http-node-header-color);
  color: #0b1220;
}

.wf-node--http {
  background: color-mix(in srgb, var(--http-node-color) 22%, var(--bg-primary));
}

.wf-node--transform header {
  background: var(--transform-node-header-color);
  color: #0b1220;
}

.wf-node--transform {
  background: color-mix(in srgb, var(--transform-node-color) 20%, var(--bg-primary));
}

.wf-node--openapi header {
  background: color-mix(in srgb, var(--warning-yellow) 70%, #78350f);
  color: #0b1220;
}

.wf-node--openapi {
  background: color-mix(in srgb, var(--warning-yellow) 14%, var(--bg-primary));
}

.canvas-actions {
  position: absolute;
  bottom: 14px;
  right: 14px;
  z-index: 2;
}

.run-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--accent-blue) 55%, transparent);
  background: color-mix(in srgb, var(--accent-blue) 22%, var(--bg-primary));
  color: var(--text-primary);
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  transition:
    background var(--dur-fast) var(--ease-out),
    transform var(--dur-fast) var(--ease-out);
}

.run-btn:hover {
  background: color-mix(in srgb, var(--accent-blue) 32%, var(--bg-primary));
}

.run-btn:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

.run-glow {
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  background: radial-gradient(
    circle at 30% 50%,
    color-mix(in srgb, var(--accent-blue) 55%, transparent),
    transparent 65%
  );
  opacity: 0;
  pointer-events: none;
}

.canvas--flow .run-glow {
  animation: pulse-glow 1.2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%,
  100% {
    opacity: 0.15;
  }
  50% {
    opacity: 0.55;
  }
}

.run-icon {
  font-size: 12px;
}

@media (max-width: 980px) {
  .hero-grid {
    grid-template-columns: 1fr;
  }

  .nodes-row {
    flex-direction: column;
    align-items: stretch;
  }

  .wf-node {
    max-width: none;
  }

  .flow-svg {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .canvas--flow .edge--front {
    animation: none;
  }

  .canvas--flow .run-glow {
    animation: none;
    opacity: 0.2;
  }
}
</style>
