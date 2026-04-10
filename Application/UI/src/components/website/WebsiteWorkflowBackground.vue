<template>
  <div ref="wrapper" class="workflow-bg" aria-hidden="true">
    <svg
      :width="windowWidth"
      :height="windowHeight"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <pattern
          id="workflow-grid"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke="var(--border-subtle)"
            stroke-width="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#workflow-grid)" opacity="1" />
      <path
        :d="straightPath"
        stroke-width="3"
        stroke="transparent"
        fill="none"
        :opacity="0.25"
      />
      <path
        :d="curvePath"
        stroke-width="3"
        stroke="var(--accent-blue)"
        fill="none"
        :opacity="0.25"
      />
      <path ref="pathRef" :d="linePath" fill="none" stroke="none" />
      <circle
        v-if="startPoint"
        :cx="startPoint.x"
        :cy="startPoint.y"
        r="4"
        fill="var(--accent-blue)"
        opacity="0.8"
      />
      <circle
        v-if="endPoint"
        :cx="endPoint.x"
        :cy="endPoint.y"
        r="4"
        fill="var(--transform-node-color)"
        opacity="0.8"
      />
      <circle ref="dotRef" r="8" fill="var(--accent-blue)" />
    </svg>
  </div>
</template>
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
interface NodeSectionPosition {
  top: number;
  left: number;
  width: number;
  height: number;
  nodeId: string;
}
const wrapper = ref<HTMLElement | null>(null);
const pathRef = ref<SVGPathElement | null>(null);
const dotRef = ref<SVGCircleElement | null>(null);
const windowWidth = ref(window.innerWidth);
const windowHeight = ref(window.innerHeight);
const nodeSectionsPositions = ref<NodeSectionPosition[]>([]);
const linePath = ref("");
const straightPath = ref("");
const curvePath = ref("");
const startPoint = ref<{ x: number; y: number } | null>(null);
const endPoint = ref<{ x: number; y: number } | null>(null);
let rafId = 0;
let pathLength = 0;
let onResize: (() => void) | null = null;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const generatePath = () => {
  let fullPath = "";
  let straight = "";
  let curve = "";
  // form box top to box bottom will be straight line and form one box to another box will be curve line
  // starting point will be box1 center top
  const startingBox = nodeSectionsPositions.value[0];
  if (!startingBox) return { fullPath, straight, curve };
  let currentX = startingBox.left + startingBox.width / 2;
  let currentY = startingBox.top;
  fullPath += `M ${currentX} ${currentY} `;
  for (let i = 0; i < nodeSectionsPositions.value.length; i++) {
    const box = nodeSectionsPositions.value[i] as NodeSectionPosition;
    const boxCenterX = box.left + box.width / 2;
    const boxBottomY = box.top + box.height;
    // line to box bottom
    const lineSegment = `L ${boxCenterX} ${boxBottomY} `;
    fullPath += lineSegment;
    straight += `M ${boxCenterX} ${box.top} ${lineSegment}`;
    // if not last box, curve to next box top
    if (i < nodeSectionsPositions.value.length - 1) {
      const nextBox = nodeSectionsPositions.value[i + 1] as NodeSectionPosition;
      const nextBoxCenterX = nextBox.left + nextBox.width / 2;
      const nextBoxTopY = nextBox.top;

      const curveSegment = `C
        ${boxCenterX} ${nextBoxTopY}
        ${nextBoxCenterX} ${boxBottomY}
        ${nextBoxCenterX} ${nextBoxTopY}
      `;
      fullPath += curveSegment;
      curve += `M ${boxCenterX} ${boxBottomY} ${curveSegment}`;
      // path += `C ${controlPointX} ${boxBottomY} ${controlPointX} ${nextBoxTopY} ${nextBoxCenterX} ${nextBoxTopY} `;
    }
  }
  return { fullPath, straight, curve };
};

onMounted(() => {
  const body = document.body;
  windowHeight.value = body.clientHeight;
  windowWidth.value = body.clientWidth;
  // Placeholder for future functionality
  wrapper.value?.style.setProperty("--window-width", `${windowWidth.value}px`);
  wrapper.value?.style.setProperty(
    "--window-height",
    `${windowHeight.value}px`
  );

  const initBackground = () => {
    nodeSectionsPositions.value = [];
    const nodeSections = document.querySelectorAll(".node-section");
    nodeSections.forEach((section, index) => {
      const { top, left, width, height } = section.getBoundingClientRect();
      const nodeId = `node-${index}`;
      section.setAttribute("data-node-id", nodeId);
      nodeSectionsPositions.value.push({ top, left, width, height, nodeId });
    });
    nodeSectionsPositions.value = nodeSectionsPositions.value.sort(
      (a, b) => a.top - b.top
    );

    const paths = generatePath();
    linePath.value = paths.fullPath;
    straightPath.value = paths.straight;
    curvePath.value = paths.curve;

    requestAnimationFrame(() => {
      if (pathRef.value) {
        pathLength = pathRef.value.getTotalLength();
      }
      if (pathRef.value && pathLength > 0) {
        const start = pathRef.value.getPointAtLength(0);
        const end = pathRef.value.getPointAtLength(pathLength);
        startPoint.value = { x: start.x, y: start.y };
        endPoint.value = { x: end.x, y: end.y };
      }
      updateDotPosition();
    });
  };

  initBackground();

  window.addEventListener("scroll", onScroll, { passive: true });

  onResize = () => {
    windowHeight.value = document.body.clientHeight;
    windowWidth.value = document.body.clientWidth;
    wrapper.value?.style.setProperty("--window-width", `${windowWidth.value}px`);
    wrapper.value?.style.setProperty("--window-height", `${windowHeight.value}px`);
    initBackground();
  };

  window.addEventListener("resize", onResize, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  if (onResize) {
    window.removeEventListener("resize", onResize);
  }
  if (rafId) {
    cancelAnimationFrame(rafId);
  }
});

const updateDotPosition = () => {
  if (!wrapper.value || !pathRef.value || !dotRef.value || !pathLength) {
    return;
  }
  const passed = clamp(
    window.scrollY / (document.body.scrollHeight - window.innerHeight),
    0,
    1
  );
  const point = pathRef.value.getPointAtLength(pathLength * passed);
  const isIntersecting = nodeSectionsPositions.value.some((section) => {
    const id = section.nodeId;
    const sectionElement = document.querySelector(`.node-section[data-node-id="${id}"]`);
    if (!sectionElement) return false;
    const rect = sectionElement.getBoundingClientRect();
    const sectionTop = rect.top + window.scrollY;
    const sectionBottom = sectionTop + rect.height;
    const intersection = point.y >= sectionTop && point.y <= sectionBottom;
    if (intersection) {
      sectionElement.classList.add("intersected-highlighted");
      return true;
    }
    sectionElement.classList.remove("intersected-highlighted");
    return false;
  });
  if (isIntersecting) {
    dotRef.value.setAttribute("opacity", "0");
    return;
  } else {
    dotRef.value.setAttribute("opacity", "1");
  }
  dotRef.value.setAttribute("cx", point.x.toFixed(2));
  dotRef.value.setAttribute("cy", point.y.toFixed(2));
};

const onScroll = () => {
  if (rafId) return;
  rafId = requestAnimationFrame(() => {
    rafId = 0;
    updateDotPosition();
  });
};
</script>
<style scoped>
.workflow-bg {
  position: absolute;
  top: 0;
  z-index: 1;
}
</style>
