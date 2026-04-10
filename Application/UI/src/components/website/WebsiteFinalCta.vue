<script setup lang="ts">
import Button from '@/components/common/buttons/Button.vue'
import { trackMarketingEvent } from '@/composables/useMarketingAnalytics'

function primary() {
  trackMarketingEvent('cta_footer_primary')
}

function secondary() {
  trackMarketingEvent('cta_footer_secondary')
}
</script>

<template>
  <section id="cta" class="wrap container" aria-labelledby="cta-heading">
    <div class="inner">
      <h2 id="cta-heading" class="h">Ready to sketch your next API path?</h2>
      <div class="row">
        <router-link to="/register" class="link" @click="primary">
          <Button variant="primary" icon="desktop" data-analytics="cta_footer_primary">
            Get started
          </Button>
        </router-link>
        <router-link to="/example-playground" class="link" @click="secondary">
          <Button variant="secondary" icon="angle-right" data-analytics="cta_footer_secondary">
            Try playground
          </Button>
        </router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
.wrap {
  padding: 8px 20px 56px;
  max-width: 1120px;
  margin: 0 auto;
}

.inner {
  padding: 28px 24px 32px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-default);
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--accent-blue) 14%, var(--bg-secondary)),
    color-mix(in srgb, var(--transform-node-color) 8%, var(--bg-secondary))
  );
  text-align: center;
}

.h {
  margin: 0;
  font-size: clamp(1.25rem, 2.2vw, 1.5rem);
  letter-spacing: -0.02em;
}

.row {
  margin-top: 18px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  align-items: center;
}

.link {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
}
</style>
