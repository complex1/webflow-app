import Node from ".";
import { NodeStatus, NodeType, type ExecutionEmitter, type VariablePool } from "../types";
import Variable from "./variable";

export default class FunctionalNode extends Node {
    parameters: Variable[];
    transform: string;

    constructor(config?: {
        id: string;
        parameters?: Variable[];
        transform?: string;
    }) {
        super(config?.id, NodeType.FUNCTIONAL);
        this.parameters = config?.parameters || [] as Variable[];
        this.transform = config?.transform || '';
    }

    execute(
        globalStore: VariablePool,
        envVariableMap: Record<string, string>,
        dataEmitter: ExecutionEmitter
    ): any {
        this.executing = true;
        dataEmitter(this.id, 'executing' , true);
        this.executionDone = false;
        dataEmitter(this.id, 'executionDone' , false);
        const executionStartTime = Date.now();

        this.hasError = false;
        dataEmitter(this.id, 'hasError' , false);
        this.errorMessage = null;
        dataEmitter(this.id, 'errorMessage' , null);
        const paramsNames = this.parameters.map(param => param.name);
        const paramValues = this.parameters.map(param => param.get(globalStore, envVariableMap) || null);
        return new Promise((resolve) => {
            try {
                this.executing = true;
                const transformFunction = new Function(...paramsNames, this.transform);
                const result = transformFunction(...paramValues);
                this.nodeStatus = NodeStatus.SUCCESS;
                dataEmitter(this.id, 'nodeStatus' , this.nodeStatus);
                this.hasError = false;
                dataEmitter(this.id, 'hasError' , false);
                this.errorMessage = null;
                dataEmitter(this.id, 'errorMessage' , null);
                resolve(result);
            } catch (error) {
                console.error(`Error executing transform for FunctionalNode ${this.name} (${this.id}):`, error);
                this.hasError = true;
                dataEmitter(this.id, 'hasError' , true);
                this.errorMessage = error instanceof Error ? error.message : String(error);
                dataEmitter(this.id, 'errorMessage' , this.errorMessage);
                this.nodeStatus = NodeStatus.FAILURE;
                dataEmitter(this.id, 'nodeStatus' , this.nodeStatus);
                this.errorMessage = error instanceof Error ? error.message : String(error);
                dataEmitter(this.id, 'errorMessage' , this.errorMessage);
                resolve(undefined);
            } finally {
                this.executing = false;
                dataEmitter(this.id, 'executing' , false);
                this.executionDone = true;
                dataEmitter(this.id, 'executionDone' , true);
                this.executionTime = Date.now() - executionStartTime;
                dataEmitter(this.id, 'executionTime' , this.executionTime);
            }
        });
    }
    serialized() {
        return {
            ...super.serialized(),
            parameters: this.parameters.map(param => param.serialized()),
            transform: this.transform,
        };
    }
    deserialized(serializedNode: any) {
        super.deserialized(serializedNode);
        this.parameters = serializedNode.parameters.map((param: any) => {
            const variable = new Variable();
            variable.deserialized(param);
            return variable;
        });
        this.transform = serializedNode.transform;
    }
}