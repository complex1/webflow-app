// Types for playground components
import type Variable from '../../classes/Variable';
import type HttpNode from '../../classes/HttpNode';
import type FunctionalNode from '../../classes/FunctionalNode';
import type Node from '../../classes/Node';

export interface VariableFormData {
  name: string;
  type: string;
  description: string;
  defaultValue: any;
  required: boolean;
  formStore: boolean;
}

export interface VariableFormProps {
  variable: Variable;
  canRemove: boolean;
}

export interface VariableFormEmits {
  (e: 'update', data: VariableFormData): void;
  (e: 'remove'): void;
}

export interface AddNodeProps {
  position?: { x: number; y: number };
}

export interface AddNodeEmits {
  (e: 'add', nodeType: string, position?: { x: number; y: number }): void;
}

export interface HttpNodeFormProps {
  node: HttpNode;
}

export interface HttpNodeFormEmits {
  (e: 'update'): void;
}

export interface FunctionalNodeFormProps {
  node: FunctionalNode;
}

export interface FunctionalNodeFormEmits {
  (e: 'update'): void;
}

export interface NodeProps {
  id: string;
}

export interface NodeState {
  expanded: boolean;
  node: Node | null;
  variables: Variable[];
  loading: boolean;
  responseData: any;
}
