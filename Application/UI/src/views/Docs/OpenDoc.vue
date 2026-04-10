<template>
  <div class="website-page">
    <div class="website-inner">
      <WebsiteHeader />
      <div class="docs-page container layout">
        <DocsSidebar />
        <main>
          <DocsManualPartA />
          <DocsManualPartB />
        </main>
      </div>
      <WebsiteFooter :year="currentYear" />
    </div>
  </div>
</template>

<script setup lang="ts">
import WebsiteHeader from '@/components/website/WebsiteHeader.vue'
import WebsiteFooter from '@/components/website/WebsiteFooter.vue'
import DocsSidebar from '@/components/docs/DocsSidebar.vue'
import DocsManualPartA from '@/components/docs/DocsManualPartA.vue'
import DocsManualPartB from '@/components/docs/DocsManualPartB.vue'

const currentYear = new Date().getFullYear()
</script>

<style src="@/components/docs/docs.css"></style>

<style scoped>
.website-page {
  min-height: 100vh;
  font-family: var(--font-sans);
  background: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.5;
}

.website-inner {
  position: relative;
  z-index: 1;
}

:global(html) {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  :global(html) {
    scroll-behavior: auto;
  }
}
</style>
