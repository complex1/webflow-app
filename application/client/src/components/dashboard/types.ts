// Types for Dashboard components
export interface WebflowCardProps {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  tags?: string[];
  icon?: string;
  data?: any;
  createdAt?: Date | string;
}

export interface WebflowCardEmits {
  (e: 'edit', webflow: WebflowCardProps): void;
  (e: 'delete', webflow: WebflowCardProps): void;
}
