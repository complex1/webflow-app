import FunctionalNode from "../classes/FunctionalNode";
import HttpNode from "../classes/HttpNode";
import { NodeType } from "../classes/Node";
import type { WorkflowState } from "../store/workflowModule";

export const getPostBody = (workflowState: WorkflowState) => {
  const { viewNodes, viewEdges, workflow } = workflowState;
  const postBody = {} as any;
  postBody.edges = viewEdges;
  postBody.nodes = [] as any[];

  viewNodes.forEach((node) => {
    const nodeData = workflow.nodes.get(node.id);
    if (nodeData) {
      try {
        const serializedData = nodeData.serialized();
        postBody.nodes.push({
          id: node.id,
          type: node.type,
          position: node.position,
          data: serializedData,
        });
      } catch (error) {
        console.error(`Error serializing node ${node.id}:`, error);
      }
    }
  });

  return postBody;
};

export const getResponseToNodeList = (
  data: any
): {
  node: FunctionalNode | HttpNode;
  position: { x: number; y: number };
}[] => {
  const { nodes } = data;
  if (nodes) {
    return nodes.map((node: any) => {
      const type = node.type;
      const _node =
        type === NodeType.HTTP ? new HttpNode() : new FunctionalNode();
      _node.deserialized(node.data);
      return {
        position: node.position ? node.position : { x: 0, y: 0 },
        node: _node,
      };
    });
  }
  return [];
};
