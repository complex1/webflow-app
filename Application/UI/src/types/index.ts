export interface Pagination {
    page: number
    limit: number
    total: number
    totalPages: number
}

export interface WebflowHierarchy {
    id: number
    name: string
    icon: string
    parentId?: number
}

export interface WebFlowConfig {
    id: number
    webFlowId: number
    nodes: any[]
    edges: any[]
    userId: number
    createdAt: string
    updatedAt: string
}

export interface ExtractedField {
  name: string;
  required: boolean;
  type: string;
  description?: string;
}
export interface ExtractedAPI {
  id: string;
  groupName: string;
  name: string;
  url: string;
  method: string;
  description?: string; // Add description field which is used in filtering
  header?: ExtractedField[];
  pathParam?: ExtractedField[];
  queryParam?: ExtractedField[];
  body?: any;
}
