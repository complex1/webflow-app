<template>
  <div class="workflow" >
    <div class="example-navbar">
      <div class="example-navbar-brand">
        <a href="/" class="logo">
          <img src="../../assets/logo-min.svg" alt="">
          <span class="mx-m text-bold">ApiFlux Playground</span>
        </a>
      </div>
      <div class="example-navbar-end">
        <button
          data-tooltip="Run Pipeline"
          data-tooltip-position="bottom"
          class="btn btn-icon"
          @click="playWorkflow"
        >
          <i class="pi pi-play"></i>
        </button>
        <router-link to="/login">
          <button class="btn btn-primary" >Login</button>
        </router-link>
        <router-link to="/register">
          <button class="btn btn-secondary" >Register</button>
        </router-link>
      </div>
    </div>
    <workflow-playground v-if="!loading"></workflow-playground>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import WorkflowPlayground from '../../components/workflow/workflowPlayground.vue';
import { getResponseToNodeList } from '../../utils/workflowUtils';
import type { IEdge } from '../../model'; 
import ExampleData from './exampleWorkflow';
import type { LoggerInterface } from '../../classes/logger';
import { LogType } from '../../classes/logger';
export default defineComponent({
  components: { WorkflowPlayground },
  name: 'PlaygroundExample',
  
  setup() {
    const loading = ref<boolean>(true);
    const store = useStore();
    
    const loadWebflow = async () => {
      loading.value = true;
      // Reset workflow state before loading a new webflow
      store.commit('workflowModule/resetWorkflowState');
      try {
        const webflow = ExampleData;

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

    const addWorkFlowLog = (message: string, type: LogType) => {
          store.commit('workflowLoggerModule/addLog', {
            message,
            type,
            timestamp: new Date().toISOString(),
        });
    };

    const logger: LoggerInterface = {
        log: (message: string, type: LogType) => {
          addWorkFlowLog(message, type);
        },
        clear: () => {},
        info: (message: string) => {
          addWorkFlowLog(message, LogType.INFO);
        },
        warn: (message: string) => {
          addWorkFlowLog(message, LogType.WARN);
        },
        error: (message: string) => {
          addWorkFlowLog(message, LogType.ERROR);
        },
        debug: (message: string) => {
          addWorkFlowLog(message, LogType.DEBUG);
        },
        logs: [],
        success: function(message: any): void {
          addWorkFlowLog(message, LogType.SUCCESS);
        }
      };

    const playWorkflow = () => {
      store.commit('workflowModule/executeWorkflow', logger);
    };

    onMounted(async () => {
        await loadWebflow();
    });

    return { loading, playWorkflow };
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
<style lang="scss" scoped>
.example-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 var(--spacing-large);
  background-color: var(--color-white);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-drop);
}

.example-navbar-brand {
  margin-right: var(--spacing-xlarge);

  .logo {
    display: flex;
    align-items: center;
    color: var(--color-primary);
    font-size: var(--font-size-large);
    font-weight: bold;
    text-decoration: none;

    i {
      margin-right: var(--spacing-small);
      font-size: 24px;
    }
  }
}
.example-navbar-end {
  display: flex;
  align-items: center;
  gap: var(--spacing-medium);
}
</style>