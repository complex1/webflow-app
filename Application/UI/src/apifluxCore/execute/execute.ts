import type { Edge, Node as VueFlowNode } from "@vue-flow/core";
import {
  NodeStatus,
  type envVariableMap,
  type ExecutionEmitter,
  type VariablePool,
  type WebflowNode,
} from "../types";
import {
  getAllNextNodeIds,
  getDataFlowTargetVariableIds,
  getStartingNodeIds,
} from "./nodeGraph";

const dataEmitter: ExecutionEmitter = (
  nodeId: string,
  path: string,
  value: any
) => {
  if (import.meta.env.DEV) {
    console.log(`Node ${nodeId} emitted data at ${path}:`, value);
  }
};

/**
 * Writes a node's execution result into the variable pool: primary `nodeData` id,
 * then every input variable id connected via data-flow edges from this node's output.
 */
function propagateOutputToVariablePool(
  node: WebflowNode,
  result: unknown,
  dataFlowEdges: Edge[],
  setGlobalVariableStoreVariables: (id: string, value: unknown) => void
): void {
  const outputVarId = node.nodeData?.id;
  if (!outputVarId) return;

  setGlobalVariableStoreVariables(outputVarId, result);

  const wiredTargets = getDataFlowTargetVariableIds(
    node.id,
    outputVarId,
    dataFlowEdges
  );
  for (const varId of wiredTargets) {
    setGlobalVariableStoreVariables(varId, result);
  }
}

export const executeWebflow = async (
  nodes: VueFlowNode[],
  edges: Edge[],
  nodeMap: { [key: string]: WebflowNode },
  variablePool: VariablePool,
  envVariableMap: envVariableMap,
  setGlobalVariableStoreVariables: (id: string, value: any) => void
) => {
  const flowControlEdges = edges.filter(
    (edge) =>
      edge.sourceHandle === edge.source && edge.targetHandle === edge.target
  );
  const dataFlowEdges = edges.filter(
    (edge) => !(edge.sourceHandle === edge.source)
  );
  let nodeIds = getStartingNodeIds(flowControlEdges, nodes);

  for (const nodeId of nodeIds) {
    const node = nodeMap[nodeId];
    if (node) {
      node.nodeStatus = NodeStatus.PENDING;
    }
  }

  while (nodeIds.length > 0) {
    const validNodes: WebflowNode[] = nodeIds
      .map((id) => nodeMap[id])
      .filter((node) => node?.id) as WebflowNode[];
    try {
      const executionList = validNodes.map((node: WebflowNode) =>
        node.execute(variablePool, envVariableMap, dataEmitter)
      );

      const results = await Promise.all(executionList);

      results.forEach((result, index) => {
        const node = validNodes[index] as WebflowNode;
        propagateOutputToVariablePool(
          node,
          result,
          dataFlowEdges,
          setGlobalVariableStoreVariables
        );
      });
    } catch (error) {
      console.error(`Error executing node`, error);
      break;
    }
    nodeIds = nodeIds.reduce((acc: string[], id: string) => {
      const nextNodeIds = getAllNextNodeIds(id, flowControlEdges);
      for (const nextNodeId of nextNodeIds) {
        if (!acc.includes(nextNodeId)) {
          acc.push(nextNodeId);
        }
      }
      return acc;
    }, []);
  }
};
