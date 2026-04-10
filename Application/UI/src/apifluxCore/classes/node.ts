import { NodeStatus, NodeType } from "../types";
import { generateUUID } from "../utils";
import Variable from "./variable";

export default class Node {
    name: string | null = null; // added name property
    description: string | null = null; // added description property
    
    // Run-time properties
    nodeStatus: NodeStatus; // updated type to NodeStatus
    nodeData: Variable; // changed to any for flexibility
    hasError: boolean = false; // change to private
    error: string | null | undefined = null;

    id: string;
    type: NodeType;
    private order: number = 0; // added order property
    private position: { x: number; y: number } = { x: 0, y: 0 }; // added position property

    constructor(id?: string, type?: NodeType) {
        this.id = id || generateUUID();
        this.type = type || NodeType.TRANSFORM;
        this.name = null; // initialize name
        this.description = null; // initialize description

        this.nodeStatus = NodeStatus.INACTIVE; // updated to use NodeStatus enum
        this.nodeData = new Variable({
            name: `data-for-${this.id}`,
            id: this.id + "_data",
        }); // initialize nodeData
    }

    setOrder(order: number): void {
        this.order = order;
    }

    getOrder(): number {
        return this.order;
    }

    setPosition(position: { x: number; y: number }): void {
        this.position = position;
    }

    getPosition(): { x: number; y: number } {
        return this.position;
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

    getId(): string {
        return this.id;
    }

    getType(): NodeType {
        return this.type;
    }

    serialized() {
        return {
            id: this.id,
            type: this.type,
            name: this.name,
            description: this.description,
            order: this.order,
            position: this.position,
            nodeData: this.nodeData.serialized(),
        };
    }
    deserialized(serializedNode: any) {
        this.id = serializedNode.id;
        this.type = serializedNode.type;
        this.name = serializedNode.name;
        this.description = serializedNode.description;
        this.order = serializedNode.order;
        this.position = serializedNode.position;
        this.nodeData = new Variable().deserialized(serializedNode.nodeData);
    }
}
