// Dashboard types
import type { WebflowCardProps } from '../components/dashboard/types';

export interface WebflowForm {
  id?: string;
  name: string;
  description: string;
  icon: string;
  tags: string[];
  itemType: 'file' | 'folder'; // Type selection in form
  openApiDocConfig: {
    enabled: boolean;
    url: string;
    baseUrl?: string; // Optional base URL for OpenAPI
    fromFile: boolean;
    fileData?: any;
  };
  data?: any; // Adjust type as needed
  isFolder: boolean;
  parentId?: string | null;
}

export interface DashboardState {
  webflows: WebflowCardProps[];
  filteredWebflows: WebflowCardProps[];
  loading: boolean;
  searchQuery: string;
  selectedTag: string;
  drawerOpen: boolean;
  isEditing: boolean;
  webflowForm: WebflowForm;
  nameError: string;
  tagInput: string;
  showDeleteConfirm: boolean;
  webflowToDelete: WebflowCardProps | null;
}
