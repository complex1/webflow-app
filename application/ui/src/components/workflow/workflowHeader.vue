<template>
  <div class="workflow-header">
    <div class="workflow-title-container">
      <button 
        data-tooltip="Back to Dashboard" 
        data-tooltip-position="bottom" 
        class="btn btn-icon back-button"
        @click="goToDashboard"
      >
        <i class="pi pi-arrow-left"></i>
      </button>
      <div class="workflow-title" @click="editWorkflowName">
        <input
          v-if="isEditing"
          v-model="_workflowName"
          @blur="saveWorkflowName"
          @keyup.enter="saveWorkflowName"
          @keyup.esc="isEditing = false"
          placeholder="Enter workflow name"
          :class="{ 'input-error': _workflowName.length < 3 }"
          :style="{ width: _workflowName.length * 10 + 'px' }"
          ref="workflowNameInput"
        />
        <span v-else>{{ workflowName }}</span>
      </div>
    </div>
    <div class="workflow-actions">
      <theme-toggle></theme-toggle>
      <button
        data-tooltip="Run Pipeline"
        data-tooltip-position="bottom"
        class="btn btn-icon"
        @click="playWorkflow"
      >
        <i class="pi pi-play"></i>
      </button>
      <button
        data-tooltip="Export Workflow"
        data-tooltip-position="bottom"
        class="btn btn-icon"
        @click="exportWorkflow"
      >
        <i class="pi pi-download"></i>
      </button>
      <button
        data-tooltip="Save Workflow"
        data-tooltip-position="bottom"
        class="btn btn-icon"
        @click="saveWorkflow"
      >
        <i class="pi pi-save"></i>
      </button>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapState } from "vuex";
import themeToggle from '../common/themeToggle.vue';
import { WebflowService } from '../../services/webflow.service';
export default {
  components: { themeToggle },
  name: "workflowHeaderComponent",
  data() {
    return {
      isEditing: false,
      _workflowName: this.workflowName, // Local variable to bind with input box
    };
  },
  computed: {
    ...mapState({
      workflowName: (state) => state.workflowModule.workflowName,
      workflowDescription: (state) => state.workflowModule.workflowDescription,
      workflowId: (state) => state.workflowModule.workflowId,
    }),
  },
  methods: {
    ...mapMutations({
      setWorkflowName: "workflowModule/setWorkflowName",
      setWorkflowDescription: "workflowModule/setWorkflowDescription",
      setWorkflowId: "workflowModule/setWorkflowId",
    }),
    editWorkflowName() {
      this.isEditing = true;
      this._workflowName = this.workflowName; // Set the local variable to the current workflow name
      this.$nextTick(() => {
        this.$refs.workflowNameInput.focus(); // Focus the input field
      });
    },
    saveWorkflowName() {
      if (this._workflowName.length < 3) {
        this.$refs.workflowNameInput.classList.add("input-error");
        return;
      }
      this.isEditing = false;
      this.setWorkflowName(this._workflowName);
      this._workflowName = this.workflowName;
    },
    playWorkflow() {
      console.log("Play workflow");
    },
    exportWorkflow() {
      console.log("Export workflow");
    },
    async saveWorkflow() {
      try {
        const webflowService = new WebflowService();
        const workflow = this.$store.state.workflowModule.workflow;
        
        // Convert workflow to serializable format if needed
        const workflowData = {
          nodes: Array.from(workflow.nodes.entries()).map(([id, node]) => ({
            id,
            type: node.type,
            data: node.nodeData
          })),
          edges: workflow.edges.map(edge => ({
            id: edge.id,
            from: edge.from,
            to: edge.to,
            type: edge.type
          }))
        };
        
        if (this.workflowId && this.workflowId !== "111") { // Default ID is "111"
          // Update existing webflow
          await webflowService.updateWebflow(this.workflowId, {
            name: this.workflowName,
            description: this.workflowDescription,
            data: workflowData
          });
        } else {
          // Create new webflow
          const newWebflow = await webflowService.createWebflow({
            name: this.workflowName,
            description: this.workflowDescription,
            data: workflowData,
            tags: ['workflow']
          });
          
          // Update workflow ID in store
          if (newWebflow && newWebflow.id) {
            this.setWorkflowId(newWebflow.id);
          }
        }
        
        // Show success message or notification
        alert('Workflow saved successfully!');
      } catch (error) {
        console.error('Error saving workflow:', error);
        alert('Error saving workflow. Please try again.');
      }
    },
    goToDashboard() {
      this.$router.push('/dashboard');
    }
  },
};
</script>
<style lang='scss' scoped>
.workflow-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 var(--spacing-large);
  background-color: var(--color-white);
  border-bottom: 1px solid var(--color-border);
}

.workflow-title-container {
  display: flex;
  align-items: center;
  flex: 1;
}

.back-button {
  margin-right: var(--spacing-medium);
}

.workflow-title {
  color: var(--color-black);
  font-size: var(--font-size-large);
  font-weight: bold;
  cursor: pointer;
}

.workflow-title input {
  font-size: var(--font-size-large);
  color: var(--color-black); // Change color to var(--color-black)
  font-weight: bold;
  width: 100%;
  max-width: 300px;
  border: none;
  outline: none;
  background: transparent;
  &:focus {
    border-bottom: 1px solid var(--color-black); // Change focus border color to var(--color-black)
  }
  &.input-error {
    border-bottom: 1px solid var(--color-danger);
  }
}
.workflow-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-medium);
}
</style>
