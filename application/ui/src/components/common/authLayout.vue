<template>
  <div class="flex-center fh fw bg-light register-page">
    <div class="p-l flex-center">
      <img width="100%" class="round-3" src="../../assets/background.svg" alt="" />
    </div>
    <div class="flex-center">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "authLayoutComponent",
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {},
  created() {},
  mounted() {},
};
</script>
<style lang='scss' scoped>
.register-page {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100vh;
  background: linear-gradient(to right, #ffcece, #e0e7ff);

  & img {
    box-shadow: 0px 0px 12px #e7e7e7;
  }
}
</style>
