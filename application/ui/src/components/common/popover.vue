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
  background-color: var(--color-background);
  border: 1pt solid var(--color-border);
  border-radius: 3pt;
  box-shadow: 0 1.5pt 6pt rgba(0, 0, 0, 0.15);
  padding: var(--spacing-medium);
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
</style>
