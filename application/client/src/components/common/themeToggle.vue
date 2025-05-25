<template>
  <div class="theme-toggle" :class="{ 'expanded': isHovered }">
    <button 
      @click="toggleTheme" 
      class="toggle-button"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      :title="`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`"
    >
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
    const isHovered = ref(false);
    
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
      toggleTheme,
      isHovered
    };
  }
});
</script>

<style scoped>
.theme-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.toggle-button {
  background: var(--color-primary);
  border: none;
  cursor: pointer;
  font-size: 18pt;
  color: #ffffff;
  padding: 12px;
  border-radius: 50%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  opacity: 0.9;
}

.toggle-button:hover {
  opacity: 1;
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(var(--color-primary-rgb), 0.4);
}

/* Animation for the button */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--color-primary-rgb), 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(var(--color-primary-rgb), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--color-primary-rgb), 0);
  }
}

.expanded .toggle-button {
  animation: pulse 1.5s infinite;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .theme-toggle {
    bottom: 15px;
    right: 15px;
  }
  
  .toggle-button {
    width: 45px;
    height: 45px;
    font-size: 16pt;
  }
}
</style>