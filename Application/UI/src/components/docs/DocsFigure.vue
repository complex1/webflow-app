<template>
  <figure class="docs-figure">
    <div
      class="docs-figure__placeholder"
      :style="placeholderStyle"
      role="img"
      :aria-label="alt"
    >
      <span class="docs-figure__badge" aria-hidden="true">Screenshot placeholder</span>
      <span class="docs-figure__hint">Image will be added later</span>
    </div>
    <figcaption v-if="caption" class="docs-figure__caption">{{ caption }}</figcaption>
  </figure>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Long description for accessibility and for designers adding the real asset. */
    alt: string
    caption?: string
    /** e.g. "16/9", "4/3" */
    aspectRatio?: string
  }>(),
  {
    aspectRatio: '16/9',
  }
)

const placeholderStyle = computed(() => ({
  aspectRatio: props.aspectRatio.replace('/', ' / '),
}))
</script>

<style scoped>
.docs-figure {
  margin: 16px 0;
}

.docs-figure__placeholder {
  border: 2px dashed var(--border-default);
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--bg-elevated) 85%, transparent);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px;
  text-align: center;
  min-height: 120px;
}

.docs-figure__badge {
  font-size: var(--text-xs, 0.75rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--accent-blue);
}

.docs-figure__hint {
  font-size: var(--text-sm, 0.875rem);
  color: var(--text-muted);
  max-width: 28rem;
}

.docs-figure__caption {
  margin: 10px 0 0;
  font-size: var(--text-sm, 0.875rem);
  color: var(--text-secondary);
  line-height: 1.45;
}
</style>
