API Flux

Lets  create a app 
feature 
user flow
	1: user registration (no email verification required)
	2: user login

Env file:
	1: its per user
	2: user can create/update/edit env file 	3: shape of env file		{
			name: string,
			description: string,
			id: string,
			createdAt, updatedAt, userId, 			config: List<{
				key, description, value			}>
		}
Web flow:
	1: it is per user
	2: user can create/update/edit web flow
	3: shape of web flow 
		{
			name, description, id, userId, createdAt, updatedAt, 			icon (any fa icon), tags: List<string>,  
			isFolder: boolean;
			hasOpenApiConfig: boolean;
			openApiConfigType?: 'SERVER' | 'FILE';
  			openApiServerUrl?: string;
  			openApiFileId?: number; 
 			 hasPostmanCollection: boolean;
 			 postmanFileId?: number;
  			basePath?: string;
		}

Link between Env file and web flow (Many to Many):	1: shape: {
		id: number;
  		webFlowId: number;
  		envFileId: number;
  		userId: number;
  		created_at: Date;
  		updated_at: Date;
	}

File upload system:
  	1: user can upload file. 	2: file will save on server folder (document).	3: shape {
  		id: number;
  		name: string;
  		originalName: string;
  		extension: string;
  		size: number;
  		url: string;
  		fileName: string;
  		mimetype?: string;
  		webFlowId?: number;
  		userId: number;
  		createdAt: string;
  		updatedAt: string;
	}


Technology 

Backend: 	1: Node JS + TS
	2:  DB -> initially use sqlite but make to flexible to move to postgress
	3: JWT for  auth
UI:
	1: Vue 3 + ts
	2: fontaswome icon	3: Apple UI + material UI theme (create own custome design system do not use any library)
	4: create custom component library (button, input, alert, drawer, modal, breadcrumbs, card)	5: customs directive (tooltip, clickoutside)	6: js method for toast, alert.	7: pine for state management
	8: vite with devtool
Folder structure: 
	Api-flux-app
		Application
			Common
			Backend
			UI 

User Flow:	1: user will register 	2: user will login	3: when user done login he will land on dashboard page 		dashboard layout 			|                header               |
			——————————————-			|               |				| 
			|		|				|
			|sidebar. |.          main		|
			|		|				|
			|		|				|
			———————————————
			|             footer 			|
			———————————————-
	4: in header (60px) user will have brand name (API flex), and user avatar
	5: sidebar (50px) user will have 2 option web flow and envFIle.
	6: footer only text (50px)
	
	7: in main section render web flow and envfile.
	8: in case of web flow if it is folder do not save links, openAPi, postman related config.
	**For Folders:**
		**View**: Show folder details
		**Edit**: Modify folder properties
		**Open**: Navigate into folder
		**Delete**: Remove folder

	**For Webflows:**
		**View**: Show webflow details
		**Edit**: Modify webflow configuration
		**Delete**: Remove webflow

## 🏗️ Architecture Overview

### System Architecture

### Technology Stack

**Frontend:**
- **Vue.js 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Static type checking and enhanced development experience
- **Vite** - Fast build tool and development server
- **Vue Router** - Client-side routing for SPA navigation
- **Pinia** - State management (if implemented)

**Backend:**
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **TypeScript** - Server-side type safety
- **RESTful API** - Standard HTTP-based API design

**Development Tools:**
- **ESLint** - Code linting and quality
- **Prettier** - Code formatting
- **Husky** - Git hooks for quality gates

## **1. Authentication Pages**
- **LoginPage.vue** ✅
- **RegisterPage.vue** ✅

### **2. Main Application Pages**
- **DashboardPage.vue** ✅ (Already refactored)
- **EnvFilePage.vue** ✅
- **DemoPage.vue** ✅

## 🎯 **Design System Implementation**

### **1. Design System Foundation**
- **File**: `src/styles/design-system.css`
- **Features**:
  - Comprehensive CSS variables for colors, spacing, typography
  - Industry-standard color palette
  - Consistent spacing scale (4px, 8px, 16px, 24px, 32px, 48px, 64px)
  - Typography scale with proper line heights
  - Border radius system
  - Shadow system
  - Transition system
  - Z-index scale
  - Responsive breakpoints

### **2. Page Layout Component**
- **File**: `src/components/layout/PageLayout.vue`
- **Features**:
  - Consistent page structure
  - Header with breadcrumbs and actions
  - Loading states
  - Error states
  - Empty states
  - Footer support
  - Responsive design

### **3. Base UI Components**
- **UiButton.vue** ✅
- **UiInput.vue** ✅
- **UiCard.vue** ✅
- **UiDrawer.vue** ✅
- **UiPagination.vue** ✅

