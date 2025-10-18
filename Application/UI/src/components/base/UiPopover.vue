<template>
  <div class="ui-popover" ref="popoverRef">
    <div class="popover-trigger" @click="handleTriggerClick">
      <slot name="trigger"></slot>
    </div>
    <div
      class="view-variable-data-popover"
      :class="{
        top: props.placement === 'top',
        bottom: props.placement === 'bottom',
        left: props.placement === 'left',
        right: props.placement === 'right',
      }"
      v-if="openViewData"
      @click.stop
      @wheel.stop
    >
      <div v-if="props.title" class="popover-header">
        <div class="popover-title">{{ props.title }}</div>
        <i class="fa fa-times close-icon" @click="openViewData = false"></i>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps<{
  placement?: "top" | "bottom" | "left" | "right";
  title?: string;
}>();
const emit = defineEmits<{
  (e: "open"): void;
  (e: "close"): void;
}>();

const openViewData = ref(false);
const popoverRef = ref<HTMLElement>();

const handleTriggerClick = () => {
  openViewData.value = !openViewData.value;
};

function handleClickOutside(event: MouseEvent) {
  if (popoverRef.value && !popoverRef.value.contains(event.target as Node)) {
    openViewData.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.ui-popover {
  position: relative;
  display: inline-block;
}
.popover-trigger {
  cursor: pointer;
}
.view-variable-data-popover {
  position: absolute;
  z-index: 1000;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 10px;
}

.view-variable-data-popover.top {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
}
.view-variable-data-popover.bottom {
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 8px;
}
.view-variable-data-popover.left {
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-right: 8px;
}
.view-variable-data-popover.right {
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 8px;
}


</style>
