import { reactive } from 'vue';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  timestamp: number;
}

interface ToastState {
  toasts: Toast[];
}

// Create a reactive state to store toast notifications
const toastState = reactive<ToastState>({
  toasts: [],
});

/**
 * Generate a unique ID for each toast
 */
const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9);
};

/**
 * Add a toast notification
 * @param message Toast message text
 * @param type Toast type: success, error, info, warning
 * @param duration Duration in milliseconds (default: 3000ms, set to 0 for persistent toast)
 * @returns The ID of the created toast
 */
export const addToast = (message: string, type: ToastType = 'info', duration: number = 3000): string => {
  const id = generateId();
  
  const toast: Toast = {
    id,
    message,
    type,
    duration,
    timestamp: Date.now(),
  };
  
  toastState.toasts.push(toast);
  
  // Auto-remove toast after duration (if duration > 0)
  if (duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }
  
  return id;
};

/**
 * Remove a toast notification by ID
 * @param id Toast ID to remove
 */
export const removeToast = (id: string): void => {
  const index = toastState.toasts.findIndex(toast => toast.id === id);
  if (index !== -1) {
    toastState.toasts.splice(index, 1);
  }
};

/**
 * Clear all toasts
 */
export const clearToasts = (): void => {
  toastState.toasts = [];
};

/**
 * Convenience method to add a success toast
 * @param message Toast message text
 * @param duration Duration in milliseconds (default: 3000ms)
 * @returns The ID of the created toast
 */
export const success = (message: string, duration: number = 3000): string => {
  return addToast(message, 'success', duration);
};

/**
 * Convenience method to add an error toast
 * @param message Toast message text
 * @param duration Duration in milliseconds (default: 5000ms - longer for errors)
 * @returns The ID of the created toast
 */
export const error = (message: string, duration: number = 5000): string => {
  return addToast(message, 'error', duration);
};

/**
 * Convenience method to add an info toast
 * @param message Toast message text
 * @param duration Duration in milliseconds (default: 3000ms)
 * @returns The ID of the created toast
 */
export const info = (message: string, duration: number = 3000): string => {
  return addToast(message, 'info', duration);
};

/**
 * Convenience method to add a warning toast
 * @param message Toast message text
 * @param duration Duration in milliseconds (default: 4000ms)
 * @returns The ID of the created toast
 */
export const warning = (message: string, duration: number = 4000): string => {
  return addToast(message, 'warning', duration);
};

export default {
  // State
  state: toastState,
  
  // Methods
  addToast,
  removeToast,
  clearToasts,
  success,
  error,
  info,
  warning,
};