import FunctionalNode from "../classes/FunctionalNode";
import HttpNode from "../classes/HttpNode";
import { Workflow } from "../classes/Workflow";
import type { IEdge, INode } from "../model";
export interface WorkflowState {
  workflow: Workflow;
  viewNodes: INode[];
  viewEdges: IEdge[];
  
}
export default {
  namespaced: true,
  state: {
    workflow: new Workflow(),
    viewNodes: [] as INode[], // initialized viewNodes with an empty array
    viewEdges: [] as IEdge[], // initialized viewEdges with an empty array
  } as WorkflowState,
  getters: {
  },
  mutations: {
    addFunctionalNode(state: WorkflowState, node: FunctionalNode) {
      const viewNodes: INode = {
        id: node.id,
        position: {
          x: 0,
          y: 0,
        },
        type: node.type,
      }
      state.viewNodes.push(viewNodes);
      state.workflow.addNode(node);
    },
    addHttpNode(state: WorkflowState, httpNode: HttpNode) {
      const viewNodes: INode = {
        id: httpNode.id,
        position: {
          x: 0,
          y: 0,
        },
        type: httpNode.type
      }
      state.viewNodes.push(viewNodes);
      state.workflow.addNode(httpNode);
    }
  },
};
