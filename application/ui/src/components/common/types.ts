// Types for common components
export interface ModalProps {
  isOpen: boolean;
  title: string;
  width?: string;
  closeOnEscape?: boolean;
}

export interface ModalEmits {
  (e: 'close'): void;
}

export interface DrawerProps {
  isOpen: boolean;
  title: string;
  width?: string;
  position?: 'right' | 'left';
}

export interface DrawerEmits {
  (e: 'close'): void;
}

export interface ValidationErrorProps {
  errors: Array<{message: string; type?: string}>;
}

export interface ThemeToggleProps {
  isDark?: boolean;
}

export interface ThemeToggleEmits {
  (e: 'change', isDark: boolean): void;
}

export interface ExpansionPanelProps {
  title: string;
  isOpen?: boolean;
  icon?: string;
}

export interface StatusChipProps {
  status: string;
  text?: string;
}

export interface PopoverProps {
  title?: string;
  content: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
}

export interface NavbarProps {
  title?: string;
}

export interface AuthLayoutProps {
  title: string;
}

export interface WfaInputProps {
  id?: string;
  label?: string;
  modelValue?: string | number;
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'date' | 'tel' | 'url';
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  min?: string | number;
  max?: string | number;
  maxlength?: string | number;
  rows?: string | number;
  error?: string;
}

export interface WfaInputEmits {
  (e: 'update:modelValue', value: string): void;
  (e: 'blur', event: FocusEvent): void;
  (e: 'focus', event: FocusEvent): void;
}
