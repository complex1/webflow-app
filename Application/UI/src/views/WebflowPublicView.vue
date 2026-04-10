<template>
  <div class="webflow-public">
    <header class="webflow-public__header">
      <Inline gap="md" align="center" wrap>
        <router-link to="/" class="webflow-public__link">← Home</router-link>
        <Heading :level="3" class="webflow-public__title">{{ title }}</Heading>
        <Badge variant="info">Public · read-only</Badge>
      </Inline>
      <Text variant="sm" tone="muted" as="p" class="webflow-public__intro">
        Shared API flow for documentation. Sign in to edit or run flows in the full editor.
        <router-link class="webflow-public__link" to="/login">Sign in →</router-link>
      </Text>
    </header>

    <div v-if="loadError" class="webflow-public__error">
      <Text tone="muted">{{ loadError }}</Text>
    </div>
    <div v-else-if="loading" class="webflow-public__loading">
      <Text tone="muted">Loading flow…</Text>
    </div>
    <div v-else class="webflow-public__body">
      <div class="webflow-public__canvas-wrap">
        <WebflowEditorCanvas
          :apifluxComposable="apifluxComposable"
          :read-only="true"
          @edit="() => {}"
          @delete="() => {}"
          @view="openNodeDetail"
        />
      </div>
    </div>

    <WebflowNodeDetailDrawer
      :open="detailNodeId != null"
      :node="detailNode"
      :webflow-id="publicWebflowId"
      :run-id="null"
      :variable-pool="apifluxComposable.globalVariableStore.value"
      :env-variable-map="apifluxComposable.envVariableMap.value"
      @close="closeNodeDetail"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import WebflowEditorCanvas from "@/components/webflowEditor/WebflowEditorCanvas.vue";
import WebflowNodeDetailDrawer from "@/components/webflowEditor/WebflowNodeDetailDrawer.vue";
import Heading from "@/components/common/typography/Heading.vue";
import Text from "@/components/common/typography/Text.vue";
import Badge from "@/components/common/feedback/Badge.vue";
import Inline from "@/components/common/foundation/Inline.vue";
import useApiFlux from "@/apifluxCore/composable";
import { webFlowService } from "@/services/webflow";

const route = useRoute();
const router = useRouter();
const apifluxComposable = useApiFlux();

const loading = ref(true);
const loadError = ref<string | null>(null);
const publicWebflowId = ref(0);
const title = ref("Shared Webflow");
const detailNodeId = ref<string | null>(null);

const token = computed(() => String(route.params.token || "").trim());

const detailNode = computed(() => {
  const id = detailNodeId.value;
  if (!id) return null;
  return apifluxComposable.nodeMap.value[id] ?? null;
});

function parseNodeIdFromRoute(): string | null {
  const raw = route.query.nodeId;
  const s = Array.isArray(raw) ? raw[0] : raw;
  if (s == null || s === "") return null;
  return String(s);
}

function openNodeDetail(id: string) {
  detailNodeId.value = id;
  void router.replace({
    path: route.path,
    query: { ...route.query, nodeId: id },
  });
}

function closeNodeDetail() {
  detailNodeId.value = null;
  const q = { ...route.query } as Record<string, string | string[]>;
  delete q.nodeId;
  void router.replace({ path: route.path, query: q });
}

async function load() {
  const t = token.value;
  if (!t) {
    loadError.value = "Invalid share link.";
    loading.value = false;
    return;
  }
  loading.value = true;
  loadError.value = null;
  apifluxComposable.reset();
  try {
    const data = await webFlowService.getPublicShareByToken(t);
    publicWebflowId.value = data.webFlow.id;
    title.value = data.webFlow.name || "Shared Webflow";
    apifluxComposable.deserializedWebflow({
      nodes: data.config.nodes,
      edges: data.config.edges,
    });
    const fromQuery = parseNodeIdFromRoute();
    if (fromQuery && apifluxComposable.nodeMap.value[fromQuery]) {
      detailNodeId.value = fromQuery;
    }
  } catch {
    loadError.value = "This shared flow is unavailable or the link is invalid.";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void load();
});

watch(
  () => route.params.token,
  () => {
    void load();
  }
);

watch(
  () => route.query.nodeId,
  (raw) => {
    const s = Array.isArray(raw) ? raw[0] : raw;
    if (s == null || s === "") {
      detailNodeId.value = null;
      return;
    }
    const id = String(s);
    if (apifluxComposable.nodeMap.value[id]) {
      detailNodeId.value = id;
    }
  }
);
</script>

<style scoped>
/* Root needs a definite height so flex children and Vue Flow’s 100% height resolve correctly. */
.webflow-public {
  height: 100vh;
  min-height: 100vh;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: var(--space-4);
  box-sizing: border-box;
  background: var(--bg-base, #0f1419);
  overflow: hidden;
}

.webflow-public__header {
  margin-bottom: var(--space-4);
}

.webflow-public__title {
  margin: 0;
}

.webflow-public__intro {
  margin: var(--space-2) 0 0;
  max-width: 720px;
}

.webflow-public__link {
  color: var(--accent-blue);
  text-decoration: none;
}

.webflow-public__link:hover {
  text-decoration: underline;
}

.webflow-public__error,
.webflow-public__loading {
  padding: var(--space-6);
}

.webflow-public__body {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.webflow-public__canvas-wrap {
  flex: 1;
  min-height: 0;
  width: 100%;
  position: relative;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.webflow-public__canvas-wrap :deep(.webflow-editor-canvas) {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
</style>
