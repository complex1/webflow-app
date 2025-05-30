import Edge, { EdgeType } from '../classes/Edge';
import FunctionalNode from '../classes/FunctionalNode';
import HttpNode from '../classes/HttpNode';
import { Workflow } from '../classes/Workflow';
import type { IEdge, INode } from '../model';
import { warning } from '../lib/toast';
import type { LoggerInterface } from '../classes/logger';
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
    workflowId: '',
    workflowName: 'Untitled',
    workflowDescription: '',
    workflow: new Workflow(),
    viewNodes: [] as INode[], // initialized viewNodes with an empty array
    viewEdges: [] as IEdge[], // initialized viewEdges with an empty array
  } as WorkflowState,
  getters: {},
  mutations: {
    resetWorkflowState(state: WorkflowState) {
      state.workflow = new Workflow();
      state.viewNodes = [];
      state.viewEdges = [];
      state.workflowId = '';
      state.workflowName = 'Untitled';
      state.workflowDescription = '';
    },
    executeWorkflow(state: WorkflowState, logger: LoggerInterface) {
      const { workflow } = state;
      workflow.execute(logger, (w: Workflow) => {
        state.workflow = w;
      });
    },
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
    updateFunctionalNode(state: WorkflowState, node: FunctionalNode) {
      const nodeIndex = state.viewNodes.findIndex((n) => n.id === node.id);
      if (nodeIndex > -1) {
        state.viewNodes[nodeIndex] = {
          id: node.id,
          position: {
            x: state.viewNodes[nodeIndex].position.x,
            y: state.viewNodes[nodeIndex].position.y,
          },
          type: node.type,
        };
        state.workflow.updateNode(node);
      } else {
        console.warn(`Node not found for update: ${node.id}`);
      }
    },
    updateHttpNode(state: WorkflowState, httpNode: HttpNode) {
      const nodeIndex = state.viewNodes.findIndex((n) => n.id === httpNode.id);
      if (nodeIndex > -1) {
        state.viewNodes[nodeIndex] = {
          id: httpNode.id,
          position: {
            x: state.viewNodes[nodeIndex].position.x,
            y: state.viewNodes[nodeIndex].position.y,
          },
          type: httpNode.type,
        };
        state.workflow.updateNode(httpNode);
      } else {
        console.warn(`HTTP Node not found for update: ${httpNode.id}`);
      }
    },
    removeNode(state: WorkflowState, id: string) {
      const nodeIndex = state.viewNodes.findIndex((n) => n.id === id);
      if (nodeIndex > -1) {
        state.viewNodes.splice(nodeIndex, 1);
        state.workflow.removeNode(id);
      } else {
        console.warn(`Node not found for removal: ${id}`);
      }
    },
    removeEdge(state: WorkflowState, id: string) {
      const edgeIndex = state.viewEdges.findIndex((e) => e.id === id);
      if (edgeIndex > -1) {
        state.viewEdges.splice(edgeIndex, 1);
        state.workflow.removeEdge(id);
      } else {
        console.warn(`Edge not found for removal: ${id}`);
      }
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
        source,
        target,
        sourceHandle,
        targetHandle
      } = edge;

      if(source === target) {
        warning('Edge source and target cannot connect to the same node.');
        return;
      }
      if(!sourceHandle || !targetHandle) {
        warning('Edge must have both sourceHandle and targetHandle defined.');
        return;
      }
      if (source === sourceHandle && target !== targetHandle) {
        warning('Flow nodes cannot connect to data nodes.');
        return;
      }
      if (target === targetHandle && source !== sourceHandle) {
        warning('Data nodes cannot connect to flow nodes.');
        return;
      }

      const edgeObject = new Edge();
      edgeObject.from = sourceHandle ?? '';
      edgeObject.to = targetHandle ?? '';
      edgeObject.type = target === targetHandle ? EdgeType.CONTROL_FLOW : EdgeType.DATA_TRANSFER;
      
      const viewEdges: IEdge = {
        id: edgeObject.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        animated: edgeObject.type === EdgeType.DATA_TRANSFER,
        style: {
          stroke: edgeObject.type === EdgeType.CONTROL_FLOW ? 'green' : 'gray',
          strokeWidth: 2,
        }
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
