<template>
  <div>
    <div class="mask" :class="{ show: isOpen }" @click="$emit('close')"></div>
    <div class="drawer" :class="{ 'drawer-open': isOpen }">
      <div class="drawer-header">
        <h3 class="drawer-title">{{ title }}</h3>
        <button class="drawer-close" @click="$emit('close')">&times;</button>
      </div>
      <div class="drawer-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'drawerComponent',
  props: {
    title: {
      type: String,
      default: 'Drawer Title'
    },
    isOpen: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang='scss' scoped>
.drawer {
  position: fixed;
  top: 60px;
  right: 0;
  width: max(40%, 500px);
  height: 100%;
  background-color: var(--color-white);
  box-shadow: -2px 0 5px var(--color-border);
  transform: translateX(100%);
  transition: transform 0.3s ease-in-out;
  z-index: var(--z-100, 100);
}

.drawer-open {
  transform: translateX(0);
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-medium) var(--spacing-large);
  background-color: var(--color-background);
  border-bottom: 1px solid var(--color-border);
}

.drawer-title {
  font-size: var(--font-size-large);
  color: var(--color-text-primary);
  margin: 0;
}

.drawer-close {
  background: none;
  border: none;
  font-size: var(--font-size-large);
  color: var(--color-text-secondary);
  cursor: pointer;
}

.drawer-content {
  height: calc(100% - 140px);
  overflow: auto;
  padding: var(--spacing-large);
  color: var(--color-text-secondary);
  overflow-y: auto;
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--mask-color);
  z-index: calc(var(--z-100, 100) - 1);
  display: none;
}

.mask.show {
  display: block;
}
</style>
