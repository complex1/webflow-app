<template>
  <div class="node-header node-header--api">
    <div
      class="node-method-chip"
      style="background-color: transparent; border: 1px solid"
      :style="{ borderColor: getApiMethod.color, color: getApiMethod.color }"
    >
      <i :class="getApiMethod.icon" style="margin-right: 4px"></i>
      <span>{{ getApiMethod.method }}</span>
    </div>
    <div class="node-url" v-tooltip="getFullUrl">
      {{ data.url?.get(props.variablePool, props.envVariableMap) }}
    </div>
  </div>
</template>
<script setup lang="ts">
import type { ApiNode } from "@/apifluxCore/nodes/apiNode";
import type { VariablePool } from "@/apifluxCore/types";
import { computed } from "vue";

const props = defineProps<{
  data: ApiNode;
  variablePool: VariablePool;
  envVariableMap: Record<string, string>;
}>();

const getApiMethod = computed(() => {
  switch (props.data.method as string) {
    case "GET":
      return {
        method: "GET",
        color: "var(--color-get)",
        icon: "fas fa-arrow-down",
      };
    case "POST":
      return {
        method: "POST",
        color: "var(--color-post)",
        icon: "fas fa-arrow-up",
      };
    case "PUT":
      return {
        method: "PUT",
        color: "var(--color-put)",
        icon: "fas fa-sync",
      };
    case "DELETE":
      return {
        method: "DELETE",
        color: "var(--color-delete)",
        icon: "fas fa-trash",
      };
    default:
      return {
        method: "UNKNOWN",
        color: "var(--color-unknown)",
        icon: "fas fa-question",
      };
  }
});

const getFullUrl = computed(() => {
  const baseUrl = props.data.baseUrl?.get(props.variablePool, props.envVariableMap) || "";
  const path = props.data.url?.get(props.variablePool, props.envVariableMap) || "";
  return `${baseUrl}${path}`;
});
</script>
<style scoped>
.node-method-chip {
  font-size: var(--font-size-xs);
  display: flex;
  align-items: center;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  width: fit-content;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: var(--color-background-secondary);
}

.node-header {
  display: flex;
  border-bottom: 1px solid var(--color-border);
  padding: var(--spacing-md);
  gap: var(--spacing-md);
  align-items: center;
  background: var(--color-background-secondary);
}

.node-url {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  font-weight: 500;
  font-family: var(--font-mono);
  word-break: break-all;
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-background);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
}
</style>