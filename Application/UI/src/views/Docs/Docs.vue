<template>
  <AppLayout>
    <div class="docs-page container layout">
      <DocsSidebar />
      <main>
        <DocsManualPartA />
        <DocsManualPartB />
      </main>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'
import DocsSidebar from '@/components/docs/DocsSidebar.vue'
import DocsManualPartA from '@/components/docs/DocsManualPartA.vue'
import DocsManualPartB from '@/components/docs/DocsManualPartB.vue'
</script>

<style src="@/components/docs/docs.css"></style>
