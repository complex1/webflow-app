<template>
  <div class="theme-toggle">
    <button @click="toggleTheme" class="toggle-button">
      <i :class="currentTheme === 'dark' ? 'pi pi-sun' : 'pi pi-moon'"></i>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import type { ThemeToggleProps, ThemeToggleEmits } from './types';

export default defineComponent({
  name: 'ThemeToggle',
  props: {
    isDark: {
      type: Boolean,
      default: undefined
    }
  },
  emits: ['change'],
  setup(props, { emit }) {
    // Use isDark prop if provided, otherwise check localStorage
    const storedTheme = localStorage.getItem('theme') || 'light';
    const isDarkMode = props.isDark !== undefined ? props.isDark : storedTheme === 'dark';
    const currentTheme = ref(isDarkMode ? 'dark' : 'light');
    
    const applyTheme = () => {
      if (currentTheme.value === 'dark') {
        document.documentElement.classList.add('dark-theme');
      } else {
        document.documentElement.classList.remove('dark-theme');
      }
    };
    
    const toggleTheme = () => {
      currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', currentTheme.value);
      applyTheme();
      emit('change', currentTheme.value === 'dark');
    };
    
    onMounted(() => {
      applyTheme();
    });
    
    return {
      currentTheme,
      toggleTheme
    };
  }
});
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