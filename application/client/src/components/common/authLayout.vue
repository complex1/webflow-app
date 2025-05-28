<template>
  <div class="flex-center fh fw bg-light register-page">
   <div class="background">
     <div v-for="i in count" :key="i" class="box"></div>
   </div>
    <div class="p-l flex-center z-1">
      <img width="100%" class="round-3" src="../../assets/logo.svg" alt="" />
    </div>
    <div class="flex-center z-1">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'AuthLayout',
  props: {
    title: {
      type: String,
      default: 'Authentication'
    }
  },
  setup() {
    const count = ref(0);

    count.value = Math.floor(((window.innerWidth / 50) * (window.innerHeight / 50)) * 1.5);
    return { count };
  }
});
</script>
<style lang='scss' scoped>
.register-page {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100vh;
  width: 100vw;
  .background {
    position: fixed;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    top: 0;
    left: 0;
    z-index: 0;
    display: flex;
    flex-wrap: wrap;
  }
  .box {
    height: 50px;
    width: 50px;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      border: 1px solid var(--color-primary);
      transform: translateY(-50%);
      opacity: 0.1;
    }
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      bottom: 0;
      border: 1px solid var(--color-primary);
      transform: translateX(-50%);
      opacity: 0.1;
    }
  }
}
</style>