## 🎨 **Design Standards Applied**

### **Color System**
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
```css
--font-size-xs: 0.75rem    /* 12px */
--font-size-sm: 0.875rem   /* 14px */
--font-size-base: 1rem     /* 16px */
--font-size-lg: 1.125rem   /* 18px */
--font-size-xl: 1.25rem    /* 20px */
--font-size-2xl: 1.5rem    /* 24px */
--font-size-3xl: 1.875rem  /* 30px */
--font-size-4xl: 2.25rem   /* 36px */
```

### **Spacing Scale**
```css
--spacing-xs: 0.25rem    /* 4px */
--spacing-sm: 0.5rem     /* 8px */
--spacing-md: 1rem       /* 16px */
--spacing-lg: 1.5rem     /* 24px */
--spacing-xl: 2rem       /* 32px */
--spacing-2xl: 3rem      /* 48px */
--spacing-3xl: 4rem      /* 64px */
```

### **Border Radius System**
```css
--radius-sm: 0.25rem     /* 4px */
--radius-md: 0.375rem    /* 6px */
--radius-lg: 0.5rem      /* 8px */
--radius-xl: 0.75rem     /* 12px */
--radius-2xl: 1rem       /* 16px */
--radius-full: 9999px
```

## 📱 **Responsive Design**

### **Breakpoints**
- **Mobile**: < 640px
- **Tablet**: 640px - 768px
- **Desktop**: 768px - 1024px
- **Large Desktop**: > 1024px

### **Responsive Features**
- Mobile-first approach
- Flexible grid systems
- Adaptive typography
- Touch-friendly interactions
- Optimized spacing for different screen sizes

## 🎯 **Page-Specific Improvements**

### **1. Authentication Pages**
- **Consistent Layout**: Split-screen design with branding and form panels
- **Visual Hierarchy**: Clear typography hierarchy with proper spacing
- **Interactive Elements**: Consistent button styles and form controls
- **Error Handling**: Standardized error display with animations
- **Social Login**: Consistent button styling for social authentication

### **2. Dashboard Page**
- **Already Refactored**: Uses the new component structure
- **Consistent Cards**: Item cards with uniform styling
- **Grid Layout**: Responsive grid system
- **Pagination**: Standardized pagination controls

### **3. Environment Files Page**
- **Page Layout**: Uses the new PageLayout component
- **Empty States**: Consistent empty state design
- **Loading States**: Standardized loading indicators
- **Error Handling**: Unified error display

### **4. Demo Page**
- **Interactive Demo**: Showcases component functionality
- **Code Display**: Syntax-highlighted code blocks
- **Card Layout**: Consistent card design for data display
- **Action Buttons**: Standardized button placement and styling

## 🔧 **Technical Implementation**

### **CSS Architecture**
```
src/styles/
├── design-system.css     # Core design system
├── style.css            # Main stylesheet with imports
└── components/          # Component-specific styles
```

### **Component Structure**
```
src/components/
├── base/                # Base UI components
├── layout/              # Layout components
├── features/            # Feature-specific components
└── common/              # Shared components
```

### **Design Tokens**
- **Colors**: Semantic color system with light/dark mode support
- **Typography**: Consistent font scales and weights
- **Spacing**: 8px grid system for consistent spacing
- **Shadows**: Layered shadow system for depth
- **Transitions**: Consistent animation timing



### **Visual Consistency**
- ✅ **Color Usage**: 100% consistent across all pages
- ✅ **Typography**: Unified font scales and weights
- ✅ **Spacing**: Consistent 8px grid system
- ✅ **Border Radius**: Standardized radius values
- ✅ **Shadows**: Consistent depth system

### **Interactive Consistency**
- ✅ **Button States**: Hover, focus, active states
- ✅ **Form Controls**: Consistent input styling
- ✅ **Loading States**: Standardized loading indicators
- ✅ **Error States**: Unified error display
- ✅ **Empty States**: Consistent empty state design

### **Layout Consistency**
- ✅ **Page Structure**: Consistent header, content, footer
- ✅ **Grid Systems**: Responsive grid layouts
- ✅ **Component Spacing**: Consistent margins and padding
- ✅ **Content Width**: Standardized content containers

## 🚀 **Performance Benefits**

### **CSS Optimization**
- **Reduced Bundle Size**: Shared design system reduces duplicate CSS
- **Better Caching**: Design system CSS can be cached separately
- **Faster Rendering**: Consistent CSS variables improve performance

### **Developer Experience**
- **Faster Development**: Reusable components and utilities
- **Easier Maintenance**: Centralized design system
- **Better Debugging**: Consistent naming conventions
- **Type Safety**: TypeScript integration for design tokens

