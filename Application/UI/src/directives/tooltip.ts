import type { Directive, DirectiveBinding } from 'vue'

interface TooltipOptions {
  content: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  trigger?: 'hover' | 'click' | 'focus'
  delay?: number
  theme?: 'light' | 'dark'
  arrow?: boolean
  disabled?: boolean
}

interface TooltipElement extends HTMLElement {
  _tooltip?: {
    element: HTMLElement
    show: () => void
    hide: () => void
    destroy: () => void
  }
}

function addTooltipStyles() {
  if (document.getElementById('ui-tooltip-styles')) return

  const styles = document.createElement('style')
  styles.id = 'ui-tooltip-styles'
  styles.textContent = `
    .ui-tooltip {
      position: absolute;
      z-index: var(--z-tooltip, 9998);
      background: #1f2937;
      color: #ffffff;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      line-height: 1.4;
      max-width: 200px;
      word-wrap: break-word;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.2s ease, visibility 0.2s ease;
      pointer-events: none;
    }

    .ui-tooltip.show {
      opacity: 1;
      visibility: visible;
    }

    .ui-tooltip--light {
      background: #ffffff;
      color: #1f2937;
      border: 1px solid #e5e7eb;
    }

    .ui-tooltip--dark {
      background: #1f2937;
      color: #ffffff;
    }

    .ui-tooltip-content {
      position: relative;
    }

    .ui-tooltip-arrow {
      position: absolute;
      width: 0;
      height: 0;
      border: 4px solid transparent;
    }

    .ui-tooltip--top .ui-tooltip-arrow {
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      border-top-color: #1f2937;
    }

    .ui-tooltip--bottom .ui-tooltip-arrow {
      top: -8px;
      left: 50%;
      transform: translateX(-50%);
      border-bottom-color: #1f2937;
    }

    .ui-tooltip--left .ui-tooltip-arrow {
      right: -8px;
      top: 50%;
      transform: translateY(-50%);
      border-left-color: #1f2937;
    }

    .ui-tooltip--right .ui-tooltip-arrow {
      left: -8px;
      top: 50%;
      transform: translateY(-50%);
      border-right-color: #1f2937;
    }

    .ui-tooltip--light.ui-tooltip--top .ui-tooltip-arrow {
      border-top-color: #ffffff;
    }

    .ui-tooltip--light.ui-tooltip--bottom .ui-tooltip-arrow {
      border-bottom-color: #ffffff;
    }

    .ui-tooltip--light.ui-tooltip--left .ui-tooltip-arrow {
      border-left-color: #ffffff;
    }

    .ui-tooltip--light.ui-tooltip--right .ui-tooltip-arrow {
      border-right-color: #ffffff;
    }
  `
  document.head.appendChild(styles)
}

