export interface WebflowDto {
  name: string;
  description?: string;
  createdBy: string;
  tags?: string[];
  icon?: string;
  data?: any;
}

export interface WebflowResponseDto extends WebflowDto {
  id: string;
  createdAt: Date;
}
