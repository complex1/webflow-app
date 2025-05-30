import Edge, { EdgeType } from './Edge';
import FunctionalNode from './FunctionalNode';
import HttpNode from './HttpNode';
import { type LoggerInterface } from './logger';
import { NodeStatus } from './Node';

type WorkflowNode = HttpNode | FunctionalNode;
export class Workflow {
  nodes: Map<string, WorkflowNode>;
  edges: Edge[];
  globalStore: Record<string, any>;
  sourceTargetMap: Map<string, string[]>;
  targetSourceMap: Map<string, string[]>;

  constructor() {
    this.nodes = new Map<string, WorkflowNode>();
    this.edges = [];
    this.globalStore = {};
    this.sourceTargetMap = new Map();
    this.targetSourceMap = new Map();
  }

  getNode(id: string) {
    return this.nodes.get(id);
  }

  addNode(node: WorkflowNode) {
    this.nodes.set(node.id, node);
  }
  addEdge(edge: Edge) {
    this.edges.push(edge);
  }
  updateNode(node: WorkflowNode) {
    if (this.nodes.has(node.id)) {
      this.nodes.set(node.id, node);
    } else {
      console.warn(`Node not found for update: ${node.id}`);
    }
  }

  removeNode(id: string) {
    this.nodes.delete(id);
    this.removeUnusedEdges();
  }
  removeEdge(id: string) {
    const edge = this.edges.find((e) => e.id === id);
    if (!edge) {
      console.warn(`Edge not found for removal: ${id}`);
      return;
    }
    // Remove the edge from the edges array
    this.edges = this.edges.filter((e) => e.id !== id);
  }

  removeUnusedEdges() {
    this.edges = this.edges.filter((edge) => {
      if (edge.type === EdgeType.CONTROL_FLOW) {
        return this.nodes.has(edge.from) && this.nodes.has(edge.to);
      } else if (edge.type === EdgeType.DATA_TRANSFER) {
        return this.nodes.has(edge.from) || this.nodes.has(edge.to);
      }
      return false; // Remove edges of unknown type
    });
    // Remove edges that are not connected to any nodes
    this.edges = this.edges.filter((edge) => {
      return this.nodes.has(edge.from) && this.nodes.has(edge.to);
    });
  }

  setMap() {
    const sourceTargetMap = new Map<string, string[]>();
    const targetSourceMap = new Map<string, string[]>();

    this.edges
    .filter((edge) => edge.type === EdgeType.CONTROL_FLOW)
    .forEach((edge) => {
      if (!sourceTargetMap.has(edge.from)) {
        sourceTargetMap.set(edge.from, []);
      }
      if (!targetSourceMap.has(edge.to)) {
        targetSourceMap.set(edge.to, []);
      }
      sourceTargetMap.get(edge.from)?.push(edge.to);
      targetSourceMap.get(edge.to)?.push(edge.from);
    });

    this.sourceTargetMap = sourceTargetMap;
    this.targetSourceMap = targetSourceMap;
  }

  setOrder() {
    const rootNodes = Array.from(this.nodes.values()).filter((node) => {
      return !this.targetSourceMap.has(node.id);
    });
    const rootIds = rootNodes.map((node) => node.id);

    const setNodeOrder = (ids: string[], order: number) => {
      ids.forEach((id) => {
        const node = this.nodes.get(id);
        if (node) {
          node.setOrder(order);
          const nextIds = this.sourceTargetMap.get(id);
          if (nextIds) {
            setNodeOrder(nextIds, order + 1);
          }
        }
      });
    };

    setNodeOrder(rootIds, 1);
  }

  setGlobalStore(node: WorkflowNode) {
    const dataTransferEdges = this.edges.filter(
      (edge) => edge.type === EdgeType.DATA_TRANSFER && edge.from === `data-${node.id}`
    );
    dataTransferEdges.forEach((edge) => {
      const targetId = edge.to;
      this.globalStore[targetId] = node.nodeData;
    });
  }

  setAllPending() {
    this.nodes.forEach((node) => {
      node.nodeStatus = NodeStatus.PENDING;
    });
  }
  setAllInactive() {
    this.nodes.forEach((node) => {
      node.nodeStatus = NodeStatus.INACTIVE;
    });
  }
  setAbortedByInterruption() {
    this.nodes.forEach((node) => {
      if (node.nodeStatus === NodeStatus.PENDING) {
        node.nodeStatus = NodeStatus.SKIPPED;
      }
    });
  }
  async execute(logger: LoggerInterface, callback: (workflow: Workflow) => void) {
    // this.removeUnusedEdges();
    logger?.info('Workflow execution started');
    this.setMap();
    this.setOrder();
    this.setAllPending();
    const groupedNodes: WorkflowNode[][] = [];
    const maxOrder = Math.max(...Array.from(this.nodes.values()).map((node) => node.getOrder()));
    for (let i = 1; i <= maxOrder; i++) {
      const nodesAtOrder = Array.from(this.nodes.values()).filter((node) => node.getOrder() === i);
      groupedNodes.push(nodesAtOrder);
    }
    logger?.info('all Setup done, starting execution');
    for (const nodes of groupedNodes) {
      await Promise.all(nodes.map((node) => node.execute(this.globalStore, logger)));
      if (nodes.some((node) => node.hasError)) {
        this.setAbortedByInterruption();
        break;
      }
      nodes.forEach((node) => {
        if (node.nodeData) {
          this.setGlobalStore(node);
        }
      });
      callback(this);
    }
  }
}
