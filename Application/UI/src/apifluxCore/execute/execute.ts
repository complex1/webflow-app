import type { Edge, Node } from "@vue-flow/core";
import type { ExecutionEmitter, VariablePool, WebflowNode } from "../types";
import {
  getAllNextNodeIds,
  getAllTargetIds,
  getStartingNodeIds,
} from "./nodeGraph";

const dataEmitter: ExecutionEmitter = (
  nodeId: string,
  path: string,
  value: any
) => {
  // Implement your emitter logic here, or leave empty if not needed
  console.log(`Node ${nodeId} emitted data at ${path}:`, value);
};

export const executeWebflow = async (
  nodes: Node[],
  edges: Edge[],
  nodeMap: { [key: string]: WebflowNode },
  variablePool: VariablePool,
  envVariableMap: Record<string, string>
) => {
  const flowControlEdges = edges.filter(
    (edge) =>
      edge.sourceHandle === edge.source && edge.targetHandle === edge.target
  );
  const dataFlowEdges = edges.filter(
    (edge) => !(edge.sourceHandle === edge.source)
  );
  let nodeIds = getStartingNodeIds(flowControlEdges, nodes);

  for (let i = 0; i < nodeIds.length; i++) {
    const nodeId = nodeIds[i] as string;
    const node = nodeMap[nodeId];
    if (!node) {
      console.error(`Node with ID ${nodeId} not found in nodeMap.`);
      continue;
    }
    try {
      const data = await node.execute(
        variablePool,
        envVariableMap,
        dataEmitter
      );
      const resVarId = node.nodeData.id;
      if (resVarId) {
        variablePool[resVarId] = data;
      }
      const connectVariables = getAllTargetIds(resVarId, dataFlowEdges);
      connectVariables.forEach((varId) => {
        if (varId) {
          variablePool[varId] = data;
        }
      });
      const nextNodeIds = getAllNextNodeIds(nodeId, flowControlEdges);
      nodeIds.push(...nextNodeIds);
    } catch (error) {
      console.error(`Error executing node with ID ${nodeId}:`, error);
    }
  }
};
