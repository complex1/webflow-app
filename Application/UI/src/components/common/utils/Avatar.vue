<template>
  <div class="af-avatar" :class="[`af-avatar--${size}`]" :style="avatarStyle">
    <img v-if="src" :src="src" :alt="alt" />
    <span v-else>{{ initials }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type AvatarSize = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    src?: string
    alt?: string
    name?: string
    size?: AvatarSize
    color?: string
  }>(),
  {
    size: 'md'
  }
)

const initials = computed(() => {
  if (props.name) {
    return props.name
      .split(' ')
      .map((part) => part[0]?.toUpperCase())
      .slice(0, 2)
      .join('')
  }
  return 'AP'
})

const avatarStyle = computed(() => ({
  background: props.color || 'color-mix(in srgb, var(--accent-blue) 20%, transparent)'
}))
</script>

<style scoped>
.af-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid var(--border-default);
  color: var(--text-primary);
  font-weight: 600;
  overflow: hidden;
}

.af-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.af-avatar--sm {
  width: 32px;
  height: 32px;
  font-size: var(--text-sm);
}

.af-avatar--md {
  width: 40px;
  height: 40px;
  font-size: var(--text-sm);
}

.af-avatar--lg {
  width: 56px;
  height: 56px;
  font-size: var(--text-md);
}
</style>
