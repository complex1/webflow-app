import type { Edge, Node } from "@vue-flow/core";
import { NodeType, type WebflowNode } from "./types";
import { ApiNode } from "./nodes/apiNode";
import FunctionalNode from "./nodes/functionalNode";

export const serialized = (nodes: Node[], edges: Edge[], nodeMap: { [key: string]: WebflowNode }) => {
  const _nodes = nodes.map((node) => ({
    ...node,
    config: nodeMap[node.id]?.serialized() || {},
  }));
  const _edges = edges.map((edge) => ({ ...edge }));
  const data = {
    nodes: _nodes,
    edges: _edges
  };
  return data;
}

const nodeToConfig = (nodeData: any) => {
  const config = nodeData.config || {};
  if (nodeData.type === NodeType.API) {
    const apiNode = new ApiNode(nodeData.id);
    apiNode.deserialized(config);
    return apiNode;
  }
  if (nodeData.type === NodeType.FUNCTIONAL) {
    // Add FunctionalNode deserialization when implemented
    const functionalNode = new FunctionalNode({ id: nodeData.id });
    functionalNode.deserialized(config);
    return functionalNode;
  }
  return null;
}


export const deserialize = (data: any): { nodes: Node[]; edges: Edge[]; nodeMap: { [key: string]: WebflowNode } } => {
  const nodeMap: { [key: string]: WebflowNode } = {};
  const nodes: Node[] = [];
  data.nodes.forEach((nodeData: any) => {
    const node = nodeToConfig(nodeData);
    if (node) {
      nodeMap[nodeData.id] = node;
      nodes.push({
        id: nodeData.id,
        position: nodeData.position,
        type: nodeData.type,
        data: nodeData.data,
      });
    }
  });
  const edges: Edge[] = data.edges;
  return { nodes, edges, nodeMap };
}
