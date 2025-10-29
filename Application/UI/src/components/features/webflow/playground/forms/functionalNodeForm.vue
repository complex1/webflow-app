<template>
  <div class="functional-node-form">
    <!-- Form Header -->
    <div class="form-header">
      <div class="header-content">
        <div class="header-icon">
          <i class="fas fa-code"></i>
        </div>
        <div class="header-info">
          <h3 class="form-title">Functional Node Configuration</h3>
          <p class="form-subtitle">Configure data transformation logic and function parameters</p>
        </div>
      </div>
      <div class="header-badge">
        <span class="node-type-badge functional-node">
          <i class="fas fa-cogs"></i>
          <span>Transform Node</span>
        </span>
      </div>
    </div>

    <!-- Form Content -->
    <div class="form-content">
      <WidgetMeta
        :name="localFnNode.name"
        :description="localFnNode.description"
        @onUpdate="updateMeta"
      ></WidgetMeta>
  <UiExpansionPanel
    title="Parameters"
    :showAddButton="true"
    @add="addHeader"
    :count="localFnNode.parameters.length"
  >
    <div>
      <div class="no-data-found" v-if="localFnNode.parameters.length === 0">
        No parameters found
      </div>
      <div v-for="(param, index) in localFnNode.parameters" :key="param.id">
        <VariableForm
          :variable="param"
          :showDescription="true"
          :showType="true"
          :envVariablesNames="props.envVariablesNames"
          :canRemove="true"
          @onUpdate="onParamUpdate($event, index)"
          @onRemove="onRemoveParam(index)"
        ></VariableForm>
        <hr v-if="index < localFnNode.parameters.length - 1" class="my-md" />
      </div>
    </div>
  </UiExpansionPanel>
  <UiExpansionPanel title="Function" :showAddButton="false" :count="0">
    <div class="form-group">
      <label class="form-label" for="function-textarea">Transform Function</label>
      <UiCodeMirrorEditor
        v-model="localFnNode.transform"
      />
      <p class="form-help-text">
        Define a JavaScript function named <code>transform</code> that takes
        <code>params</code> as input and returns the transformed data.
      </p>
    </div>
  </UiExpansionPanel>
  <div class="flex justify-end gap-sm">
    <UiButton variant="secondary" @click="cancel">Cancel</UiButton>
    <UiButton variant="primary" @click="save"> Save </UiButton>
  </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import FunctionalNode from "@/apifluxCore/nodes/functionalNode";
import Variable from "@/apifluxCore/nodes/variable";
import { cloneFunctionalNode } from "@/apifluxCore/utils/clone";
import { defineProps, onMounted, ref } from "vue";
import WidgetMeta from "./formWidgets/widgetMeta.vue";
import VariableForm from "./formWidgets/variableForm.vue";
import { UiExpansionPanel, UiButton, UiCodeMirrorEditor } from "@/components/base";

const props = defineProps({
  fnNode: {
    type: Object as () => FunctionalNode,
  },
  envVariablesNames: {
    type: Array as () => string[],
    default: () => [],
  },
});

const emit = defineEmits<{
  (e: "onSave", updatedNode: FunctionalNode): void;
  (e: "onCancel"): void;
}>();

const localFnNode = ref<FunctionalNode>(
  new FunctionalNode({
    id: props.fnNode?.id || "",
    parameters: props.fnNode?.parameters || [],
    transform: props.fnNode?.transform || "",
  })
);

const updateMeta = (value: {
  name: string | null;
  description: string | null;
  isValid: boolean;
}) => {
  localFnNode.value.name = value.name || "";
  localFnNode.value.description = value.description || "";
};

const addHeader = () => {
  localFnNode.value.parameters.push(
    new Variable({
      name: `param_${localFnNode.value.parameters.length + 1}`,
      type: "string",
    })
  );
  localFnNode.value.parameters = [...localFnNode.value.parameters];
};
const onParamUpdate = (updatedVar: Variable, index: number) => {
  if (localFnNode.value.parameters[index]) {
    localFnNode.value.parameters[index].setConfig(updatedVar);
  }
};
const onRemoveParam = (index: number) => {
  localFnNode.value.parameters.splice(index, 1);
  localFnNode.value.parameters = [...localFnNode.value.parameters];
};

const save = () => {
  emit("onSave", cloneFunctionalNode(localFnNode.value as FunctionalNode));
};
const cancel = () => {
  emit("onCancel");
};

onMounted(() => {
  if (props.fnNode) {
    localFnNode.value = cloneFunctionalNode(props.fnNode as FunctionalNode);
  }
});
</script>
<style scoped>
/* ===== Functional Node Form - Neo-Systemic Design ===== */
.functional-node-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  -webkit-backdrop-filter: var(--glass-backdrop);
  border-radius: var(--radius-xl);
}

/* ===== Form Header ===== */
.form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg) var(--spacing-xl);
  background: linear-gradient(135deg, var(--color-background) 0%, var(--color-background-subtle) 100%);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-subtle);
}

.header-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex: 1;
}

.header-icon {
  width: 48px;
  height: 48px;
  background: var(--color-functional-node-gradient);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: var(--font-size-lg);
  box-shadow: var(--shadow-md);
  flex-shrink: 0;
}

.header-info {
  flex: 1;
  min-width: 0;
}

.form-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs) 0;
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
}

.form-subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
  line-height: var(--line-height-normal);
}

.header-badge {
  flex-shrink: 0;
}

.node-type-badge {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  border: 1px solid;
  transition: all var(--transition-normal);
}

.node-type-badge.functional-node {
  background: var(--color-functional-node-light);
  color: var(--color-functional-node);
  border-color: var(--color-functional-node);
}

.node-type-badge i {
  font-size: var(--font-size-sm);
}

/* ===== Form Content ===== */
.form-content {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 0 var(--spacing-md);
}

/* ===== Existing Styles ===== */
.no-data-found {
  text-align: center;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  padding: var(--spacing-md) 0;
  background: var(--color-background-subtle);
  border-radius: var(--radius-md);
  border: 1px dashed var(--color-border);
}

/* ===== Form Actions ===== */
.form-content .flex.justify-end {
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border-subtle);
}

/* ===== Responsive Design ===== */
@media (max-width: 768px) {
  .functional-node-form {
    margin: var(--spacing-sm);
    padding: var(--spacing-lg);
  }
  
  .form-header {
    flex-direction: column;
    gap: var(--spacing-md);
    text-align: center;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .form-title {
    font-size: var(--font-size-lg);
  }
}
</style>