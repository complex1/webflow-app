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