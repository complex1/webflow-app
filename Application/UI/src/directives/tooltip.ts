import type { DirectiveBinding } from 'vue'

type TooltipElement = HTMLElement & { __tooltipCleanup__?: () => void }

function createTooltip(text: string) {
  const el = document.createElement('div')
  el.textContent = text
  el.style.position = 'fixed'
  el.style.zIndex = '9999'
  el.style.background = 'var(--bg-elevated)'
  el.style.color = 'var(--text-primary)'
  el.style.border = `1px solid var(--border-default)`
  el.style.padding = '6px 8px'
  el.style.borderRadius = '8px'
  el.style.fontSize = '12px'
  el.style.pointerEvents = 'none'
  el.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25)'
  el.style.transition = 'opacity 120ms ease-out, transform 120ms ease-out'
  el.style.opacity = '0'
  el.style.transform = 'translateY(-4px)'
  document.body.appendChild(el)
  requestAnimationFrame(() => {
    el.style.opacity = '1'
    el.style.transform = 'translateY(0)'
  })
  return el
}

export const tooltipDirective = {
  mounted(el: TooltipElement, binding: DirectiveBinding<string>) {
    const mouseHandler = (event: MouseEvent) => {
      const text = binding.value || el.getAttribute('aria-label') || ''
      if (!text) return

      const tooltip = createTooltip(text)
      const { clientX, clientY } = event
      const offset = 12
      tooltip.style.left = `${clientX + offset}px`
      tooltip.style.top = `${clientY + offset}px`

      const hide = () => {
        tooltip.style.opacity = '0'
        tooltip.style.transform = 'translateY(-4px)'
        setTimeout(() => tooltip.remove(), 120)
        el.removeEventListener('mouseleave', hide)
        el.removeEventListener('blur', hide)
      }

      el.addEventListener('mouseleave', hide)
      el.addEventListener('blur', hide)
    }

    const focusHandler = (_event: FocusEvent) => {
      const text = binding.value || el.getAttribute('aria-label') || ''
      if (!text) return

      const tooltip = createTooltip(text)
      const rect = el.getBoundingClientRect()
      const offset = 12
      tooltip.style.left = `${rect.left + offset}px`
      tooltip.style.top = `${rect.bottom + offset}px`

      const hide = () => {
        tooltip.style.opacity = '0'
        tooltip.style.transform = 'translateY(-4px)'
        setTimeout(() => tooltip.remove(), 120)
        el.removeEventListener('blur', hide)
      }

      el.addEventListener('blur', hide)
    }

    el.addEventListener('mouseenter', mouseHandler)
    el.addEventListener('focus', focusHandler)

    el.__tooltipCleanup__ = () => {
      el.removeEventListener('mouseenter', mouseHandler)
      el.removeEventListener('focus', focusHandler)
    }
  },
  unmounted(el: TooltipElement) {
    el.__tooltipCleanup__?.()
  }
}
