// Types for Dashboard components
export interface WebflowCardProps {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  tags?: string[];
  icon?: string;
  data?: any;
  openApiDocConfig?: {
    enabled: boolean;
    url: string;
    baseUrl?: string; // Optional base URL for OpenAPI
  };
  // Optional field for createdAt, can be a Date object or a string
  createdAt?: Date | string;
}

export interface WebflowCardEmits {
  (e: 'edit', webflow: WebflowCardProps): void;
  (e: 'delete', webflow: WebflowCardProps): void;
}
