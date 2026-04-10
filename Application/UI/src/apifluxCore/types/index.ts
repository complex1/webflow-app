import type HttpNode from "../classes/httpNode"
import type TransformNode from "../classes/transformNode"

export enum NodeType {
    TRANSFORM = 'TRANSFORM',
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

export type VariablePool = {
    [key: string]: any
}

export type envVariableMap = {
    [key: string]: string
}

export type ExecutionEmitter = (nodeId: string, path: string, value: any) => void
export type WebflowNode = TransformNode | HttpNode;

export type ValidationError = {
    variableId?: string;
    field: string;
    message: string;
};
