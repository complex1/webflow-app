import { generateUUID } from '../utils/uuid';

export enum EdgeType {
    CONNECTOR = 'CONNECTOR',
    DATA_TRANSFER = 'DATA_TRANSFER', // this type of connection is used to transfer data between nodes
    CONTROL_FLOW = 'CONTROL_FLOW' // define th squence of execution
}

export default class Edge {
    id: string;
    from: string; // this property represents the source node
    to: string; // this property represents the destination node
    type: EdgeType; // this property defines the type of edge

    constructor(config?: {
        from: string;
        to: string;
        type: EdgeType;
    }) {
        this.id = generateUUID();
        this.from = config?.from || '';
        this.to = config?.to || '';
        this.type = config?.type || EdgeType.CONNECTOR;
    }
}