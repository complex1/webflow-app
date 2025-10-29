import type { Edge, Node } from "@vue-flow/core";
import { NodeType, type WebflowNode } from "./types";
import { ApiNode } from "./nodes/apiNode";
import FunctionalNode from "./nodes/functionalNode";
import type { ExtractedAPI } from "@/types";
import { generateUUID } from "./utils/uuid";
import Variable from "./nodes/variable";

export const getNextNodePosition = (nodes: Node[]): { x: number; y: number } => {
  if (nodes.length === 0) {
    return { x: 0, y: 0 };
  }
  const maxX = Math.max(...nodes.map((n) => n.position.x)) || 0;
  const maxY = Math.max(...nodes.map((n) => n.position.y)) || 0;
  return { x: maxX + 300, y: maxY + 200 };
};

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


export const apiConfigToNode = (apiConfig: ExtractedAPI[]): WebflowNode[] => {
  const webflowNodes: WebflowNode[] = [];

  apiConfig.forEach((api) => {
    const uuid = generateUUID();
    const node = new ApiNode(uuid);
    node.name = api.name;
    node.description = api.description || '';
    node.url = new Variable({
      name: 'url',
      description: 'API Endpoint URL',
      defaultValue: api.url,
      type: 'string'
    });
    node.baseUrl = new Variable({
      name: 'baseUrl',
      description: 'Base URL',
      defaultValue: '',
      type: 'string'
    });
    node.method = api.method;
    node.headers = (api.header || []).map(header => new Variable({
      name: header.name,
      description: header.description || '',
      defaultValue: '',
      type: header.type
    }));
    node.queryParams = (api.queryParam || []).map(param => new Variable({
      name: param.name,
      description: param.description || '',
      defaultValue: '',
      type: param.type
    }));
    node.pathParams = (api.pathParam || []).map(param => new Variable({
      name: param.name,
      description: param.description || '',
      defaultValue: '',
      type: param.type
    }));
    node.body = new Variable({
      name: 'body',
      description: 'Request Body',
      defaultValue: api.body || null,
      type: 'object'
    });
    webflowNodes.push(node);
  });
  return webflowNodes;
}