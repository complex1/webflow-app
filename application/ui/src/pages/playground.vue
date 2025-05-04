<template>
  <div class="workflow" >
    <workflow-header></workflow-header>
    <workflow-playground></workflow-playground>
  </div>
</template>

<script>
import workflowHeader from '../components/workflow/workflowHeader.vue';
import WorkflowPlayground from '../components/workflow/workflowPlayground.vue';
export default {
  components: { workflowHeader, WorkflowPlayground },
  name: "workflow",
};
</script>

<style lang="scss">
@import "@vue-flow/core/dist/style.css";
@import "@vue-flow/core/dist/theme-default.css";
@import '@vue-flow/controls/dist/style.css';
.workflow {
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-rows: 60px calc(100vh - 60px);
}
</style>
