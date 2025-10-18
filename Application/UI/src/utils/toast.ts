interface ToastOptions {
  title?: string
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
  closable?: boolean
  icon?: string
  action?: {
    label: string
    handler: () => void
  }
}

interface Toast {
  id: string
  options: ToastOptions
  element: HTMLElement
  timer?: number
}

class ToastManager {
  private toasts: Toast[] = []
  private container: HTMLElement | null = null

  constructor() {
    this.createContainer()
  }

  private createContainer() {
    let container = document.getElementById('ui-toast-container')
    if (!container) {
      container = document.createElement('div')
      container.id = 'ui-toast-container'
      document.body.appendChild(container)
    }
    this.container = container
  }

  private getPositionStyles(position: string) {
    const styles: Record<string, string> = {
      'top-right': 'top:1rem; right:1rem;',
      'top-left': 'top:1rem; left:1rem;',
      'bottom-right': 'bottom:1rem; right:1rem;',
      'bottom-left': 'bottom:1rem; left:1rem;',
      'top-center': 'top:1rem; left:50%; transform:translateX(-50%);',
      'bottom-center': 'bottom:1rem; left:50%; transform:translateX(-50%);',
    }
    return styles[position] || styles['top-right']
  }

  private createToastElement(options: ToastOptions): HTMLElement {
    const el = document.createElement('div')
    el.className = `ui-toast ui-toast-${options.type || 'info'}`
    el.innerHTML = `
      <div class="ui-toast-icon">
        <i class="${options.icon || this.getDefaultIcon(options.type || 'info')}"></i>
      </div>
      <div class="ui-toast-content">
        ${options.title ? `<div class="ui-toast-title">${options.title}</div>` : ''}
        <div class="ui-toast-message">${options.message}</div>
      </div>
      <div class="ui-toast-actions">
        ${options.action ? `<button class="ui-toast-action">${options.action.label}</button>` : ''}
        ${options.closable !== false ? `<button class="ui-toast-close">&times;</button>` : ''}
      </div>
    `

    // Action button handler
    if (options.action) {
      const actionBtn = el.querySelector('.ui-toast-action') as HTMLButtonElement
      actionBtn.addEventListener('click', () => options.action?.handler())
    }

    // Close button handler
    const closeBtn = el.querySelector('.ui-toast-close')
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.remove(el.dataset.id!)
      })
    }

    return el
  }

  private getDefaultIcon(type: string): string {
    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle'
    }
    return icons[type as keyof typeof icons] || icons.info
  }

  private addToastStyles() {
    if (document.getElementById('ui-toast-styles')) return

    const style = document.createElement('style')
    style.id = 'ui-toast-styles'
    style.textContent = `
      #ui-toast-container {
        position: fixed;
        z-index: 9999;
        pointer-events: none;
      }
      .ui-toast {
        display: flex;
        align-items: center;
        background: #fff;
        border-radius: 6px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        padding: 0.75rem 1rem;
        margin: 0.5rem 0;
        min-width: 250px;
        max-width: 350px;
        pointer-events: auto;
        animation: fadeIn 0.3s ease;
      }
      .ui-toast-icon {
        margin-right: 0.75rem;
        font-size: 1.2rem;
      }
      .ui-toast-content {
        flex: 1;
      }
      .ui-toast-title {
        font-weight: 600;
        margin-bottom: 0.25rem;
      }
      .ui-toast-message {
        font-size: 0.9rem;
      }
      .ui-toast-actions {
        display: flex;
        gap: 0.25rem;
        margin-left: 0.5rem;
      }
      .ui-toast-close {
        border: none;
        background: transparent;
        font-size: 1.2rem;
        cursor: pointer;
        line-height: 1;
      }
      .ui-toast-action {
        border: none;
        background: #007bff;
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.8rem;
      }
      .ui-toast-success { border-left: 4px solid #28a745; }
      .ui-toast-error { border-left: 4px solid #dc3545; }
      .ui-toast-warning { border-left: 4px solid #ffc107; }
      .ui-toast-info { border-left: 4px solid #17a2b8; }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(10px);} to {opacity:1; transform:translateY(0);} }
      @keyframes fadeOut { from { opacity: 1;} to {opacity:0; transform: translateY(10px);} }
    `
    document.head.appendChild(style)
  }

  show(options: ToastOptions): string {
    this.addToastStyles()

    const id = Math.random().toString(36).substr(2, 9)
    const toastEl = this.createToastElement(options)
    toastEl.dataset.id = id

    if (this.container) {
      this.container.setAttribute('style', this.getPositionStyles(options.position ?? 'top-right') as string)
      this.container.appendChild(toastEl)
    }

    const toast: Toast = { id, options, element: toastEl }
    this.toasts.push(toast)

    if (options.duration !== 0) {
      toast.timer = window.setTimeout(() => this.remove(id), options.duration || 3000)
    }

    return id
  }

  remove(id: string) {
    const index = this.toasts.findIndex(t => t.id === id)
    if (index !== -1 && this.container) {
      const toast = this.toasts[index]
      if (!toast) return
      toast.element.style.animation = 'fadeOut 0.3s ease forwards'
      setTimeout(() => {
        toast.element.remove()
        this.toasts.splice(index, 1)
      }, 300)
    }
  }

  clear() {
    this.toasts.forEach(t => t.element.remove())
    this.toasts = []
  }
}

// Create global instance
const toastManager = new ToastManager()

// Export functions
export const toast = {
  success: (message: string, options?: Partial<ToastOptions>) => 
    toastManager.show({ ...options, message, type: 'success' }),
  
  error: (message: string, options?: Partial<ToastOptions>) => 
    toastManager.show({ ...options, message, type: 'error' }),
  
  warning: (message: string, options?: Partial<ToastOptions>) => 
    toastManager.show({ ...options, message, type: 'warning' }),
  
  info: (message: string, options?: Partial<ToastOptions>) => 
    toastManager.show({ ...options, message, type: 'info' }),
  
  show: (options: ToastOptions) => toastManager.show(options),
  remove: (id: string) => toastManager.remove(id),
  clear: () => toastManager.clear()
}

export default toast
