interface AlertOptions {
  title?: string
  message: string
  type?: 'success' | 'error' | 'warning' | 'info' | 'confirm'
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  closable?: boolean
  icon?: string
  html?: boolean
}

interface Alert {
  id: string
  options: AlertOptions
  element: HTMLElement
  overlay: HTMLElement
}

class AlertManager {
  private alerts: Alert[] = []

  private createOverlay(): HTMLElement {
    const overlay = document.createElement('div')
    overlay.className = 'ui-alert-overlay'
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.3s ease;
    `
    return overlay
  }

  private createAlertElement(options: AlertOptions): HTMLElement {
    const alert = document.createElement('div')
    alert.className = `ui-alert ui-alert--${options.type || 'info'}`
    
    const icon = options.icon || this.getDefaultIcon(options.type || 'info')
    const isConfirm = options.type === 'confirm'
    
    const buttons = isConfirm ? `
      <div class="ui-alert-buttons">
        <button class="ui-alert-button ui-alert-button--cancel" data-action="cancel">
          ${options.cancelText || 'Cancel'}
        </button>
        <button class="ui-alert-button ui-alert-button--confirm" data-action="confirm">
          ${options.confirmText || 'Confirm'}
        </button>
      </div>
    ` : `
      <div class="ui-alert-buttons">
        <button class="ui-alert-button ui-alert-button--primary" data-action="ok">
          OK
        </button>
      </div>
    `

    const closeButton = options.closable !== false ? `
      <button class="ui-alert-close" data-action="close">
        <i class="fas fa-times"></i>
      </button>
    ` : ''

    alert.innerHTML = `
      <div class="ui-alert-content">
        <div class="ui-alert-icon">
          <i class="${icon}"></i>
        </div>
        <div class="ui-alert-body">
          ${options.title ? `<div class="ui-alert-title">${options.title}</div>` : ''}
          <div class="ui-alert-message">${options.html ? options.message : this.escapeHtml(options.message)}</div>
        </div>
        ${closeButton}
      </div>
      ${buttons}
    `

    alert.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.9);
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      max-width: 400px;
      min-width: 320px;
      z-index: 10000;
      opacity: 0;
      transition: all 0.3s ease;
    `

    return alert
  }

  private getDefaultIcon(type: string): string {
    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle',
      confirm: 'fas fa-question-circle'
    }
    return icons[type as keyof typeof icons] || icons.info
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  private addAlertStyles() {
    if (document.getElementById('ui-alert-styles')) return

    const styles = document.createElement('style')
    styles.id = 'ui-alert-styles'
    styles.textContent = `
      .ui-alert {
        display: flex;
        flex-direction: column;
        padding: 24px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .ui-alert--success .ui-alert-icon { color: #4CAF50; }
      .ui-alert--error .ui-alert-icon { color: #F44336; }
      .ui-alert--warning .ui-alert-icon { color: #FF9800; }
      .ui-alert--info .ui-alert-icon { color: #2196F3; }
      .ui-alert--confirm .ui-alert-icon { color: #FF9800; }

      .ui-alert-content {
        display: flex;
        align-items: flex-start;
        margin-bottom: 20px;
      }

      .ui-alert-icon {
        margin-right: 16px;
        margin-top: 2px;
        font-size: 24px;
        flex-shrink: 0;
      }

      .ui-alert-body { flex: 1; }
      .ui-alert-title {
        font-weight: 600;
        font-size: 18px;
        margin-bottom: 8px;
        line-height: 1.4;
        color: #1D1D1F;
      }
      .ui-alert-message {
        font-size: 16px;
        line-height: 1.5;
        color: #666;
      }

      .ui-alert-close {
        position: absolute;
        top: 16px;
        right: 16px;
        background: none;
        border: none;
        color: #999;
        cursor: pointer;
        font-size: 16px;
        padding: 4px;
        transition: color 0.2s ease;
      }
      .ui-alert-close:hover { color: #666; }

      .ui-alert-buttons {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      }

      .ui-alert-button {
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        padding: 10px 20px;
        transition: all 0.2s ease;
        min-width: 80px;
      }

      .ui-alert-button--cancel {
        background: #f5f5f5;
        color: #666;
      }
      .ui-alert-button--cancel:hover { background: #e0e0e0; }

      .ui-alert-button--confirm,
      .ui-alert-button--primary {
        background: #007AFF;
        color: white;
      }
      .ui-alert-button--confirm:hover,
      .ui-alert-button--primary:hover {
        background: #0056CC;
      }

      .ui-alert.show {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
      .ui-alert-overlay.show { opacity: 1; }
    `
    document.head.appendChild(styles)
  }

