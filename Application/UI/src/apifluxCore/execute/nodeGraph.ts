import type { Edge, Node } from "@vue-flow/core";

/** Nodes with no incoming *control-flow* edges (execution entry points). */
export const getStartingNodeIds = (flowControlEdges: Edge[], nodes: Node[]) => {
  const startingNodeIds: string[] = [];

  nodes.forEach((node) => {
    const isStartingNode = flowControlEdges.every((edge) => edge.target !== node.id);
    if (isStartingNode) {
      startingNodeIds.push(node.id);
    }
  });

  return startingNodeIds;
};

export const getAllNextNodeIds = (currentNodeId: string, edges: Edge[]) => {
  return edges
    .filter((edge) => edge.source === currentNodeId)
    .map((edge) => edge.target);
};

/**
 * Data-flow edges: `source` / `target` are Vue Flow node ids. Handles are variable ids
 * (`Variable.id`), or the source node id when using the node's default body handle.
 * Returns every target *variable* id that should receive the same value as the node's output.
 */
export const getDataFlowTargetVariableIds = (
  sourceVueNodeId: string,
  outputVariableId: string,
  dataFlowEdges: Edge[]
): string[] => {
  const targets = new Set<string>();

  for (const edge of dataFlowEdges) {
    if (edge.source !== sourceVueNodeId) continue;

    const sh = edge.sourceHandle;
    const handleMatchesOutput =
      sh == null ||
      sh === "" ||
      sh === outputVariableId ||
      sh === sourceVueNodeId;

    if (!handleMatchesOutput) continue;

    const th = edge.targetHandle;
    if (th) targets.add(th);
  }

  return [...targets];
};
