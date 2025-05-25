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
      <user-avatar class="mx-m" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, nextTick, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { WebflowService } from '../../services/webflow.service';
import { getPostBody } from '../../utils/workflowUtils';
import type { WorkflowHeaderProps, WorkflowHeaderEmits } from './types';
import { success, error } from '../../lib/toast';
import UserAvatar from '../common/userAvatar.vue';
import { exportWorkflowService } from '../../services/importExport.service';

export default defineComponent({
  components: { UserAvatar },
  name: "WorkflowHeader",
  setup() {
    const store = useStore();
    const router = useRouter();
    const workflowNameInput = ref<HTMLInputElement | null>(null);
    
    const isEditing = ref<boolean>(false);
    const localWorkflowName = ref<string>('');
    
    const workflowName = computed(() => store.state.workflowModule.workflowName);
    const workflowDescription = computed(() => store.state.workflowModule.workflowDescription);
    const workflowId = computed(() => store.state.workflowModule.workflowId);
    
    // Initialize local name with store value
    watch(workflowName, (newName) => {
      localWorkflowName.value = newName;
    }, { immediate: true });
    
    const editWorkflowName = () => {
      isEditing.value = true;
      localWorkflowName.value = workflowName.value;
      
      nextTick(() => {
        if (workflowNameInput.value) {
          workflowNameInput.value.focus();
        }
      });
    };
    
    const saveWorkflowName = () => {
      if (localWorkflowName.value.length < 3) {
        if (workflowNameInput.value) {
          workflowNameInput.value.classList.add('input-error');
        }
        return;
      }
      
      isEditing.value = false;
      store.commit('workflowModule/setWorkflowName', localWorkflowName.value);
    };
    
    const playWorkflow = () => {
      console.log("Play workflow");
      store.commit('workflowModule/executeWorkflow');
    };
    
    const exportWorkflow = () => {
      exportWorkflowService(workflowId.value);
    };
    
    const saveWorkflow = async () => {
      try {
        const webflowService = new WebflowService();
        const workflow = store.state.workflowModule;
        
        // Convert workflow to serializable format
        const workflowData = getPostBody(workflow);

        if (workflowId.value) {
          // Update existing webflow
          await webflowService.updateWebflow(workflowId.value, {
            name: workflowName.value,
            description: workflowDescription.value,
            data: workflowData
          });
        } else {
          // Create new webflow
          const newWebflow = await webflowService.createWebflow({
            name: workflowName.value,
            description: workflowDescription.value,
            data: workflowData,
            tags: ['workflow']
          }) as { id?: string };

          // Update workflow ID in store
          if (newWebflow && newWebflow.id) {
            store.commit('workflowModule/setWorkflowId', newWebflow.id);
          }
        }
        
        // Show success message
        success('Workflow saved successfully!');
      } catch (e) {
        console.error('Error saving workflow:', e);
        error('Error saving workflow. Please try again.');
      }
    };
    
    const goToDashboard = () => {
      router.push('/dashboard');
    };
    
    return {
      workflowName,
      workflowId,
      isEditing,
      _workflowName: localWorkflowName,
      workflowNameInput,
      editWorkflowName,
      saveWorkflowName,
      playWorkflow,
      exportWorkflow,
      saveWorkflow,
      goToDashboard
    };
  },
});
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
