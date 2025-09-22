export interface WebflowDto {
  name: string;
  description?: string;
  createdBy: string;
  tags?: string[];
  icon?: string;
  data?: any;
  openApiDocConfig?: OpenApiDocConfig;
  parentId?: string; // Optional parentId for hierarchical webflows
  isFolder?: boolean; // Flag to indicate if the webflow is a folder
}

export interface WebflowResponseDto extends WebflowDto {
  id: string;
  createdAt: Date;
}

export interface OpenApiDocConfig {
  enabled: boolean;
  url: string;
  baseUrl?: string; // Optional base URL for OpenAPI
  fromFile: boolean;
  fileData?: any; // Parsed JSON/YAML data
}