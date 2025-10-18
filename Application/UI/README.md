# API Flux Frontend

A modern Vue 3 + TypeScript frontend for the API Flux application with a custom design system and beautiful UI.

## 🚀 **Features**

### **Technology Stack**
- **Vue 3** with Composition API
- **TypeScript** for type safety
- **Vite** for fast development and building
- **Vue Router** for client-side routing
- **Pinia** for state management
- **Axios** for HTTP requests
- **Font Awesome** for icons

### **Design System**
- **Custom CSS Variables** for consistent theming
- **Component Library** with reusable UI components
- **Responsive Design** with mobile-first approach
- **Accessibility** features built-in
- **Dark Mode** support (future enhancement)

### **Pages & Features**
- ✅ **Authentication** (Login/Register pages)
- ✅ **Dashboard** with stats and quick actions
- ✅ **Layout System** (Header, Sidebar, Footer)
- ✅ **Navigation** with Vue Router
- ✅ **State Management** with Pinia
- ✅ **Custom Components** (Button, Input, Card, Drawer)

## 📁 **Project Structure**

```
src/
├── components/
│   ├── base/              # Base UI components
│   │   ├── UiButton.vue
│   │   ├── UiInput.vue
│   │   ├── UiCard.vue
│   │   └── UiDrawer.vue
│   └── layout/            # Layout components
│       ├── AppHeader.vue
│       ├── AppSidebar.vue
│       ├── AppFooter.vue
│       └── AppLayout.vue
├── views/                 # Page components
│   ├── LoginPage.vue
│   ├── RegisterPage.vue
│   ├── DashboardPage.vue
│   ├── WebFlowsPage.vue
│   ├── EnvFilesPage.vue
│   ├── FilesPage.vue
│   └── NotFoundPage.vue
├── stores/                # Pinia stores
│   └── auth.ts
├── router/                # Vue Router
│   └── index.ts
├── styles/                # Stylesheets
│   └── design-system.css
├── types/                 # TypeScript types
├── utils/                 # Utility functions
├── composables/           # Vue composables
├── App.vue               # Root component
├── main.ts               # Application entry
└── style.css             # Global styles
```

## 🎨 **Design System**

### **Color Palette**
```css
/* Primary Colors */
--color-primary: #2563eb
--color-primary-hover: #1d4ed8
--color-primary-light: #dbeafe

/* Status Colors */
--color-success: #10b981
--color-warning: #f59e0b
--color-error: #ef4444
--color-info: #3b82f6

/* Neutral Colors */
--color-gray-50: #f8fafc
--color-gray-100: #f1f5f9
--color-gray-200: #e2e8f0
--color-gray-300: #cbd5e1
--color-gray-400: #94a3b8
--color-gray-500: #64748b
--color-gray-600: #475569
--color-gray-700: #334155
--color-gray-800: #1e293b
--color-gray-900: #0f172a
```

### **Typography Scale**
- **xs**: 0.75rem (12px)
- **sm**: 0.875rem (14px)
- **base**: 1rem (16px)
- **lg**: 1.125rem (18px)
- **xl**: 1.25rem (20px)
- **2xl**: 1.5rem (24px)
- **3xl**: 1.875rem (30px)
- **4xl**: 2.25rem (36px)

### **Spacing Scale**
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 3rem (48px)
- **3xl**: 4rem (64px)

## 🧩 **Components**

### **Base Components**

#### **UiButton**
```vue
<UiButton 
  variant="primary" 
  size="lg" 
  :loading="false"
  icon="fas fa-plus"
>
  Click Me
</UiButton>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `loading`: boolean
- `icon`: string (Font Awesome class)
- `disabled`: boolean

#### **UiInput**
```vue
<UiInput
  v-model="value"
  type="email"
  label="Email Address"
  placeholder="Enter your email"
  :error="errorMessage"
  icon="fas fa-envelope"
/>
```

**Props:**
- `modelValue`: string | number
- `type`: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
- `label`: string
- `placeholder`: string
- `error`: string
- `helpText`: string
- `icon`: string
- `size`: 'sm' | 'md' | 'lg'

#### **UiCard**
```vue
<UiCard variant="elevated" size="lg">
  <template #header>
    <h3>Card Title</h3>
  </template>
  
  <p>Card content goes here</p>
  
  <template #footer>
    <UiButton>Action</UiButton>
  </template>
