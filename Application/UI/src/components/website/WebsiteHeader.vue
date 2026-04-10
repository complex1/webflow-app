<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/common/buttons/Button.vue'

const isOpen = ref(false)
const navId = 'website-primary-nav'
</script>

<template>
  <header class="topbar">
    <div class="container header-inner">
      <div class="topbar-row">
        <a class="brand" href="#top">
          <ProductLogo :size="28" />
          <span>API Flux</span>
        </a>
        <button
          class="menu-btn"
          type="button"
          :aria-expanded="isOpen"
          :aria-controls="navId"
          aria-label="Toggle navigation"
          @click="isOpen = !isOpen"
        >
          <span class="menu-icon" aria-hidden="true" />
        </button>
        <nav :id="navId" class="nav" :class="{ open: isOpen }" aria-label="Primary">
          <router-link to="/" class="nav-link" @click="isOpen = false">
            Home
          </router-link>
          <router-link to="/docs-open" class="nav-link" @click="isOpen = false">
            Docs
          </router-link>
          <router-link to="/example-playground" class="nav-link" @click="isOpen = false">
            Playground
          </router-link>
          <a
            href="https://github.com/complex1/webflow-app"
            target="_blank"
            rel="noopener noreferrer"
            class="nav-link"
          >
            GitHub
          </a>
          <div class="nav-cta">
            <router-link to="/register" class="cta-wrap" @click="isOpen = false">
              <Button variant="primary" size="sm" icon="user-plus"> Get started </Button>
            </router-link>
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: color-mix(in srgb, var(--bg-secondary) 92%, var(--bg-primary));
  border-bottom: 1px solid var(--border-subtle);
  backdrop-filter: blur(8px);
}

.header-inner {
  max-width: 1200px;
  position: relative;
}

.topbar-row {
  min-height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  letter-spacing: 0.2px;
  font-size: 18px;
  color: var(--text-primary);
  text-decoration: none;
  min-height: 44px;
}

.brand:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
  border-radius: var(--radius-md);
}

.nav {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  justify-content: flex-end;
  flex: 1;
}

.nav-link {
  min-height: 44px;
  padding: 10px 12px;
  border-radius: 10px;
  color: var(--text-secondary);
  transition: background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out);
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  font-size: var(--text-md);
}

.nav-link:hover {
  color: var(--text-primary);
  background: color-mix(in srgb, var(--bg-elevated) 70%, var(--bg-primary));
}

.nav-link.router-link-active {
  color: var(--text-primary);
}

.nav-cta {
  margin-left: 8px;
  display: flex;
  align-items: center;
}

.cta-wrap {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
}

.menu-btn {
  display: none;
  border: 1px solid var(--border-default);
  background: color-mix(in srgb, var(--bg-elevated) 60%, var(--bg-primary));
  color: var(--text-primary);
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  min-height: 44px;
  min-width: 44px;
  align-items: center;
  justify-content: center;
}

.menu-icon {
  width: 18px;
  height: 2px;
  background: var(--text-primary);
  display: block;
  position: relative;
  border-radius: 2px;
}

.menu-icon::before,
.menu-icon::after {
  content: '';
  position: absolute;
  left: 0;
  width: 18px;
  height: 2px;
  background: var(--text-primary);
  border-radius: 2px;
}

.menu-icon::before {
  top: -6px;
}

.menu-icon::after {
  top: 6px;
}

@media (max-width: 980px) {
  .topbar-row {
    flex-direction: column;
    align-items: stretch;
    padding: 12px 0;
  }

  .menu-btn {
    display: inline-flex;
    position: absolute;
    right: 20px;
    top: 12px;
  }

  .nav {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    display: none;
    margin-top: 8px;
  }

  .nav.open {
    display: flex;
  }

  .nav-link {
    width: 100%;
  }

  .nav-cta {
    margin-left: 0;
    margin-top: 8px;
  }

  .cta-wrap {
    width: 100%;
    justify-content: stretch;
  }

  .cta-wrap :deep(.af-button) {
    width: 100%;
    justify-content: center;
  }
}
</style>
