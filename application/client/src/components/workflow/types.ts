// Import types for Vue Flow
// These are placeholder types - you may need to adjust based on the actual types from your Vue Flow version
export interface Node {
  id: string;
  type?: string;
  position: { x: number; y: number };
  positionAbsolute?: { x: number; y: number };
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  type?: string;
}

export interface NodeDragEvent {
  node: Node;
  event: MouseEvent;
}

// Node Types
export interface NodePosition {
  x: number;
  y: number;
}

export interface NodePositionUpdate {
  id: string;
  position: NodePosition;
}

// Viewport Types
export interface ViewportState {
  x: number;
  y: number;
  zoom: number;
}

// Event Handler Types
export type NodeDragEventHandler = (event: NodeDragEvent) => void;
export type NodeDragStopHandler = (event: NodeDragEvent) => void;
export type NodesDragStopHandler = (payload: { nodes: Node[] }) => void;
export type ZoomChangeHandler = (payload: { zoom: number }) => void;
export type ViewportChangeHandler = (viewport: ViewportState) => void;
export type NodesInitializedHandler = () => void;

// Connect Params
export interface ConnectParams {
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

// Workflow Playground Component Props
export interface WorkflowPlaygroundProps {
  workflowId?: string;
  readOnly?: boolean;
}

// Emits Interface
export interface WorkflowPlaygroundEmits {
  (e: 'nodePositionChanged', nodePos: NodePositionUpdate): void;
  (e: 'viewportChanged', viewport: ViewportState): void;
}

// Types for workflow components
export interface WorkflowHeaderProps {
  workflowName: string;
  workflowId?: string;
  workflowDescription?: string;
}

export interface WorkflowHeaderEmits {
  (e: 'save'): void;
  (e: 'run'): void;
  (e: 'export'): void;
  (e: 'updateName', name: string): void;
  (e: 'navigateDashboard'): void;
}