  show(options: AlertOptions): Promise<boolean> {
    this.addAlertStyles()
    document.body.style.overflow = "hidden" // disable background scroll
    
    const id = `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const overlay = this.createOverlay()
    const element = this.createAlertElement(options)
    
    // Add directly to body
    document.body.appendChild(overlay)
    document.body.appendChild(element)
    
    // Animate in
    requestAnimationFrame(() => {
      overlay.style.opacity = '1'
      element.style.opacity = '1'
      element.style.transform = 'translate(-50%, -50%) scale(1)'
    })
    
    // Store alert
    const alert: Alert = { id, options, element, overlay }
    this.alerts.push(alert)
    
    // Return promise
    return new Promise((resolve) => {
      const handleAction = (action: string) => {
        this.remove(id)
        
        if (action === 'confirm' && options.onConfirm) options.onConfirm()
        else if (action === 'cancel' && options.onCancel) options.onCancel()
        
        resolve(action === 'confirm' || action === 'ok')
      }
      
      // Click listeners
      element.addEventListener('click', (e) => {
        const target = e.target as HTMLElement
        const action = target.getAttribute('data-action')
        if (action) handleAction(action)
      })
      
      // Overlay click closes
      overlay.addEventListener('click', () => {
        if (options.closable !== false) handleAction('cancel')
      })
      
      // Escape key closes
      const handleKeydown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && options.closable !== false) {
          handleAction('cancel')
          document.removeEventListener('keydown', handleKeydown)
        }
      }
      document.addEventListener('keydown', handleKeydown)
    })
  }

  private remove(id: string) {
    const alertIndex = this.alerts.findIndex(a => a.id === id)
    if (alertIndex === -1) return
    
    const alert = this.alerts[alertIndex]
    if (!alert) return
    
    // Animate out
    alert.overlay.style.opacity = '0'
    alert.element.style.opacity = '0'
    alert.element.style.transform = 'translate(-50%, -50%) scale(0.9)'
    
    setTimeout(() => {
      alert.overlay.remove()
      alert.element.remove()
      this.alerts.splice(alertIndex, 1)

      // Restore body scroll if no alerts left
      if (this.alerts.length === 0) {
        document.body.style.overflow = ""
      }
    }, 300)
  }

  clear() {
    this.alerts.forEach(alert => {
      alert.overlay.remove()
      alert.element.remove()
    })
    this.alerts = []
    document.body.style.overflow = ""
  }
}

// Global instance
const alertManager = new AlertManager()

// Export API
export const alert = {
  success: (message: string, options?: Partial<AlertOptions>) => 
    alertManager.show({ ...options, message, type: 'success' }),
  
  error: (message: string, options?: Partial<AlertOptions>) => 
    alertManager.show({ ...options, message, type: 'error' }),
  
  warning: (message: string, options?: Partial<AlertOptions>) => 
    alertManager.show({ ...options, message, type: 'warning' }),
  
  info: (message: string, options?: Partial<AlertOptions>) => 
    alertManager.show({ ...options, message, type: 'info' }),
  
  confirm: (message: string, options?: Partial<AlertOptions>) => 
    alertManager.show({ ...options, message, type: 'confirm' }),
  
  show: (options: AlertOptions) => alertManager.show(options),
  clear: () => alertManager.clear()
}

export default alert
