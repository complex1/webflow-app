import Node, { NodeStatus, NodeType } from './Node';
import Variable from './Variable';

export default class FunctionalNode extends Node {
    parameters: Variable[];
    transform: string;

    constructor(config?: {
        parameters?: Variable[];
        transform: string;
    }) {
        super(NodeType.FUNCTIONAL);
        this.parameters = config?.parameters || [];
        this.transform = config?.transform || '';
    }

    execute(globalStore: Record<string, any>): any {
        this.executing = true;
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
                resolve(undefined)
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
            }
        });
    }
}