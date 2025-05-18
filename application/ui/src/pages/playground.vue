<template>
  <div class="workflow" >
    <workflow-header></workflow-header>
    <workflow-playground></workflow-playground>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import workflowHeader from '../components/workflow/workflowHeader.vue';
import WorkflowPlayground from '../components/workflow/workflowPlayground.vue';
import { WebflowService } from '../services/webflow.service';

export default {
  components: { workflowHeader, WorkflowPlayground },
  name: "workflow",
  
  async created() {
    // Check for webflow ID in route query params
    const webflowId = this.$route.query.id;
    if (webflowId) {
      await this.loadWebflow(webflowId);
    }
  },
  
  methods: {
    ...mapMutations({
      setWorkflowId: 'workflowModule/setWorkflowId',
      setWorkflowName: 'workflowModule/setWorkflowName',
      setWorkflowDescription: 'workflowModule/setWorkflowDescription',
    }),
    
    async loadWebflow(id) {
      try {
        const webflowService = new WebflowService();
        const webflow = await webflowService.getWebflowById(id);
        
        if (webflow) {
          this.setWorkflowId(webflow.id);
          this.setWorkflowName(webflow.name);
          this.setWorkflowDescription(webflow.description || '');
          
          // If there's workflow data, you would load it here
          // For example, if you store nodes and edges in webflow.data
          if (webflow.data) {
            // TODO: Load workflow data into your workflow state
            console.log('Loading workflow data:', webflow.data);
          }
        }
      } catch (error) {
        console.error('Error loading webflow:', error);
      }
    }
  }
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
