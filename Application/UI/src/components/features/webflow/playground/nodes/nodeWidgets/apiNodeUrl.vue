<template>
  <div class="api-url-section-compact">
    <div class="method-chip-compact" :style="{ 
      borderColor: getApiMethod.color, 
      color: getApiMethod.color,
      backgroundColor: getApiMethod.bgColor 
    }">
      <i :class="getApiMethod.icon"></i>
      <span>{{ getApiMethod.method }}</span>
    </div>
    <div class="url-display-compact" v-tooltip="getFullUrl">
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
        color: "var(--color-success)",
        bgColor: "var(--color-success-light)",
        icon: "fas fa-download",
      };
    case "POST":
      return {
        method: "POST",
        color: "var(--color-primary)",
        bgColor: "var(--color-primary-light)",
        icon: "fas fa-plus",
      };
    case "PUT":
      return {
        method: "PUT",
        color: "var(--color-warning)",
        bgColor: "var(--color-warning-light)",
        icon: "fas fa-edit",
      };
    case "DELETE":
      return {
        method: "DEL",
        color: "var(--color-danger)",
        bgColor: "var(--color-danger-light)",
        icon: "fas fa-trash",
      };
    case "PATCH":
      return {
        method: "PATCH",
        color: "var(--color-info)",
        bgColor: "var(--color-info-light)",
        icon: "fas fa-wrench",
      };
    default:
      return {
        method: "???",
        color: "var(--color-text-secondary)",
        bgColor: "var(--color-background-secondary)",
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
/* Compact API URL Section Styling */
.api-url-section-compact {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs);
  background: var(--color-background-subtle);
  border-radius: var(--radius-sm);
  min-height: 32px;
}

/* Compact Method Chip */
.method-chip-compact {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 2px var(--spacing-xs);
  border-radius: var(--radius-xs);
  font-size: 10px;
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.02em;
  border: 1px solid;
  min-width: 44px;
  justify-content: center;
  flex-shrink: 0;
}

.method-chip-compact i {
  font-size: 8px;
  width: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.method-chip-compact span {
  line-height: 1;
}

/* Compact URL Display */
.url-display-compact {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.url-display-compact:hover {
  color: var(--color-primary);
  text-decoration: underline;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .api-url-section-compact {
    padding: 2px var(--spacing-xs);
    gap: 2px;
    min-height: 28px;
  }
  
  .method-chip-compact {
    padding: 1px 2px;
    min-width: 36px;
    font-size: 9px;
  }
  
  .method-chip-compact i {
    font-size: 7px;
    width: 8px;
  }
  
  .url-display-compact {
    font-size: 10px;
    padding: 2px var(--spacing-xs);
    min-height: 20px;
  }
}
</style>