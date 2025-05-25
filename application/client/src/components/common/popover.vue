<template>
  <div>
    <span ref="targetRef" class="popover-target" @click="open">
      <slot name="target"></slot>
    </span>
    <Teleport to="body" :disabled="!isOpen">
      <div
        v-if="isOpen"
        ref="popoverRef"
        :class="`popover-content ${props.position} ${popoverClasses.join(' ')}`"
        :style="popoverStyle"
      >
        <div v-if="props.title" class="popover-title">{{ props.title }}</div>
        <div class="popover-body">
          <slot name="content">{{ props.content }}</slot>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, onBeforeUnmount, nextTick } from 'vue';
import type { PropType } from 'vue';


type Position = 'top' | 'right' | 'bottom' | 'left';

export default defineComponent({
  name: 'Popover',
  props: {
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    position: {
      type: String as PropType<Position>,
      default: 'bottom',
      validator: (value: string): boolean => ['top', 'right', 'bottom', 'left'].includes(value)
    },
    tooltip: {
      type: Boolean,
      default: false
    }
  },
  emits: ['open', 'close'],
  setup(props, { emit }) {
    const popoverClasses = ref<string[]>([]); 
    const targetRef = ref<HTMLElement | null>(null);
    const popoverRef = ref<HTMLElement | null>(null);
    const isOpen = ref(false);
    const popoverStyle = reactive({
      top: '0px',
      left: '0px'
    });

    const checkOutsideClick = (event: MouseEvent) => {
      if (!targetRef.value || !popoverRef.value) return;
      
      if (
        !targetRef.value.contains(event.target as Node) &&
        !popoverRef.value.contains(event.target as Node)
      ) {
        close();
      }
    };

    const open = () => {
      if (isOpen.value) return;
      isOpen.value = true;
      emit('open');
      
      nextTick(() => {
        updatePosition();
        if (!props.tooltip) {
          setTimeout(() => {
            window.addEventListener('click', checkOutsideClick);
          }, 100);
        }
      });
    };

    const close = () => {
      isOpen.value = false;
      emit('close');
      if (!props.tooltip) {
        window.removeEventListener('click', checkOutsideClick);
      }
    };

    const updatePosition = () => {
      const target = targetRef.value;
      const popover = popoverRef.value;
      
      if (!target || !popover) return;
      
      const targetRect = target.getBoundingClientRect();
      const popoverRect = popover.getBoundingClientRect();

      let top = 0;
      let left = 0;

      if (props.position === 'bottom' || props.position === 'top') {
        left = targetRect.left + targetRect.width / 2 - popoverRect.width / 2;
      } else if (props.position === 'left' || props.position === 'right') {
        top = targetRect.top + targetRect.height / 2 - popoverRect.height / 2 + window.scrollY;
      }
      
      if (props.position === 'bottom') {
        top = targetRect.bottom + window.scrollY + 8;
      } else if (props.position === 'top') {
        top = targetRect.top - popoverRect.height + window.scrollY - 8;
      } else if (props.position === 'left') {
        left = targetRect.left - popoverRect.width + window.scrollX - 8;
      } else if (props.position === 'right') {
        left = targetRect.right + window.scrollX + 8;
      }

      if (left < 0) {
        left = 10; // Prevent popover from going off-screen
      } else if (left + popoverRect.width > window.innerWidth) {
        left = window.innerWidth - popoverRect.width - 10; // Adjust if it goes off-screen
      }
      if (top < 0) {
        top = 10; // Prevent popover from going off-screen
      } else if (top + popoverRect.height > window.innerHeight) {
        top = window.innerHeight - popoverRect.height - 10; // Adjust if it goes off-screen
      }

      popoverStyle.top = `${top}px`;
      popoverStyle.left = `${left}px`;
    };

    onMounted(() => {
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);
      
      if (props.tooltip && targetRef.value) {
        targetRef.value.addEventListener('mouseover', open);
        targetRef.value.addEventListener('mouseleave', close);
      }

      // check if component have a class "playground-popover"
      if (targetRef.value && targetRef?.value?.parentElement?.classList?.contains('playground-popover')) {
        popoverClasses?.value?.push('playground-popover-content');
      } 
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('click', checkOutsideClick);
      
      if (props.tooltip && targetRef.value) {
        targetRef.value.removeEventListener('mouseover', open);
        targetRef.value.removeEventListener('mouseleave', close);
      }
    });

    return {
      props,
      popoverClasses,
      targetRef,
      popoverRef,
      isOpen,
      popoverStyle,
      open,
      close
    };
  }
});
</script>

<style scoped>
.popover-content {
  position: fixed;
  z-index: 1000;
  border: 1pt solid var(--color-border);
  border-radius: 3pt;
  box-shadow: 0 1.5pt 6pt rgba(0, 0, 0, 0.15);
}

.popover-content::after {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
}

.popover-content.bottom::after {
  top: -6pt;
  left: 50%;
  transform: translateX(-50%);
  border-width: 0 6pt 6pt 6pt;
  border-color: transparent transparent var(--color-border) transparent;
}

.popover-content.top::after {
  bottom: -6pt;
  left: 50%;
  transform: translateX(-50%);
  border-width: 6pt 6pt 0 6pt;
  border-color: var(--color-border) transparent transparent transparent;
}

.popover-content.left::after {
  top: 50%;
  right: -6pt;
  transform: translateY(-50%);
  border-width: 6pt 6pt 6pt 0;
  border-color: transparent var(--color-border) transparent transparent;
}

.popover-content.right::after {
  top: 50%;
  left: -6pt;
  transform: translateY(-50%);
  border-width: 6pt 0 6pt 6pt;
  border-color: transparent transparent transparent var(--color-border);
}

.popover-content.bottom {
  transform: translateY(6pt);
}

.popover-content.top {
  transform: translateY(-6pt);
}

.popover-content.left {
  transform: translateX(-6pt);
}

.popover-content.right {
  transform: translateX(6pt);
}

.popover-title {
  font-weight: bold;
  padding: 8px 12px;
  border-bottom: 1px solid var(--color-border);
}

</style>
