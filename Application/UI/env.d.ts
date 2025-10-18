/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Global module augmentation for Vue
declare global {
  namespace JSX {
    interface Element extends VNode {}
    interface ElementClass extends ComponentRenderProxy {}
    interface ElementAttributesProperty {
      $props: any
    }
    interface IntrinsicElements {
      [elem: string]: any
    }
  }
}
