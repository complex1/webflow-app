<template>
  <Inline gap="xs" align="center" fullWidth class="http-url">
    <span class="http-url__method" :style="{ backgroundColor: methodChip }">
      {{ props.node.method.toUpperCase() }}
    </span>
    <TruncateText class="http-url__url" :title="`${baseUrl}/${ url }`">
        {{ url }}
    </TruncateText>
  </Inline>
</template>
<script setup lang="ts">
import type HttpNode from "@/apifluxCore/classes/httpNode";
import Inline from "@/components/common/foundation/Inline.vue";
import { computed } from "vue";
const props = defineProps<{
  node: HttpNode;
}>();
const methodChip = computed(() => {
  const method = props.node.method.toUpperCase();
  const methodColors: Record<string, string> = {
    GET: "var(--http-get-color)",
    POST: "var(--http-post-color)",
    PUT: "var(--http-put-color)",
    DELETE: "var(--http-delete-color)",
    PATCH: "var(--http-patch-color)",
    HEAD: "var(--http-head-color)",
    OPTIONS: "var(--http-options-color)",
  };
  return methodColors[method] || "var(--http-default-color)";
});
const url = computed(() => {
    const url = props.node.url;
    if (url.fromEnv) {
      return `\${${url.envVarName}}`;
    }
    return url.defaultValue;
});
const baseUrl = computed(() => {
    const url = props.node.baseUrl;
    if (url.fromEnv) {
      return `\${${url.envVarName}}`;
    }
    return url.defaultValue;
});
</script>
<style scoped>
.http-url {
  padding: var(--space-1);
  background-color: rgba(0, 0, 0, 0.1);
}
.http-url__method {
  color: var(--color-on-primary);
  font-size: var(--text-xs);
  font-weight: var(--font-weight-semibold);
  padding: 0 var(--space-2);
  border-radius: var(--radius-xs);
  text-transform: uppercase;
}
.http-url__url {
  flex-grow: 1;
  padding: 0 var(--space-1);
  font-size: var(--text-sm);
  border-radius: var(--radius-xs);
  font-family: var(--font-mono);
  color: var(--text-primary);
  background: var(--bg-soft);

}
.http-url__url:hover {
  text-decoration: underline;
  cursor: pointer;
}
</style>