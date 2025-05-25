import Node, { NodeStatus, NodeType } from './Node';
import Variable from './Variable';

export default class FunctionalNode extends Node {
    parameters: Variable[];
    transform: string;

    constructor(config?: {
        id: string;
        parameters?: Variable[];
        transform: string;
    }) {
        super(config?.id, NodeType.FUNCTIONAL);
        this.parameters = config?.parameters || [] as Variable[];
        this.transform = config?.transform || '';
    }

    execute(globalStore: Record<string, any>): any {
        this.executing = true;
        this.executionDone = false;
        const executionStartTime = Date.now();
        this.hasError = false;
        this.errorMessage = null;
        const paramsNames = this.parameters.map(param => param.name);
        const paramValues = this.parameters.map(param => param.get(globalStore) || null);
        return new Promise((resolve, reject) => {
            try {
                this.executing = true;
                const transformFunction = new Function(...paramsNames, this.transform);
                const result = transformFunction(...paramValues);
                this.nodeData = result;
                this.nodeStatus = NodeStatus.SUCCESS;
                this.hasError = false;
                this.errorMessage = null;
                resolve(undefined);
            } catch (error) {
                console.error(`Error executing transform for FunctionalNode ${this.id}:`, error);
                this.hasError = true;
                this.errorMessage = error instanceof Error ? error.message : String(error);
                this.nodeStatus = NodeStatus.FAILURE;
                this.nodeData = null;
                this.errorMessage = error instanceof Error ? error.message : String(error);
                resolve(undefined);
            } finally {
                this.executing = false;
                this.executionDone = true;
                this.executionTime = Date.now() - executionStartTime;
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