<template>
  <div>
    <span ref="target" class="popover-target" @click="open">
      <slot name="target"></slot>
    </span>
    <Teleport to="body" :disabled="!isOpen" :key="isOpen">
      <div
        v-if="isOpen"
        ref="popover"
        class="popover-content"
        :class="direction"
        :style="popoverStyle"
      >
        <slot name="content"></slot>
      </div>
    </Teleport>
  </div>
</template>

<script>
export default {
  name: "Popover",
  props: {
    direction: {
      type: String,
      default: "bottom",
    },
    tooltip: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isOpen: false,
      popoverStyle: {},
    };
  },
  methods: {
    checkOutsideClick(event) {
      const target = this.$refs.target;
      const popover = this.$refs.popover;
      if (
        target &&
        popover &&
        !target.contains(event.target) &&
        !popover.contains(event.target)
      ) {
        this.close();
      }
    },
    open() {
      if (this.isOpen) return;
      this.isOpen = true;
      this.updatePosition();
      setTimeout(() => {
        !this.tooltip && window.addEventListener("click", this.checkOutsideClick);
      }, 100);
      
    },
    close() {
      this.isOpen = false;
      !this.tooltip &&
        window.removeEventListener("click", this.checkOutsideClick);
    },
    updatePosition() {
      this.$nextTick(() => {
        const target = this.$refs.target;
        const popover = this.$refs.popover;
        if (target && popover) {
          const targetRect = target.getBoundingClientRect();
          const popoverRect = popover.getBoundingClientRect();

          let top = 0;
          let left = 0;

          if (this.direction === "bottom" || this.direction === "top") {
            left =
              targetRect.left + targetRect.width / 2 - popoverRect.width / 2;
          } else if (this.direction === "left" || this.direction === "right") {
            top =
              targetRect.top +
              popoverRect.height / 2 -
              popoverRect.height / 2 +
              window.scrollY;
          }
          if (this.direction === "bottom") {
            top = targetRect.bottom + window.scrollY + 8;
          } else if (this.direction === "top") {
            top = targetRect.top - popoverRect.height + window.scrollY - 8;
          } else if (this.direction === "left") {
            left = targetRect.left - popoverRect.width + window.scrollX - 8;
          } else if (this.direction === "right") {
            left = targetRect.right + window.scrollX + 8;
          }
          this.popoverStyle = {
            top: `${top}px`,
            left: `${left}px`,
          };
        }
      });
    },
  },
  mounted() {
    window.addEventListener("resize", this.updatePosition);
    window.addEventListener("scroll", this.updatePosition);
    if (this.tooltip) {
      this.$refs.target.addEventListener("mouseover", this.open);
      this.$refs.target.addEventListener("mouseleave", this.close);
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updatePosition);
    window.removeEventListener("scroll", this.updatePosition);
    if (this.tooltip) {
      this.$refs.target.removeEventListener("mouseover", this.open);
      this.$refs.target.removeEventListener("mouseleave", this.close);
    }
  },
};
</script>

<style scoped>
.popover-content {
  position: fixed;
  z-index: 1000;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.popover-content::after {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
}

.popover-content.bottom::after {
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 0 8px 8px 8px;
  border-color: transparent transparent var(--color-border) transparent;
}

.popover-content.top::after {
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 8px 8px 0 8px;
  border-color: var(--color-border) transparent transparent transparent;
}

.popover-content.left::after {
  top: 50%;
  right: -8px;
  transform: translateY(-50%);
  border-width: 8px 8px 8px 0;
  border-color: transparent var(--color-border) transparent transparent;
}

.popover-content.right::after {
  top: 50%;
  left: -8px;
  transform: translateY(-50%);
  border-width: 8px 0 8px 8px;
  border-color: transparent transparent transparent var(--color-border);
}

.popover-content.bottom {
  transform: translateY(8px);
}

.popover-content.top {
  transform: translateY(-8px);
}

.popover-content.left {
  transform: translateX(-8px);
}

.popover-content.right {
  transform: translateX(8px);
}
</style>
