<template>
  <div class="navbar">
    <div class="navbar-brand">
      <router-link to="/" class="logo">
        <i class="pi pi-sitemap"></i>
        <span>Webflow</span>
      </router-link>
    </div>
    <div class="navbar-menu">
      <router-link to="/dashboard" class="navbar-item">
        <i class="pi pi-th-large"></i>
        <span>Dashboard</span>
      </router-link>
      <router-link to="/playground" class="navbar-item">
        <i class="pi pi-code"></i>
        <span>Playground</span>
      </router-link>
    </div>
    <div class="navbar-end">
      <button class="btn btn-primary create-btn" @click="createNewWorkflow">
        <i class="pi pi-plus"></i>
        <span>Create Workflow</span>
      </button>
      <theme-toggle></theme-toggle>
      <div class="user-menu" ref="userMenu">
        <button class="btn btn-icon" @click="toggleUserDropdown">
          <i class="pi pi-user"></i>
        </button>
        <div class="dropdown-menu" v-if="showUserDropdown">
          <div class="dropdown-item user-info">
            <i class="pi pi-user"></i>
            <span>{{ username || 'User' }}</span>
          </div>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" @click="logout">
            <i class="pi pi-sign-out"></i>
            <span>Logout</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import themeToggle from './themeToggle.vue';

export default {
  name: 'navbarComponent',
  components: {
    themeToggle
  },
  data() {
    return {
      showUserDropdown: false,
      username: localStorage.getItem('username') || null
    };
  },
  mounted() {
    // Close dropdown when clicking outside
    document.addEventListener('click', this.handleOutsideClick);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleOutsideClick);
  },
  methods: {
    toggleUserDropdown() {
      this.showUserDropdown = !this.showUserDropdown;
    },
    handleOutsideClick(event) {
      if (this.$refs.userMenu && !this.$refs.userMenu.contains(event.target)) {
        this.showUserDropdown = false;
      }
    },
    createNewWorkflow() {
      this.$router.push('/playground');
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      this.$router.push('/login');
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 var(--spacing-large);
  background-color: var(--color-white);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-drop);
}

.navbar-brand {
  margin-right: var(--spacing-xlarge);
  
  .logo {
    display: flex;
    align-items: center;
    color: var(--color-primary);
    font-size: var(--font-size-large);
    font-weight: bold;
    text-decoration: none;
    
    i {
      margin-right: var(--spacing-small);
      font-size: 24px;
    }
  }
}

.navbar-menu {
  display: flex;
  flex: 1;
  gap: var(--spacing-large);
}

.navbar-item {
  display: flex;
  align-items: center;
  color: var(--color-text-primary);
  text-decoration: none;
  padding: var(--spacing-small) var(--spacing-medium);
  border-radius: 6pt;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--color-light);
  }
  
  &.router-link-active {
    color: var(--color-primary);
    font-weight: bold;
  }
  
  i {
    margin-right: var(--spacing-small);
  }
}

.navbar-end {
  display: flex;
  align-items: center;
  gap: var(--spacing-medium);
}

.create-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-small);
  
  i {
    font-size: 14px;
  }
}

.user-menu {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: var(--spacing-small);
  min-width: 200px;
  background-color: var(--color-white);
  border-radius: 6pt;
  box-shadow: var(--shadow-drop);
  z-index: 100;
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-medium);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--color-light);
  }
  
  i {
    margin-right: var(--spacing-medium);
    width: 16px;
    text-align: center;
  }
}

.user-info {
  font-weight: bold;
  cursor: default;
  
  &:hover {
    background-color: transparent;
  }
}

.dropdown-divider {
  height: 1px;
  background-color: var(--color-border);
  margin: 0;
}
</style>
