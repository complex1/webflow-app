<template>
  <div class="workflow-header">
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
    saveWorkflow() {
      console.log("Save workflow");
    },
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

.workflow-title {
  flex: 1;
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
