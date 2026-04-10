import { defineStore } from 'pinia'

export type ThemeMode = 'dark' | 'light'

const STORAGE_KEY = 'af_theme'

const applyThemeToDocument = (mode: ThemeMode) => {
  if (typeof document === 'undefined') return
  if (mode === 'light') {
    document.documentElement.setAttribute('data-theme', 'light')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
}

export const useThemeStore = defineStore('theme', {
  state: () => ({
    mode: 'dark' as ThemeMode,
  }),
  getters: {
    isDarkTheme: (state) => state.mode === 'dark',
    isLightTheme: (state) => state.mode === 'light',
  },
  actions: {
    init() {
      const stored = (localStorage.getItem(STORAGE_KEY) as ThemeMode | null) || 'dark'
      this.mode = stored
      applyThemeToDocument(stored)
    },
    setTheme(mode: ThemeMode) {
      this.mode = mode
      localStorage.setItem(STORAGE_KEY, mode)
      applyThemeToDocument(mode)
    },
    toggle() {
      this.setTheme(this.mode === 'dark' ? 'light' : 'dark')
    }
  }
})
