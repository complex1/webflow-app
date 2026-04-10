export type NodeOption = 'api' | 'curl' | 'transform' | 'openapi';
export type OpenApiConfigType = 'SERVER' | 'FILE';

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