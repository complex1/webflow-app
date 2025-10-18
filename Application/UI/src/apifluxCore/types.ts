import type { ApiNode } from "./nodes/apiNode";
import type FunctionalNode from "./nodes/functionalNode";
import type Variable from "./nodes/variable";

export enum NodeType {
    FUNCTIONAL = 'FUNCTIONAL',
    API = 'API',
}

export enum NodeStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
    INACTIVE = 'INACTIVE',
    SKIPPED = 'SKIPPED',
}

export type WebflowNode = FunctionalNode | ApiNode;

export type ExecutionEmitter = (nodeId: string, path: string, value: any) => void
export type VariablePool = {
    [key: string]: any
}