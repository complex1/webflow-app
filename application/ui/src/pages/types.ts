// Dashboard types
import type { WebflowCardProps } from '../components/dashboard/types';

export interface WebflowForm {
  id?: string;
  name: string;
  description: string;
  icon: string;
  tags: string[];
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
