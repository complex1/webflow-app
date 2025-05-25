<template>
  <div class="workflow" >
    <workflow-header></workflow-header>
    <workflow-playground v-if="!loading"></workflow-playground>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import workflowHeader from '../components/workflow/workflowHeader.vue';
import WorkflowPlayground from '../components/workflow/workflowPlayground.vue';
import { WebflowService } from '../services/webflow.service';
import { getResponseToNodeList } from '../utils/workflowUtils';
import type { WebflowCardProps } from '../components/dashboard/types';
import type { IEdge } from '../model';
import type FunctionalNode from '../classes/FunctionalNode';
import type HttpNode from '../classes/HttpNode';

export default defineComponent({
  components: { workflowHeader, WorkflowPlayground },
  name: "workflow",
  
  setup() {
    const loading = ref<boolean>(true);
    const route = useRoute();
    const store = useStore();
    const webflowService = new WebflowService();
    
    const loadWebflow = async (id: string) => {
      loading.value = true;
      // Reset workflow state before loading a new webflow
      store.commit('workflowModule/resetWorkflowState');
      try {
        const webflow = await webflowService.getWebflowById(id) as WebflowCardProps;
        
        if (webflow) {
          store.commit('workflowModule/setWorkflowId', webflow.id);
          store.commit('workflowModule/setWorkflowName', webflow.name);
          store.commit('workflowModule/setWorkflowDescription', webflow.description || '');
          
          // If there's workflow data, load it into the workflow state
          if (webflow.data) {
            const nodesWithPosition = getResponseToNodeList(webflow.data);
            nodesWithPosition.forEach(({ node, position }) => {
              store.commit('workflowModule/addNodeWithPosition', { node, position });
            });

            // Assuming edges are also part of the webflow data
            if (webflow.data.edges) {
              webflow.data.edges.forEach((edge: IEdge) => {
                store.commit('workflowModule/addEdge', edge);
              });
            }
          }
        }
      } catch (error) {
        console.error('Error loading webflow:', error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(async () => {
      // Check for webflow ID in route query params
      const webflowId = route.query.id as string;
      if (webflowId) {
        await loadWebflow(webflowId);
      }
    });
    
    return {
      loading,
      // No need to expose methods that are only used internally
    };
  }
});
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
