import type { Connection, Edge, Node, NodeDragEvent } from "@vue-flow/core";
import { ref, type Ref } from "vue";
import type { envVariableMap, VariablePool, WebflowNode } from "../types";
import { executeWebflow } from "../execute/execute";
import type { EnvConfig } from "@/services/environment";
import { deserialize, getNextNodePosition, serialized } from "./apifluxExtension";

export interface UseApiFluxReturn {
  hasUnsavedChanges: Ref<boolean>;
  nodes: Ref<Node[]>;
  edges: Ref<Edge[]>;
  nodeMap: Ref<{ [key: string]: WebflowNode }>;
  globalVariableStore: Ref<VariablePool>;
  envVariableMap: Ref<envVariableMap>;

  // Methods
  addNode: (node: WebflowNode) => void;
  addEdge: (edge: Connection) => void;
  setPosition: (event: NodeDragEvent) => void;
  deleteNode: (nodeId: string) => void;
  deleteEdge: (edgeId: string) => void;
  runPipeline: () => Promise<void>;
  setLinkedEnvFile: (config: EnvConfig[]) => void;
  serializedWebflow: () => any;
  deserializedWebflow: (data: any) => void;
  reset: () => void;
  /** Apply variable pool from a server execution so output/input eye viewers resolve values. */
  applyServerVariablePool: (pool: VariablePool | Record<string, unknown> | null | undefined) => void;
  /** Call after persisting config to clear unsaved flag. */
  markSaved: () => void;
}

const useApiFlux = (): UseApiFluxReturn => {
  const hasUnsavedChanges = ref(false);
  const nodeMap = ref({} as { [key: string]: WebflowNode });
  const nodes = ref([] as Node[]);
  const edges = ref([] as Edge[]);
  const globalVariableStore = ref({} as VariablePool);
  const envVariableMap = ref({} as envVariableMap);

  const addNode = (node: WebflowNode) => {
    if (!nodeMap.value[node.id]) {
      nodeMap.value[node.id] = node;
      nodes.value.push({
        id: node.id,
        position: getNextNodePosition(nodes.value),
        type: node.getType(),
        data: { label: node.name || "Unnamed Node", id: node.id },
      });
    } else {
      const nodePosition = nodes.value.find((n) => n.id === node.id)?.position;
      nodeMap.value[node.id]?.setPosition(nodePosition || { x: 0, y: 0 });
      nodeMap.value[node.id] = node;
    }
    if (import.meta.env.DEV) {
      console.log("Added node:", node);
    }
    hasUnsavedChanges.value = true;
  };

  const addEdge = (edge: Connection) => {
    const exists = edges.value.some(
      (e) =>
        e.source === edge.source &&
        e.target === edge.target &&
        e.sourceHandle === edge.sourceHandle &&
        e.targetHandle === edge.targetHandle
    );
    if (exists || edge.source === edge.target) return;
    if (!edge.source || !edge.target) return;
    const _edge: Edge = {
      id: `e-${edge.source}-${edge.target}-${edge.sourceHandle || "default"}-${
        edge.targetHandle || "default"
      }`,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle || undefined,
      targetHandle: edge.targetHandle || undefined,
      animated: edge.sourceHandle === edge.source ? false : true,
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

  const serializedWebflow = () => {
    return serialized(nodes.value, edges.value, nodeMap.value);
  };

  const deserializedWebflow = (data: any) => {
    const res = deserialize(data);
    nodes.value = res.nodes;
    edges.value = res.edges;
    nodeMap.value = res.nodeMap;
    hasUnsavedChanges.value = false;
  };

  const markSaved = () => {
    hasUnsavedChanges.value = false;
  };

  const setGlobalVariableStoreVariables = (id: string, value: any) => {
    globalVariableStore.value[id] = value;
  };

  const applyServerVariablePool = (
    pool: VariablePool | Record<string, unknown> | null | undefined
  ) => {
    if (pool && typeof pool === "object" && !Array.isArray(pool)) {
      globalVariableStore.value = { ...pool } as VariablePool;
    } else {
      globalVariableStore.value = {} as VariablePool;
    }
  };

  const runPipeline = async () => {
    globalVariableStore.value = {} as VariablePool;
    await executeWebflow(
      nodes.value,
      edges.value,
      nodeMap.value,
      globalVariableStore.value,
      envVariableMap.value,
      setGlobalVariableStoreVariables
    );
  };

  const setLinkedEnvFile = (config: EnvConfig[]) => {
    envVariableMap.value = {} as envVariableMap;
    config.forEach((envConfig) => {
      envVariableMap.value[envConfig.key] = envConfig.value;
    });

  };

  const reset = () => {
    hasUnsavedChanges.value = false;
    nodeMap.value = {};
    nodes.value = [];
    edges.value = [];
  };

  return {
    hasUnsavedChanges,
    nodes,
    edges,
    nodeMap,
    globalVariableStore,
    envVariableMap,

    addNode,
    addEdge,
    setPosition,
    deleteNode,
    deleteEdge,
    runPipeline,
    setLinkedEnvFile,
    serializedWebflow,
    deserializedWebflow,
    reset,
    applyServerVariablePool,
    markSaved,
  };
};

export default useApiFlux;