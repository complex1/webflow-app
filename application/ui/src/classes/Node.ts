import { generateUUID } from "../utils/uuid";

export enum NodeType {
    FUNCTIONAL = 'FUNCTIONAL',
    HTTP = 'HTTP',
}

export enum NodeStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
    INACTIVE = 'INACTIVE',
    SKIPPED = 'SKIPPED',
}

export default class Node {
    id: string;
    name: string | null = null; // added name property
    description: string | null = null; // added description property
    type: NodeType;
    nodeStatus: NodeStatus; // updated type to NodeStatus
    nodeData: any;
    executing: boolean;
    hasError: boolean; // change to private
    errorMessage: string | null; // change to private
    executionTime: number | null = null; // added executionTime property
    executionDone: boolean = false; // added executionDone property
    private order: number = 0; // added order property

    constructor(id?: string, type?: NodeType) {
        this.id = id || generateUUID();
        this.type = type || NodeType.FUNCTIONAL;
        this.name = null; // initialize name
        this.description = null; // initialize description

        this.nodeStatus = NodeStatus.INACTIVE; // updated to use NodeStatus enum
        this.nodeData = null;
        this.executing = false; // initialize executing
        this.hasError = false; // initialize hasError
        this.errorMessage = null; // initialize errorMessage
    }

    setOrder(order: number): void {
        this.order = order;
    }
    getOrder(): number {
        return this.order;
    }

    updateStatus(newStatus: NodeStatus): void {
        this.nodeStatus = newStatus;
    }

    setData(data: any): void {
        this.nodeData = data;
    }
    getData(): any {
        return this.nodeData;
    }
    serialized() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            type: this.type,
            order: this.order
        };
    }
    deserialized(serializedNode: any) {
        this.id = serializedNode.id;
        this.name = serializedNode.name;
        this.description = serializedNode.description;
        this.type = serializedNode.type;
        this.order = serializedNode.order;
    }
}