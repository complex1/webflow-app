import Edge, { EdgeType } from "./Edge";
import FunctionalNode from "./FunctionalNode";
import HttpNode from "./HttpNode";
import { NodeStatus } from "./Node";

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

  createMaps() {
    this.sourceTargetMap.clear();
    this.targetSourceMap.clear();
    this.edges
      .filter((edge) => edge.type === EdgeType.CONTROL_FLOW)
      .forEach((edge) => {
        if (!this.sourceTargetMap.has(edge.from)) {
          this.sourceTargetMap.set(edge.from, []);
        }
        if (!this.targetSourceMap.has(edge.to)) {
          this.targetSourceMap.set(edge.to, []);
        }
        this.sourceTargetMap.get(edge.from)?.push(edge.to);
        this.targetSourceMap.get(edge.to)?.push(edge.from);
      });
  }

  findRootNodesIds() {
    const rootNodes = Array.from(this.nodes.values()).filter((node) => {
      return !this.targetSourceMap.has(node.id);
    });
    return rootNodes.map((node) => node.id);
  }

  setOrder(ids: string[], order: number) {
    ids.forEach((id) => {
      const node = this.nodes.get(id);
      if (node) {
        node.setOrder(order);
        const nextIds = this.sourceTargetMap.get(id);
        if (nextIds) {
          this.setOrder(nextIds, order + 1);
        }
      }
    });
  }

  setGlobalStore(node: WorkflowNode) {
    const dataTransferEdges = this.edges.filter(
      (edge) => edge.type === EdgeType.DATA_TRANSFER && edge.from === node.id
    );
    dataTransferEdges.forEach((edge) => {
      const tragetId = edge.to;
      this.globalStore[tragetId] = node.nodeData;
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
  async execute() {
    this.createMaps();
    const rootIds = this.findRootNodesIds();
    this.setOrder(rootIds, 1);
    this.setAllPending();
    const groupedNodes: WorkflowNode[][] = [];
    const maxOrder = Math.max(...Array.from(this.nodes.values()).map((node) => node.getOrder()));
    for (let i = 1; i <= maxOrder; i++) {
      const nodesAtOrder = Array.from(this.nodes.values()).filter((node) => node.getOrder() === i);
      groupedNodes.push(nodesAtOrder);
    }

    for (const nodes of groupedNodes) {
      await Promise.all(nodes.map((node) => node.execute(this.globalStore)));
      if (nodes.some((node) => node.hasError)) {
        this.setAbortedByInterruption();
        break;
      }
      nodes.forEach((node) => {
        if (node.nodeData) {
          this.setGlobalStore(node);
        }
      });
    }
    console.log(JSON.stringify(this, null, 2));
  }
}
