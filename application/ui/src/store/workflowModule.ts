import Edge, { EdgeType } from "../classes/Edge";
import FunctionalNode from "../classes/FunctionalNode";
import HttpNode from "../classes/HttpNode";
import { Workflow } from "../classes/Workflow";
import type { IEdge, INode } from "../model";
export interface WorkflowState {
  workflow: Workflow;
  viewNodes: INode[];
  viewEdges: IEdge[];
  workflowId: string;
  workflowName: string;
  workflowDescription: string;
}
export default {
  namespaced: true,
  state: {
    workflowId: "",
    workflowName: "Untitled",
    workflowDescription: "lorem ipsum",
    workflow: new Workflow(),
    viewNodes: [] as INode[], // initialized viewNodes with an empty array
    viewEdges: [] as IEdge[], // initialized viewEdges with an empty array
  } as WorkflowState,
  getters: {},
  mutations: {
    setWorkflowId(state: WorkflowState, id: string) {
      state.workflowId = id;
    },
    setWorkflowName(state: WorkflowState, name: string) {
      state.workflowName = name;
    },
    setWorkflowDescription(state: WorkflowState, description: string) {
      state.workflowDescription = description;
    },
    addFunctionalNode(state: WorkflowState, node: FunctionalNode) {
      const viewNodes: INode = {
        id: node.id,
        position: {
          x: 0,
          y: 0,
        },
        type: node.type,
      };
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
        type: httpNode.type,
      };
      state.viewNodes.push(viewNodes);
      state.workflow.addNode(httpNode);
    },
    addEdge(state: WorkflowState, edge: IEdge) {
      const {
        target,
        sourceHandle,
        targetHandle
      } = edge;
      const edgeObject = new Edge()
      edgeObject.from = sourceHandle ?? "";
      edgeObject.to = targetHandle ?? "";
      edgeObject.type = target === targetHandle ? EdgeType.CONNECTOR : EdgeType.DATA_TRANSFER;
      
      const viewEdges: IEdge = {
        id: edgeObject.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        type: edgeObject.type,
      };
      state.viewEdges.push(viewEdges);
      state.workflow.addEdge(edgeObject);
    },
    addNodeWithPosition(state: WorkflowState, payload: { node: FunctionalNode | HttpNode; position: { x: number; y: number } }) {
      const { node, position } = payload;
      const viewNode: INode = {
        id: node.id,
        position: { ...position },
        type: node.type,
      };
      state.viewNodes.push(viewNode);
      state.workflow.addNode(node);
    },
    updateNodePosition(state: WorkflowState, payload: { id: string; position: { x: number; y: number } }) {
      const { id, position } = payload;
      const nodeIndex = state.viewNodes.findIndex((node) => node.id === id);
      if (nodeIndex > -1) {
        state.viewNodes[nodeIndex].position = { ...position };
        console.log(`Node position updated in store: ${id} -> (${position.x}, ${position.y})`);
      } else {
        console.warn(`Could not update position for node ${id}: not found in viewNodes`);
      }
    },
    
    updateMultipleNodePositions(state: WorkflowState, nodes: Array<{ id: string; position: { x: number; y: number } }>) {
      let updatedCount = 0;
      
      nodes.forEach(node => {
        const nodeIndex = state.viewNodes.findIndex((n) => n.id === node.id);
        if (nodeIndex > -1) {
          state.viewNodes[nodeIndex].position = { ...node.position };
          updatedCount++;
        }
      });
      
      if (updatedCount > 0) {
        console.log(`Updated positions for ${updatedCount}/${nodes.length} nodes`);
      }
    }
  },
};
