<template>
  <div class="fixed-popover-demo">
    <div class="demo-section">
      <h2>UiFixedPopover Examples</h2>
      <p class="demo-description">
        Fixed popover component with glass effects and multiple positioning options.
      </p>
    </div>

    <!-- Basic Example -->
    <div class="demo-section">
      <h3>Basic Usage</h3>
      <div class="demo-controls">
        <UiButton 
          ref="basicTrigger"
          @click="showBasicPopover = !showBasicPopover"
          variant="primary"
        >
          Toggle Basic Popover
        </UiButton>
      </div>

      <UiFixedPopover
        v-model:visible="showBasicPopover"
        title="Basic Popover"
        :target-element="basicTrigger?.$el"
        placement="bottom"
        size="md"
      >
        <p>This is a basic fixed popover with glass effects and Neo-Systemic styling.</p>
        <p>It automatically positions itself relative to the trigger button.</p>
      </UiFixedPopover>
    </div>

    <!-- Position Examples -->
    <div class="demo-section">
      <h3>Placement Options</h3>
      <div class="demo-grid">
        <UiButton 
          v-for="placement in placements"
          :key="placement"
          ref="placementTriggers"
          @click="showPlacementPopover(placement)"
          variant="secondary"
          size="sm"
        >
          {{ placement }}
        </UiButton>
      </div>

      <UiFixedPopover
        v-model:visible="placementPopoverVisible"
        :title="`Placement: ${currentPlacement}`"
        :target-element="currentTarget"
        :placement="currentPlacement"
        size="sm"
      >
        <p>This popover is positioned {{ currentPlacement }} relative to the button.</p>
      </UiFixedPopover>
    </div>

    <!-- Size Examples -->
    <div class="demo-section">
      <h3>Size Variants</h3>
      <div class="demo-controls">
        <UiButton 
          v-for="size in sizes"
          :key="size"
          @click="showSizePopover(size)"
          variant="outline"
          :size="size"
        >
          Size {{ size.toUpperCase() }}
        </UiButton>
      </div>

      <UiFixedPopover
        v-model:visible="sizePopoverVisible"
        :title="`Size: ${currentSize}`"
        :position="centerPosition"
        :size="currentSize"
      >
        <template #header>
          <div>
            <h4>Custom Header Content</h4>
            <p class="subtitle">Size variant: {{ currentSize }}</p>
          </div>
        </template>
        
        <div class="size-demo-content">
          <p>This popover demonstrates the {{ currentSize }} size variant.</p>
          <ul>
            <li>Responsive design</li>
            <li>Glass morphism effects</li>
            <li>Auto-positioning</li>
            <li>Smooth animations</li>
          </ul>
        </div>

        <template #footer>
          <UiButton variant="secondary" size="sm" @click="sizePopoverVisible = false">
            Cancel
          </UiButton>
          <UiButton variant="primary" size="sm" @click="sizePopoverVisible = false">
            Confirm
          </UiButton>
        </template>
      </UiFixedPopover>
    </div>

    <!-- Custom Position Example -->
    <div class="demo-section">
      <h3>Custom Position</h3>
      <div class="demo-controls">
        <UiButton 
          @click="showCustomPopover"
          variant="accent"
        >
          Show Custom Position
        </UiButton>
        <UiButton 
          @click="showMousePopover"
          variant="outline"
          @mousemove="updateMousePosition"
        >
          Mouse Position (Hover)
        </UiButton>
      </div>

      <UiFixedPopover
        v-model:visible="customPopoverVisible"
        title="Custom Position"
        :position="customPosition"
        size="md"
        :show-arrow="false"
      >
        <p>This popover is positioned at custom coordinates (200px, 100px from top-left).</p>
        <p>Perfect for tooltips, context menus, or floating panels.</p>
      </UiFixedPopover>

      <UiFixedPopover
        v-model:visible="mousePopoverVisible"
        title="Mouse Follower"
        :position="mousePosition"
        size="sm"
        :show-arrow="false"
        :closable="false"
      >
        <p>Following your mouse!</p>
        <p>X: {{ mousePosition.x }}, Y: {{ mousePosition.y }}</p>
      </UiFixedPopover>
    </div>

    <!-- Rich Content Example -->
    <div class="demo-section">
      <h3>Rich Content</h3>
      <div class="demo-controls">
        <UiButton 
          ref="richTrigger"
          @click="showRichPopover = !showRichPopover"
          variant="primary"
        >
          Show Rich Content
        </UiButton>
      </div>

      <UiFixedPopover
        v-model:visible="showRichPopover"
        title="Rich Content Example"
        :target-element="richTrigger?.$el"
        placement="top"
        size="lg"
      >
        <div class="rich-content">
          <div class="feature-grid">
            <div class="feature-item">
              <i class="fas fa-palette"></i>
              <h4>Glass Design</h4>
              <p>Beautiful glass morphism effects with backdrop filters.</p>
            </div>
            <div class="feature-item">
              <i class="fas fa-mobile-alt"></i>
              <h4>Responsive</h4>
              <p>Automatically adapts to different screen sizes.</p>
            </div>
            <div class="feature-item">
              <i class="fas fa-rocket"></i>
              <h4>Performance</h4>
              <p>Optimized animations and smooth interactions.</p>
            </div>
            <div class="feature-item">
              <i class="fas fa-universal-access"></i>
              <h4>Accessible</h4>
              <p>Full keyboard navigation and screen reader support.</p>
            </div>
          </div>
        </div>

        <template #footer>
          <UiButton variant="secondary" @click="showRichPopover = false">
            Close
          </UiButton>
          <UiButton variant="primary">
            Learn More
          </UiButton>
        </template>
      </UiFixedPopover>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { UiButton, UiFixedPopover } from '@/components/base'