const tooltipDirective: Directive<TooltipElement, TooltipOptions | string> = {
  mounted(el: TooltipElement, binding: DirectiveBinding<TooltipOptions | string>) {
    // Add tooltip styles if not already added
    addTooltipStyles()
    const options = typeof binding.value === 'string' 
      ? { content: binding.value } 
      : binding.value

    const {
      content,
      placement = 'top',
      trigger = 'hover',
      delay = 200,
      theme = 'light',
      arrow = true,
      disabled = false
    } = options

    if (disabled || !content) return

    // Create tooltip element
    const tooltip = document.createElement('div')
    tooltip.className = `ui-tooltip ui-tooltip--${theme} ui-tooltip--${placement}`
    tooltip.innerHTML = `
      ${arrow ? '<div class="ui-tooltip-arrow"></div>' : ''}
      <div class="ui-tooltip-content">${content}</div>
    `
    tooltip.style.cssText = `
      position: absolute;
      z-index: var(--z-tooltip, 9998);
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.2s ease, visibility 0.2s ease;
      pointer-events: none;
    `

    document.body.appendChild(tooltip)

    let showTimeout: number | null = null
    let hideTimeout: number | null = null

    const show = () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout)
        hideTimeout = null
      }

      showTimeout = setTimeout(() => {
        if (showTimeout) {
          clearTimeout(showTimeout)
          showTimeout = null
        }

        updatePosition()
        tooltip.style.opacity = '1'
        tooltip.style.visibility = 'visible'
      }, delay)
    }

    const hide = () => {
      if (showTimeout) {
        clearTimeout(showTimeout)
        showTimeout = null
      }

      hideTimeout = setTimeout(() => {
        if (hideTimeout) {
          clearTimeout(hideTimeout)
          hideTimeout = null
        }

        tooltip.style.opacity = '0'
        tooltip.style.visibility = 'hidden'
      }, 100)
    }

    const updatePosition = () => {
      const rect = el.getBoundingClientRect()
      const tooltipRect = tooltip.getBoundingClientRect()

      let top = 0
      let left = 0

      switch (placement) {
        case 'top':
          top = rect.top - tooltipRect.height - 8
          left = rect.left + rect.width / 2 - tooltipRect.width / 2
          break
        case 'bottom':
          top = rect.bottom + 8
          left = rect.left + rect.width / 2 - tooltipRect.width / 2
          break
        case 'left':
          top = rect.top + rect.height / 2 - tooltipRect.height / 2
          left = rect.left - tooltipRect.width - 8
          break
        case 'right':
          top = rect.top + rect.height / 2 - tooltipRect.height / 2
          left = rect.right + 8
          break
      }

      // Keep tooltip within viewport
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      if (left < 8) left = 8
      if (left + tooltipRect.width > viewportWidth - 8) {
        left = viewportWidth - tooltipRect.width - 8
      }
      if (top < 8) top = 8
      if (top + tooltipRect.height > viewportHeight - 8) {
        top = viewportHeight - tooltipRect.height - 8
      }

      tooltip.style.top = `${top}px`
      tooltip.style.left = `${left}px`
    }

    const handleScroll = () => {
      if (tooltip.style.visibility === 'visible') {
        updatePosition()
      }
    }

    const destroy = () => {
      if (showTimeout) clearTimeout(showTimeout)
      if (hideTimeout) clearTimeout(hideTimeout)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      if (tooltip.parentNode) {
        tooltip.parentNode.removeChild(tooltip)
      }
    }

    // Event listeners
    if (trigger === 'hover') {
      el.addEventListener('mouseenter', show)
      el.addEventListener('mouseleave', hide)
      tooltip.addEventListener('mouseenter', show)
      tooltip.addEventListener('mouseleave', hide)
    } else if (trigger === 'click') {
      el.addEventListener('click', (e) => {
        e.preventDefault()
        if (tooltip.style.visibility === 'visible') {
          hide()
        } else {
          show()
        }
      })
      document.addEventListener('click', (e) => {
        if (!el.contains(e.target as Node) && !tooltip.contains(e.target as Node)) {
          hide()
        }
      })
    } else if (trigger === 'focus') {
      el.addEventListener('focus', show)
      el.addEventListener('blur', hide)
    }

    // Handle window resize
    const handleResize = () => {
      if (tooltip.style.visibility === 'visible') {
        updatePosition()
      }
    }
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll)

    // Store tooltip instance
    el._tooltip = {
      element: tooltip,
      show,
      hide,
      destroy: () => {
        destroy()
        window.removeEventListener('resize', handleResize)
      }
    }
  },

  updated(el: TooltipElement, binding: DirectiveBinding<TooltipOptions | string>) {
    if (el._tooltip) {
      el._tooltip.destroy()
    }
    // Re-mount with new options
    const options = typeof binding.value === 'string' 
      ? { content: binding.value } 
      : binding.value
    
    // Create tooltip element
    const tooltipElement = document.createElement('div')
    tooltipElement.className = 'ui-tooltip'
    tooltipElement.textContent = options.content
    document.body.appendChild(tooltipElement)
    
    // Create tooltip object
    el._tooltip = {
      element: tooltipElement,
      show: () => {
        tooltipElement.classList.add('show')
      },
      hide: () => {
        tooltipElement.classList.remove('show')
      },
      destroy: () => {
        if (tooltipElement.parentNode) {
          tooltipElement.parentNode.removeChild(tooltipElement)
        }
      }
    }
  },

  unmounted(el: TooltipElement) {
    if (el._tooltip) {
      el._tooltip.destroy()
      delete el._tooltip
    }
  }
}

export { tooltipDirective }
export default tooltipDirective
