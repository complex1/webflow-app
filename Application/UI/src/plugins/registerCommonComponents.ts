import type { App, Component } from 'vue'
import * as CommonComponents from '@/components'

export const registerCommonComponents = (app: App) => {
  Object.entries(CommonComponents).forEach(([name, component]) => {
    if (component && typeof component === 'object') {
      app.component(name, component as Component)
    }
  })
}