// Basic popover
const showBasicPopover = ref(false)
const basicTrigger = ref()

// Placement examples
const placements = [
  'top', 'top-start', 'top-end',
  'bottom', 'bottom-start', 'bottom-end',
  'left', 'left-start', 'left-end',
  'right', 'right-start', 'right-end'
] as const

const placementPopoverVisible = ref(false)
const currentPlacement = ref<typeof placements[number]>('bottom')
const currentTarget = ref<HTMLElement | null>(null)
const placementTriggers = ref<any[]>([])

const showPlacementPopover = (placement: typeof placements[number]) => {
  const index = placements.indexOf(placement)
  const triggerComponent = placementTriggers.value[index]
  currentTarget.value = triggerComponent?.$el as HTMLElement
  currentPlacement.value = placement
  placementPopoverVisible.value = true
}

// Size examples
const sizes = ['sm', 'md', 'lg', 'xl'] as const
const sizePopoverVisible = ref(false)
const currentSize = ref<typeof sizes[number]>('md')

const centerPosition = reactive({ x: 0, y: 0 })

const showSizePopover = (size: typeof sizes[number]) => {
  currentSize.value = size
  // Center the popover
  centerPosition.x = window.innerWidth / 2
  centerPosition.y = window.innerHeight / 2
  sizePopoverVisible.value = true
}

// Custom position examples
const customPopoverVisible = ref(false)
const customPosition = reactive({ x: 200, y: 100 })

const showCustomPopover = () => {
  customPopoverVisible.value = true
}

// Mouse position example
const mousePopoverVisible = ref(false)
const mousePosition = reactive({ x: 0, y: 0 })

const updateMousePosition = (event: MouseEvent) => {
  mousePosition.x = event.clientX + 10
  mousePosition.y = event.clientY + 10
  mousePopoverVisible.value = true
}

const showMousePopover = () => {
  // Will be shown on mousemove
}

// Rich content example
const showRichPopover = ref(false)
const richTrigger = ref()
</script>

<style scoped>
.fixed-popover-demo {
  padding: var(--spacing-xl);
  max-width: 1200px;
  margin: 0 auto;
}

.demo-section {
  margin-bottom: var(--spacing-2xl);
  padding: var(--spacing-xl);
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-2xl);
}

.demo-section h2 {
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
  background: var(--gradient-flow-blue);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.demo-section h3 {
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
  font-size: var(--text-lg);
}

.demo-description {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
}

.demo-controls {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.subtitle {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin: var(--spacing-xs) 0 0 0;
}

.size-demo-content ul {
  margin: var(--spacing-md) 0;
  padding-left: var(--spacing-lg);
}

.size-demo-content li {
  margin-bottom: var(--spacing-xs);
  color: var(--text-secondary);
}

.rich-content {
  padding: var(--spacing-md) 0;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
}

.feature-item {
  text-align: center;
  padding: var(--spacing-md);
  background: var(--glass-bg-subtle);
  border: 1px solid var(--glass-border-subtle);
  border-radius: var(--radius-lg);
  backdrop-filter: var(--glass-backdrop-subtle);
  -webkit-backdrop-filter: var(--glass-backdrop-subtle);
}

.feature-item i {
  font-size: var(--text-2xl);
  color: var(--color-flow-blue);
  margin-bottom: var(--spacing-sm);
}

.feature-item h4 {
  color: var(--text-primary);
  margin: var(--spacing-sm) 0;
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
}

.feature-item p {
  color: var(--text-secondary);
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
  margin: 0;
}

@media (max-width: 768px) {
  .demo-grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
}
</style>