import type { Directive, DirectiveBinding } from 'vue'

interface ClickOutsideElement extends HTMLElement {
  _clickOutside?: {
    handler: (event: Event) => void
    options: boolean | AddEventListenerOptions
  }
}

interface ClickOutsideOptions {
  handler: (event: Event) => void
  exclude?: string[]
  disabled?: boolean
  capture?: boolean
  passive?: boolean
  once?: boolean
}

const clickOutsideDirective: Directive = {
  mounted(el: ClickOutsideElement, binding: DirectiveBinding<ClickOutsideOptions | ((event: Event) => void)>) {
    const options = typeof binding.value === 'function' 
      ? { handler: binding.value } 
      : binding.value

    const {
      handler,
      exclude = [],
      disabled = false,
      capture = false,
      passive = true,
      once = false
    } = options

    if (disabled) return

    const clickHandler = (event: Event) => {
      const target = event.target as HTMLElement

      // Check if click is outside the element
      if (!el.contains(target)) {
        // Check if click is on excluded elements
        const isExcluded = exclude.some(selector => {
          const elements = document.querySelectorAll(selector)
          return Array.from(elements).some(element => element.contains(target))
        })

        if (!isExcluded) {
          handler(event)
        }
      }
    }

    const eventOptions: AddEventListenerOptions = {
      capture,
      passive,
      once
    }

    // Store handler and options for cleanup
    el._clickOutside = {
      handler: clickHandler,
      options: eventOptions
    }

    // Add event listener
    document.addEventListener('click', clickHandler, eventOptions)
  },

  updated(el: ClickOutsideElement, binding: DirectiveBinding<ClickOutsideOptions | ((event: Event) => void)>) {
    // Remove old listener
    if (el._clickOutside) {
      document.removeEventListener('click', el._clickOutside.handler, el._clickOutside.options)
    }

    // Add new listener with updated options
    const options = typeof binding.value === 'function' 
      ? { handler: binding.value } 
      : binding.value

    const {
      handler,
      exclude = [],
      disabled = false,
      capture = false,
      passive = true,
      once = false
    } = options

    if (disabled) return

    const clickHandler = (event: Event) => {
      const target = event.target as HTMLElement

      // Check if click is outside the element
      if (!el.contains(target)) {
        // Check if click is on excluded elements
        const isExcluded = exclude.some(selector => {
          const elements = document.querySelectorAll(selector)
          return Array.from(elements).some(element => element.contains(target))
        })

        if (!isExcluded) {
          handler(event)
        }
      }
    }

    const eventOptions: AddEventListenerOptions = {
      capture,
      passive,
      once
    }

    // Store handler and options for cleanup
    el._clickOutside = {
      handler: clickHandler,
      options: eventOptions
    }

    // Add event listener
    document.addEventListener('click', clickHandler, eventOptions)
  },

  unmounted(el: ClickOutsideElement) {
    if (el._clickOutside) {
      document.removeEventListener('click', el._clickOutside.handler, el._clickOutside.options)
      delete el._clickOutside
    }
  }
}

export { clickOutsideDirective }
export default clickOutsideDirective
