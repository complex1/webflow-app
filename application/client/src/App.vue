<template>
  <div class="fh fw">
    <router-view></router-view>
    <toast></toast>
    <theme-toggle/>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ThemeToggle from './components/common/themeToggle.vue';
import toast from './lib/toast.vue';

export default defineComponent({
  components: { toast, ThemeToggle },
  name: 'App',
});
</script>

<style>
/* Import PrimeIcons */
@import "primeicons/primeicons.css";

/* Import Manrope font */
@import url("https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap");

/* Global styles */
* {
  box-sizing: border-box;
}

.text-danger {
  color: var(--color-danger) !important;
}

.text-success {
  color: var(--color-success) !important;
}

/* Animation classes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-light);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-secondary);
}
</style>
