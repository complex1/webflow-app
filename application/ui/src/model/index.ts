export interface INode {
    id: string;
    position: { x: number; y: number };
    type: string;
}

export interface IEdge {
    id: string;
    source: string;
    target: string;
    type: string;
    sourceHandle?: string;
    targetHandle?: string;
    animated?: boolean;
    label?: string;
    data?: any;
}

export interface WebflowDto {
  name: string;
  description?: string;
  createdBy: string;
  tags?: string[];
  icon?: string;
  data?: any;
}