</UiCard>
```

**Props:**
- `variant`: 'default' | 'bordered' | 'elevated' | 'flat'
- `size`: 'sm' | 'md' | 'lg'
- `hover`: boolean

#### **UiDrawer**
```vue
<UiDrawer
  v-model:is-open="isOpen"
  title="Settings"
  position="right"
  size="md"
  :closable="true"
>
  <p>Drawer content</p>
</UiDrawer>
```

**Props:**
- `isOpen`: boolean
- `title`: string
- `position`: 'left' | 'right' | 'top' | 'bottom'
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `closable`: boolean
- `closeOnOverlay`: boolean

## 🏗️ **Layout System**

### **AppLayout**
Main application layout with header, sidebar, and footer.

### **AppHeader**
- Brand logo and name
- User avatar and menu
- Mobile menu toggle
- Responsive design

### **AppSidebar**
- Navigation menu
- Collapsible on mobile
- Active route highlighting
- Organized sections

### **AppFooter**
- Simple footer with copyright
- Consistent styling

## 🔐 **Authentication**

### **Auth Store (Pinia)**
```typescript
const authStore = useAuthStore()

// Login
await authStore.login({ email, password })

// Register
await authStore.register({ username, email, password })

// Logout
authStore.logout()

// Check authentication
authStore.isAuthenticated
```

### **Route Guards**
- Protected routes require authentication
- Guest routes redirect authenticated users
- Automatic token validation

## 📱 **Responsive Design**

### **Breakpoints**
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### **Mobile Features**
- Collapsible sidebar
- Touch-friendly interactions
- Optimized spacing
- Responsive typography

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js (v16 or higher)
- npm or yarn

### **Installation**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### **Development Server**
The application runs on `http://localhost:5173`

### **Backend Integration**
The frontend is configured to connect to the backend API at `http://localhost:3000`

## 🎯 **Pages Overview**

### **Authentication Pages**
- **Login**: User sign-in with email/password
- **Register**: User registration with validation

### **Dashboard**
- **Stats Cards**: Web flows, environment files, files, connections
- **Recent Activity**: Timeline of user actions
- **Quick Actions**: Create web flow, manage environments, upload files

### **Feature Pages** (Coming Soon)
- **Web Flows**: API flow management
- **Environment Files**: Configuration management
- **File Manager**: File upload and management

## 🛠️ **Development**

### **Adding New Components**
1. Create component in `src/components/base/`
2. Export from component index
3. Use in views/pages
4. Add to storybook (future)

### **Adding New Pages**
1. Create page in `src/views/`
2. Add route in `src/router/index.ts`
3. Update navigation if needed

### **State Management**
- Use Pinia stores for global state
- Keep component state local when possible
- Use composables for shared logic

## 🎨 **Styling Guidelines**

### **CSS Variables**
Use design system variables for consistency:
```css
color: var(--color-text-primary);
background: var(--color-background);
padding: var(--spacing-md);
border-radius: var(--radius-lg);
```

### **Utility Classes**
Use utility classes for common styles:
```html
<div class="flex items-center gap-md p-lg rounded-lg shadow-md">
```

### **Component Styling**
- Use scoped styles for components
- Follow BEM methodology
- Keep styles modular

## 🔧 **Configuration**

### **Vite Configuration**
- Path aliases configured (`@` → `src/`)
- Development server on port 5173
- TypeScript support

### **TypeScript Configuration**
- Strict mode enabled
- Path mapping configured
- Vue component support

## 📦 **Build & Deployment**

### **Production Build**
```bash
npm run build
```

### **Build Output**
- Optimized JavaScript bundles
- CSS extraction and minification
- Asset optimization
- TypeScript compilation

### **Deployment**
- Static files in `dist/` directory
- Can be deployed to any static hosting
- CDN-friendly asset structure

## 🚀 **Future Enhancements**

### **Planned Features**
- **Dark Mode**: Theme switching
- **PWA Support**: Offline functionality
- **Real-time Updates**: WebSocket integration
- **Advanced Components**: Data tables, charts
- **Testing**: Unit and integration tests
- **Storybook**: Component documentation

### **Performance Optimizations**
- Code splitting
- Lazy loading
- Image optimization
- Bundle analysis

The Vue frontend provides a modern, responsive, and beautiful interface for the API Flux application with a comprehensive design system and component library.