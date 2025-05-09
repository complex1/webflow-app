<template>
  <div class="theme-toggle">
    <button @click="toggleTheme" class="toggle-button">
      <i :class="currentTheme === 'dark' ? 'pi pi-sun' : 'pi pi-moon'"></i>
    </button>
  </div>
</template>

<script>
export default {
  name: 'ThemeToggle',
  data() {
    return {
      currentTheme: localStorage.getItem('theme') || 'light'
    }
  },
  methods: {
    toggleTheme() {
      this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', this.currentTheme)
      this.applyTheme()
    },
    applyTheme() {
      if (this.currentTheme === 'dark') {
        document.documentElement.classList.add('dark-theme')
      } else {
        document.documentElement.classList.remove('dark-theme')
      }
    }
  },
  mounted() {
    this.applyTheme()
  }
}
</script>

<style scoped>
.theme-toggle {
  display: inline-block;
}

.toggle-button {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 18pt;
  color: var(--color-text-primary);
  padding: 3pt;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.toggle-button:hover {
  background-color: var(--color-light);
}
</style>