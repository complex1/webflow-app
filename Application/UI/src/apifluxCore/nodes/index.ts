import { NodeStatus, NodeType } from "../types";
import { generateUUID } from "../utils/uuid";
import Variable from "./variable";

export default class Node {
    id: string;
    name: string | null = null; // added name property
    description: string | null = null; // added description property
    type: NodeType;
    nodeStatus: NodeStatus; // updated type to NodeStatus
    nodeData = new Variable(); // changed to any for flexibility
    executing: boolean;
    hasError: boolean; // change to private
    errorMessage: string | null; // change to private
    executionTime: number | null = null; // added executionTime property
    executionDone: boolean = false; // added executionDone property
    private envVariableMap: Record<string, string> = {}; // added envVariableMap property
    private order: number = 0; // added order property
    private position: { x: number; y: number } = { x: 0, y: 0 }; // added position property

    constructor(id?: string, type?: NodeType) {
        this.id = id || generateUUID();
        this.type = type || NodeType.FUNCTIONAL;
        this.name = null; // initialize name
        this.description = null; // initialize description

        this.nodeStatus = NodeStatus.INACTIVE; // updated to use NodeStatus enum
        this.nodeData = new Variable(); // initialize nodeData
        this.nodeData.id = this.id + "_data"; // link nodeData id to node id
        this.executing = false; // initialize executing
        this.hasError = false; // initialize hasError
        this.errorMessage = null; // initialize errorMessage
    }

    setEnvVariableMap(map: Record<string, string>): void {
        this.envVariableMap = map;
    }
    getEnvVariableMap(): Record<string, string> {
        return this.envVariableMap;
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