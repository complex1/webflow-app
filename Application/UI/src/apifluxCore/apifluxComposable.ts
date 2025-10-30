import { computed, ref, type Ref } from "vue";
import type { VariablePool, WebflowNode } from "./types";
import type { Connection, Edge, Node, NodeDragEvent } from "@vue-flow/core";
import { updateNodeByDeepCopying } from "./utils/clone";
import { executeWebflow } from "./execute/execute";
import { apiConfigToNode, deserialize, getNextNodePosition, serialized } from "./apifluxExtension";
import type { ExtractedAPI } from "@/types";

interface UseApiFluxReturn {
  hasUnsavedChanges: Ref<boolean>;
  nodes: Ref<Node[]>;
  edges: Ref<Edge[]>;
  nodeMap: Ref<{ [key: string]: WebflowNode }>;
  variablePool: Ref<VariablePool>;
  envVariableMap: Ref<Record<string, string>>;
  envVariablesNames: Ref<string[]>;
  addNode: (node: WebflowNode) => void;
  addNodeFromConfig: (apiConfig: ExtractedAPI[]) => void;
  addEdge: (edge: Connection) => void;
  setPosition: (event: NodeDragEvent) => void;
  deleteNode: (nodeId: string) => void;
  deleteEdge: (edgeId: string) => void;
  setEnvironmentVariableMap: (map: Record<string, string>) => void;
  play: () => void;
  getSerializedData: () => any;
  setWebflowData: (data: any) => void;
}

const useApiFlux = (): UseApiFluxReturn => {
  const hasUnsavedChanges = ref(false);
  const nodeMap = ref({} as { [key: string]: WebflowNode });
  const nodes = ref([] as Node[]);
  const edges = ref([] as Edge[]);
  const variablePool = ref({} as VariablePool);
  const envVariableMap = ref({} as Record<string, string>);
  // const envVariablesNames = ref([] as string[]);

  const addNode = (node: WebflowNode) => {
    if (!nodeMap.value[node.id]) {
      nodeMap.value[node.id] = node;
      const position = getNextNodePosition(nodes.value);
      nodes.value.push({
        id: node.id,
        position: position,
        type: node.type,
        data: { label: node.name || "Unnamed Node", id: node.id },
      });
    } else {
      const nodePosition = nodes.value.find((n) => n.id === node.id)?.position;
      nodeMap.value[node.id]?.setPosition(nodePosition || { x: 0, y: 0 });
      nodeMap.value[node.id] = updateNodeByDeepCopying(node, nodeMap.value[node.id] as WebflowNode);
    }
    hasUnsavedChanges.value = true;
  };

  const addNodeFromConfig = (apiConfig: ExtractedAPI[]) => {
    const apis = apiConfigToNode(apiConfig);
    apis.forEach((api) => addNode(api));
  }

  const addEdge = (edge: Connection) => {
    const exists = edges.value.some(
      (e) =>
        e.source === edge.source &&
        e.target === edge.target &&
        e.sourceHandle === edge.sourceHandle &&
        e.targetHandle === edge.targetHandle
    );
    if (exists || (edge.source === edge.target)) return;
    if (!edge.source || !edge.target) return;
    const _edge: Edge = {
      id: `e-${edge.source}-${edge.target}-${edge.sourceHandle || "default"}-${edge.targetHandle || "default"
        }`,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle || undefined,
      targetHandle: edge.targetHandle || undefined,
      animated: edge.sourceHandle === edge.source ? false : true,
      style: { stroke: "#888" },
    };
    if (edge.sourceHandle) _edge.sourceHandle = edge.sourceHandle;
    if (edge.targetHandle) _edge.targetHandle = edge.targetHandle;
    edges.value.push(_edge);
    hasUnsavedChanges.value = true;
  };

  const setPosition = (event: NodeDragEvent) => {
    const node = nodes.value.find((n) => n.id === event.node.id);
    if (node) {
      node.position = event.node.position;
      nodeMap.value[node.id]?.setPosition(event.node.position);
      hasUnsavedChanges.value = true;
    }
  };

  const deleteNode = (nodeId: string) => {
    nodes.value = nodes.value.filter((n) => n.id !== nodeId);
    edges.value = edges.value.filter(
      (e) => e.source !== nodeId && e.target !== nodeId
    );
    delete nodeMap.value[nodeId];
    hasUnsavedChanges.value = true;
  };

  const deleteEdge = (edgeId: string) => {
    edges.value = edges.value.filter((e) => e.id !== edgeId);
    hasUnsavedChanges.value = true;
  };

  const setEnvironmentVariableMap = (map: Record<string, string>) => {
    envVariableMap.value = Object.assign({}, map);
  };

  const getSerializedData = () => {
    return serialized(nodes.value, edges.value, nodeMap.value);
  }

  const setWebflowData = (data: any) => {
    const { nodes: deserializedNodes, edges: deserializedEdges, nodeMap: deserializedNodeMap } = deserialize(data);
    nodes.value = deserializedNodes;
    edges.value = deserializedEdges;
    nodeMap.value = deserializedNodeMap;
    hasUnsavedChanges.value = false;
  }

  const envVariablesNames = computed(() => {
    return Array.from(Object.keys(envVariableMap.value));
  });

  const play = () => {
    executeWebflow(
      nodes.value,
      edges.value,
      nodeMap.value,
      variablePool.value,
      envVariableMap.value
    )
  };

  return {
    hasUnsavedChanges,
    nodes: nodes,
    edges: edges,
    nodeMap: nodeMap,
    variablePool: variablePool,
    envVariableMap: envVariableMap,
    envVariablesNames: envVariablesNames,
    addNode,
    addNodeFromConfig,
    addEdge,
    setPosition,
    deleteNode,
    deleteEdge,
    setEnvironmentVariableMap,
    play,
    getSerializedData,
    setWebflowData,
  };
};
export default useApiFlux;
