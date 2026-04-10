<script setup lang="ts">
import WebsiteHeader from '@/components/website/WebsiteHeader.vue'
import WebsiteFooter from '@/components/website/WebsiteFooter.vue'
import WebsiteWorkflowBackground from '@/components/website/WebsiteWorkflowBackground.vue'
import WebsiteProductHero from '@/components/website/WebsiteProductHero.vue'
import WebsiteChapterBuild from '@/components/website/WebsiteChapterBuild.vue'
import WebsiteChapterEnv from '@/components/website/WebsiteChapterEnv.vue'
import WebsiteChapterRun from '@/components/website/WebsiteChapterRun.vue'
import WebsiteChapterHistory from '@/components/website/WebsiteChapterHistory.vue'
import WebsiteStoryFeatures from '@/components/website/WebsiteStoryFeatures.vue'
import WebsiteStoryUsecases from '@/components/website/WebsiteStoryUsecases.vue'
import WebsiteTrustStrip from '@/components/website/WebsiteTrustStrip.vue'
import WebsiteFinalCta from '@/components/website/WebsiteFinalCta.vue'

const currentYear = new Date().getFullYear()
</script>

<template>
  <div class="website-page">
    <WebsiteWorkflowBackground />
    <div class="website-container">
      <WebsiteHeader />
      <WebsiteProductHero />
      <WebsiteChapterBuild />
      <WebsiteChapterEnv />
      <WebsiteChapterRun />
      <WebsiteChapterHistory />
      <WebsiteStoryFeatures />
      <WebsiteStoryUsecases />
      <WebsiteTrustStrip />
      <WebsiteFinalCta />
      <WebsiteFooter :year="currentYear" />
    </div>
  </div>
</template>

<style scoped>
:global(html) {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  :global(html) {
    scroll-behavior: auto;
  }
}

.website-page {
  min-height: 100vh;
  font-family: var(--font-sans);
  background: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.5;
  position: relative;
}

.website-page::before {
  content: '';
  position: fixed;
  inset: 0;
  background:
    radial-gradient(
      900px 420px at 8% -10%,
      color-mix(in srgb, var(--accent-blue) 16%, transparent),
      transparent 60%
    ),
    radial-gradient(
      700px 380px at 90% 0%,
      color-mix(in srgb, var(--transform-node-color) 14%, transparent),
      transparent 65%
    ),
    repeating-linear-gradient(
      0deg,
      transparent 0,
      transparent 22px,
      color-mix(in srgb, var(--text-primary) 2%, transparent) 23px,
      transparent 24px
    ),
    repeating-linear-gradient(
      90deg,
      transparent 0,
      transparent 34px,
      color-mix(in srgb, var(--text-primary) 2%, transparent) 35px,
      transparent 36px
    );
  opacity: 0.6;
  pointer-events: none;
}

.website-page :deep(.container) {
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: var(--radius-sm);
  position: relative;
  z-index: 2;
}

.website-container {
  position: relative;
  z-index: 2;
}

/* Hash targets clear sticky header */
.website-page :deep(section[id]) {
  scroll-margin-top: 80px;
}
</style>
