import type { Edge, Node } from "@vue-flow/core";

export const getStartingNodeIds = (edges: Edge[], nodes: Node[]) => {
   const startingNodeIds: string[] = [];

    nodes.forEach(node => {
        const isStartingNode = edges.every(edge => edge.target !== node.id);
        if (isStartingNode) {
            startingNodeIds.push(node.id);
        }
    });

   return startingNodeIds;
}

export const getAllNextNodeIds = (currentNodeId: string, edges: Edge[]) => {
    return edges
        .filter(edge => edge.source === currentNodeId)
        .map(edge => edge.target);
}

export const getAllTargetIds = (currentNodeId: string, edges: Edge[]) => {
    return edges
        .filter(edge => edge.sourceHandle === currentNodeId)
        .map(edge => edge.targetHandle || null)
        .filter((id): id is string => id !== null);
}