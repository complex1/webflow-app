import type * as CommonComponents from '@/components'

declare module 'vue' {
  export interface GlobalComponents extends CommonComponents {}
}

export {}

