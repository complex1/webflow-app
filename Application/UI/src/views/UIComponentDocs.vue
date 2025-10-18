<template>
  <div class="ui-component-docs">
    <div class="docs-header">
      <h1>API Flux Component Library</h1>
      <p>Complete documentation with code examples for all UI components</p>
    </div>

    <div class="docs-content">
      <!-- Buttons Documentation -->
      <section class="component-section">
        <h2>UiButton</h2>
        <p class="component-description">
          Versatile button component with multiple variants, sizes, and states. Supports icons, loading states, and full customization.
        </p>
        
        <div class="component-demo">
          <h3>Variants</h3>
          <div class="demo-grid">
            <UiButton variant="primary">Primary</UiButton>
            <UiButton variant="secondary">Secondary</UiButton>
            <UiButton variant="success">Success</UiButton>
            <UiButton variant="warning">Warning</UiButton>
            <UiButton variant="error">Error</UiButton>
            <UiButton variant="ghost">Ghost</UiButton>
            <UiButton variant="link">Link</UiButton>
          </div>
        </div>

        <div class="code-example">
          <h4>Basic Usage</h4>
          <pre><code>&lt;UiButton variant="primary" @click="handleClick"&gt;
  Click me
&lt;/UiButton&gt;</code></pre>
        </div>

        <div class="code-example">
          <h4>With Icon</h4>
          <pre><code>&lt;UiButton variant="success" left-icon="check"&gt;
  Success
&lt;/UiButton&gt;</code></pre>
        </div>

        <div class="code-example">
          <h4>Loading State</h4>
          <pre><code>&lt;UiButton variant="primary" :loading="isLoading"&gt;
  {{ isLoading ? 'Loading...' : 'Submit' }}
&lt;/UiButton&gt;</code></pre>
        </div>

        <div class="props-table">
          <h4>Props</h4>
          <table>
            <thead>
              <tr>
                <th>Prop</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>variant</td><td>string</td><td>'primary'</td><td>Button style variant</td></tr>
              <tr><td>size</td><td>string</td><td>'md'</td><td>Button size (xs, sm, md, lg, xl)</td></tr>
              <tr><td>loading</td><td>boolean</td><td>false</td><td>Show loading spinner</td></tr>
              <tr><td>disabled</td><td>boolean</td><td>false</td><td>Disable button</td></tr>
              <tr><td>fullWidth</td><td>boolean</td><td>false</td><td>Make button full width</td></tr>
              <tr><td>leftIcon</td><td>string</td><td>-</td><td>Font Awesome icon class</td></tr>
              <tr><td>rightIcon</td><td>string</td><td>-</td><td>Font Awesome icon class</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Input Documentation -->
      <section class="component-section">
        <h2>UiInput</h2>
        <p class="component-description">
          Flexible input component with validation states, icons, and multiple input types. Supports hints, errors, and custom styling.
        </p>
        
        <div class="component-demo">
          <h3>Input Types</h3>
          <div class="demo-grid">
            <UiInput v-model="inputValue" label="Text Input" placeholder="Enter text..." />
            <UiInput v-model="emailValue" type="email" label="Email" placeholder="Enter email..." />
            <UiInput v-model="passwordValue" type="password" label="Password" placeholder="Enter password..." />
            <UiInput v-model="searchValue" type="search" label="Search" placeholder="Search..." />
          </div>
        </div>

        <div class="component-demo">
          <h3>With Icons</h3>
          <div class="demo-grid">
            <UiInput v-model="iconValue" label="With Left Icon" left-icon="user" placeholder="Username..." />
            <UiInput v-model="iconValue2" label="With Right Icon" right-icon="eye" placeholder="Password..." />
          </div>
        </div>

        <div class="code-example">
          <h4>Basic Usage</h4>
          <pre><code>&lt;UiInput 
  v-model="value" 
  label="Email Address" 
  type="email" 
  placeholder="Enter your email..."
  hint="We'll never share your email"
/&gt;</code></pre>
        </div>

        <div class="code-example">
          <h4>With Validation</h4>
          <pre><code>&lt;UiInput 
  v-model="email" 
  label="Email" 
  type="email"
  :error="emailError"
  :error-message="emailErrorMessage"
/&gt;</code></pre>
        </div>

        <div class="props-table">
          <h4>Props</h4>
          <table>
            <thead>
              <tr>
                <th>Prop</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>modelValue</td><td>string</td><td>-</td><td>Input value (v-model)</td></tr>
              <tr><td>type</td><td>string</td><td>'text'</td><td>Input type (text, email, password, etc.)</td></tr>
              <tr><td>label</td><td>string</td><td>-</td><td>Input label</td></tr>
              <tr><td>placeholder</td><td>string</td><td>-</td><td>Placeholder text</td></tr>
              <tr><td>hint</td><td>string</td><td>-</td><td>Helper text</td></tr>
              <tr><td>error</td><td>boolean</td><td>false</td><td>Show error state</td></tr>
              <tr><td>errorMessage</td><td>string</td><td>-</td><td>Error message</td></tr>
              <tr><td>disabled</td><td>boolean</td><td>false</td><td>Disable input</td></tr>
              <tr><td>leftIcon</td><td>string</td><td>-</td><td>Font Awesome icon class</td></tr>
              <tr><td>rightIcon</td><td>string</td><td>-</td><td>Font Awesome icon class</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Card Documentation -->
      <section class="component-section">
        <h2>UiCard</h2>
        <p class="component-description">
          Flexible card component for displaying content with headers, bodies, and footers. Supports multiple variants and hover effects.
        </p>
        
        <div class="component-demo">
          <h3>Card Variants</h3>
          <div class="demo-grid">
            <UiCard title="Default Card" subtitle="This is a default card">
              <p>Card content goes here.</p>
            </UiCard>
            
            <UiCard variant="elevated" title="Elevated Card" hoverable>
              <p>This card has elevation and hover effects.</p>
            </UiCard>
            
            <UiCard variant="outlined" title="Outlined Card">
              <p>This card has an outlined border.</p>
            </UiCard>
            
            <UiCard variant="filled" title="Filled Card">
              <p>This card has a filled background.</p>
            </UiCard>
          </div>
        </div>

        <div class="code-example">
          <h4>Basic Usage</h4>
          <pre><code>&lt;UiCard title="Card Title" subtitle="Subtitle"&gt;
  &lt;p&gt;Card content goes here.&lt;/p&gt;
&lt;/UiCard&gt;</code></pre>
        </div>

        <div class="code-example">
          <h4>With Slots</h4>
          <pre><code>&lt;UiCard title="Advanced Card"&gt;
  &lt;template #header&gt;
    &lt;h3&gt;Custom Header&lt;/h3&gt;
  &lt;/template&gt;
  
  &lt;p&gt;Card body content.&lt;/p&gt;
  
  &lt;template #footer&gt;
    &lt;UiButton variant="primary"&gt;Action&lt;/UiButton&gt;
  &lt;/template&gt;
&lt;/UiCard&gt;</code></pre>
        </div>

        <div class="props-table">
          <h4>Props</h4>
          <table>
            <thead>
              <tr>
                <th>Prop</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>title</td><td>string</td><td>-</td><td>Card title</td></tr>
              <tr><td>subtitle</td><td>string</td><td>-</td><td>Card subtitle</td></tr>
              <tr><td>variant</td><td>string</td><td>'default'</td><td>Card style variant</td></tr>
              <tr><td>size</td><td>string</td><td>'md'</td><td>Card size (sm, md, lg)</td></tr>
              <tr><td>hoverable</td><td>boolean</td><td>false</td><td>Add hover effects</td></tr>
              <tr><td>clickable</td><td>boolean</td><td>false</td><td>Make card clickable</td></tr>
              <tr><td>loading</td><td>boolean</td><td>false</td><td>Show loading state</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Alert Documentation -->
      <section class="component-section">
        <h2>UiAlert</h2>
        <p class="component-description">
          Alert component for displaying important messages with different types and dismissible functionality.
        </p>
        
        <div class="component-demo">
          <h3>Alert Types</h3>
          <div class="demo-grid">
            <UiAlert type="success" title="Success!" dismissible>
              Operation completed successfully!
            </UiAlert>
            
            <UiAlert type="error" title="Error!" dismissible>
              Something went wrong. Please try again.
            </UiAlert>
            
            <UiAlert type="warning" title="Warning!" dismissible>
              Please check your input before proceeding.
            </UiAlert>
            
            <UiAlert type="info" title="Information" dismissible>
              Here's some useful information for you.
            </UiAlert>
          </div>
        </div>

        <div class="code-example">
          <h4>Basic Usage</h4>
          <pre><code>&lt;UiAlert type="success" title="Success!" dismissible&gt;
  Operation completed successfully!
&lt;/UiAlert&gt;</code></pre>
        </div>

        <div class="code-example">
          <h4>Auto-dismiss</h4>
          <pre><code>&lt;UiAlert 
  type="info" 
  :auto-dismiss="5000"
  @dismiss="handleDismiss"
&gt;
  This alert will auto-dismiss in 5 seconds.
&lt;/UiAlert&gt;</code></pre>
        </div>

        <div class="props-table">
          <h4>Props</h4>
          <table>
            <thead>
              <tr>
                <th>Prop</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>type</td><td>string</td><td>'info'</td><td>Alert type (success, error, warning, info)</td></tr>
              <tr><td>title</td><td>string</td><td>-</td><td>Alert title</td></tr>
              <tr><td>dismissible</td><td>boolean</td><td>false</td><td>Show dismiss button</td></tr>
              <tr><td>autoDismiss</td><td>number</td><td>-</td><td>Auto-dismiss delay in ms</td></tr>
              <tr><td>variant</td><td>string</td><td>'default'</td><td>Alert style variant</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Modal Documentation -->
      <section class="component-section">
        <h2>UiModal</h2>
        <p class="component-description">
          Modal component for displaying content in an overlay. Supports different sizes, backdrop blur, and keyboard navigation.
        </p>
        
        <div class="component-demo">
          <h3>Modal Sizes</h3>
          <div class="demo-grid">
            <UiButton @click="showSmallModal = true">Small Modal</UiButton>
            <UiButton @click="showMediumModal = true">Medium Modal</UiButton>
            <UiButton @click="showLargeModal = true">Large Modal</UiButton>
          </div>
        </div>

        <div class="code-example">
          <h4>Basic Usage</h4>
          <pre><code>&lt;UiModal v-model:visible="showModal" title="Modal Title"&gt;
  &lt;p&gt;Modal content goes here.&lt;/p&gt;
&lt;/UiModal&gt;</code></pre>
        </div>

        <div class="code-example">
          <h4>With Custom Footer</h4>
          <pre><code>&lt;UiModal v-model:visible="showModal" title="Confirm Action"&gt;
  &lt;p&gt;Are you sure you want to proceed?&lt;/p&gt;
  
  &lt;template #footer&gt;
    &lt;UiButton variant="ghost" @click="showModal = false"&gt;Cancel&lt;/UiButton&gt;
    &lt;UiButton variant="primary" @click="confirmAction"&gt;Confirm&lt;/UiButton&gt;
  &lt;/template&gt;
&lt;/UiModal&gt;</code></pre>
        </div>

        <div class="props-table">
          <h4>Props</h4>
          <table>
            <thead>
              <tr>
                <th>Prop</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>visible</td><td>boolean</td><td>false</td><td>Show/hide modal (v-model)</td></tr>
              <tr><td>title</td><td>string</td><td>-</td><td>Modal title</td></tr>
              <tr><td>size</td><td>string</td><td>'md'</td><td>Modal size (sm, md, lg, xl, full)</td></tr>
              <tr><td>centered</td><td>boolean</td><td>true</td><td>Center modal vertically</td></tr>
              <tr><td>backdrop</td><td>boolean</td><td>true</td><td>Show backdrop</td></tr>
              <tr><td>closeOnBackdrop</td><td>boolean</td><td>true</td><td>Close on backdrop click</td></tr>
              <tr><td>closeOnEscape</td><td>boolean</td><td>true</td><td>Close on escape key</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Drawer Documentation -->
      <section class="component-section">
        <h2>UiDrawer</h2>
        <p class="component-description">
          Drawer component that slides in from different directions. Perfect for sidebars, settings panels, and mobile navigation.
        </p>
        
        <div class="component-demo">
          <h3>Drawer Positions</h3>
          <div class="demo-grid">
            <UiButton @click="showLeftDrawer = true">Left Drawer</UiButton>
            <UiButton @click="showRightDrawer = true">Right Drawer</UiButton>
            <UiButton @click="showTopDrawer = true">Top Drawer</UiButton>
            <UiButton @click="showBottomDrawer = true">Bottom Drawer</UiButton>
          </div>
        </div>

        <div class="code-example">
          <h4>Basic Usage</h4>
          <pre><code>&lt;UiDrawer v-model:visible="showDrawer" title="Settings" position="right"&gt;
  &lt;p&gt;Drawer content goes here.&lt;/p&gt;
&lt;/UiDrawer&gt;</code></pre>
        </div>

        <div class="code-example">
          <h4>With Custom Header</h4>
          <pre><code>&lt;UiDrawer v-model:visible="showDrawer" position="left"&gt;
  &lt;template #header&gt;
    &lt;div class="drawer-header"&gt;
      &lt;h3&gt;Custom Header&lt;/h3&gt;
      &lt;UiButton variant="ghost" @click="showDrawer = false"&gt;
        &lt;i class="fas fa-times"&gt;&lt;/i&gt;
      &lt;/UiButton&gt;
    &lt;/div&gt;
  &lt;/template&gt;
  
  &lt;p&gt;Drawer content.&lt;/p&gt;
&lt;/UiDrawer&gt;</code></pre>
        </div>

        <div class="props-table">
          <h4>Props</h4>
          <table>
            <thead>
              <tr>
                <th>Prop</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>visible</td><td>boolean</td><td>false</td><td>Show/hide drawer (v-model)</td></tr>
              <tr><td>title</td><td>string</td><td>-</td><td>Drawer title</td></tr>
              <tr><td>position</td><td>string</td><td>'right'</td><td>Drawer position (left, right, top, bottom)</td></tr>
              <tr><td>size</td><td>string</td><td>'md'</td><td>Drawer size (sm, md, lg, xl, full)</td></tr>
              <tr><td>overlay</td><td>boolean</td><td>true</td><td>Show overlay</td></tr>
              <tr><td>closeOnOverlay</td><td>boolean</td><td>true</td><td>Close on overlay click</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Breadcrumbs Documentation -->
      <section class="component-section">
        <h2>UiBreadcrumbs</h2>
        <p class="component-description">
          Breadcrumb navigation component for showing the current page location and providing navigation context.
        </p>
        
        <div class="component-demo">
          <h3>Breadcrumb Variants</h3>
          <div class="demo-grid">
            <UiBreadcrumbs :items="breadcrumbItems" @item-click="handleBreadcrumbClick" />
            <UiBreadcrumbs :items="breadcrumbItems" variant="minimal" />
            <UiBreadcrumbs :items="breadcrumbItems" variant="pills" />
          </div>
        </div>

        <div class="code-example">
          <h4>Basic Usage</h4>
          <pre><code>&lt;UiBreadcrumbs 
  :items="breadcrumbItems" 
  @item-click="handleClick"
/&gt;</code></pre>
        </div>

        <div class="code-example">
          <h4>With Custom Separator</h4>
          <pre><code>&lt;UiBreadcrumbs 
  :items="breadcrumbItems"
  separator="&gt;"
  :max-items="3"
/&gt;</code></pre>
        </div>

        <div class="props-table">
          <h4>Props</h4>
          <table>
            <thead>
              <tr>
                <th>Prop</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>items</td><td>array</td><td>[]</td><td>Breadcrumb items</td></tr>
              <tr><td>variant</td><td>string</td><td>'default'</td><td>Breadcrumb style variant</td></tr>
              <tr><td>separator</td><td>string</td><td>'/'</td><td>Item separator</td></tr>
              <tr><td>maxItems</td><td>number</td><td>-</td><td>Maximum items to show</td></tr>
              <tr><td>showHome</td><td>boolean</td><td>true</td><td>Show home button</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Directives Documentation -->
      <section class="component-section">
        <h2>Directives</h2>
        <p class="component-description">
          Custom Vue directives for enhanced user interactions and accessibility.
        </p>
        
        <div class="component-demo">
          <h3>v-tooltip</h3>
          <div class="demo-grid">
            <UiButton v-tooltip="'This is a tooltip'">Hover for Tooltip</UiButton>
            <UiButton v-tooltip="{ content: 'Bottom tooltip', placement: 'bottom' }">Bottom Tooltip</UiButton>
            <UiButton v-tooltip="{ content: 'Click tooltip', trigger: 'click' }">Click Tooltip</UiButton>
          </div>
        </div>

        <div class="code-example">
          <h4>Basic Tooltip</h4>
          <pre><code>&lt;button v-tooltip="'This is a tooltip'"&gt;
  Hover me
&lt;/button&gt;</code></pre>
        </div>

        <div class="code-example">
          <h4>Advanced Tooltip</h4>
          <pre><code>&lt;button v-tooltip="{
  content: 'Custom tooltip',
  placement: 'bottom',
  trigger: 'click',
  delay: 500
}"&gt;
  Advanced Tooltip
&lt;/button&gt;</code></pre>
        </div>

        <div class="component-demo">
          <h3>v-clickOutside</h3>
          <div class="demo-grid">
            <div v-click-outside="handleClickOutside" class="click-outside-demo">
              <p>Click outside this box to trigger the event</p>
            </div>
          </div>
        </div>

        <div class="code-example">
          <h4>Click Outside Directive</h4>
          <pre><code>&lt;div v-click-outside="handleClickOutside"&gt;
  Content that responds to outside clicks
&lt;/div&gt;</code></pre>
        </div>
      </section>

      <!-- Utilities Documentation -->
      <section class="component-section">
        <h2>Utilities</h2>
        <p class="component-description">
          JavaScript utilities for toast notifications and alert dialogs.
        </p>
        
        <div class="component-demo">
          <h3>Toast Notifications</h3>
          <div class="demo-grid">
            <UiButton @click="showSuccessToast">Success Toast</UiButton>
            <UiButton @click="showErrorToast">Error Toast</UiButton>
            <UiButton @click="showWarningToast">Warning Toast</UiButton>
            <UiButton @click="showInfoToast">Info Toast</UiButton>
          </div>
        </div>

        <div class="code-example">
          <h4>Toast Usage</h4>
          <pre><code>import { toast } from '@/utils'

// Basic usage
toast.success('Operation completed!')
toast.error('Something went wrong!')
toast.warning('Please check your input')
toast.info('Here is some information')

// Advanced usage
toast.show({
  title: 'Custom Toast',
  message: 'This is a custom toast',
  type: 'success',
  duration: 5000,
  position: 'top-right',
  action: {
    label: 'Undo',
    handler: () => console.log('Undo clicked')
  }
})</code></pre>
        </div>

        <div class="component-demo">
          <h3>Alert Dialogs</h3>
          <div class="demo-grid">
            <UiButton @click="showSuccessAlert">Success Alert</UiButton>
            <UiButton @click="showErrorAlert">Error Alert</UiButton>
            <UiButton @click="showConfirmAlert">Confirm Alert</UiButton>
          </div>
        </div>

        <div class="code-example">
          <h4>Alert Usage</h4>
          <pre><code>import { alert } from '@/utils'

// Basic alerts
await alert.success('Success message')
await alert.error('Error message')
await alert.warning('Warning message')
await alert.info('Info message')

// Confirm dialog
const confirmed = await alert.confirm('Are you sure?', {
  title: 'Confirm Action',
  confirmText: 'Yes, proceed',
  cancelText: 'Cancel'
})

if (confirmed) {
  // User confirmed
} else {
  // User cancelled
}</code></pre>
        </div>
      </section>
    </div>

    <!-- Modals for Demo -->
    <UiModal v-model:visible="showSmallModal" title="Small Modal" size="sm">
      <p>This is a small modal.</p>
    </UiModal>

    <UiModal v-model:visible="showMediumModal" title="Medium Modal" size="md">
      <p>This is a medium modal.</p>
    </UiModal>

    <UiModal v-model:visible="showLargeModal" title="Large Modal" size="lg">
      <p>This is a large modal.</p>
    </UiModal>

    <!-- Drawers for Demo -->
    <UiDrawer v-model:visible="showLeftDrawer" title="Left Drawer" position="left">
      <p>This drawer slides in from the left.</p>
    </UiDrawer>

    <UiDrawer v-model:visible="showRightDrawer" title="Right Drawer" position="right">
      <p>This drawer slides in from the right.</p>
    </UiDrawer>

    <UiDrawer v-model:visible="showTopDrawer" title="Top Drawer" position="top">
      <p>This drawer slides in from the top.</p>
    </UiDrawer>

    <UiDrawer v-model:visible="showBottomDrawer" title="Bottom Drawer" position="bottom">
      <p>This drawer slides in from the bottom.</p>
    </UiDrawer>

    <!-- Dropdown Z-Index Test Section -->
    <section class="component-section">
      <h2>Dropdown Z-Index Test</h2>
      <p class="component-description">
        Test the Webflow Playground header dropdown to ensure it appears above VueFlow canvas elements.
      </p>
      
      <div class="component-demo">
        <DropdownZIndexTest />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { UiButton, UiInput, UiCard, UiAlert, UiModal, UiDrawer, UiBreadcrumbs } from '@/components'
import { toast, alert } from '@/utils'
import DropdownZIndexTest from '@/components/examples/dropdownZIndexTest.vue'

// Reactive data
const inputValue = ref('')
const emailValue = ref('')
const passwordValue = ref('')
const searchValue = ref('')
const iconValue = ref('')
const isLoading = ref(false)
const iconValue2 = ref('')

// Modal states
const showSmallModal = ref(false)
const showMediumModal = ref(false)
const showLargeModal = ref(false)

// Drawer states
const showLeftDrawer = ref(false)
const showRightDrawer = ref(false)
const showTopDrawer = ref(false)
const showBottomDrawer = ref(false)

// Breadcrumb items
const breadcrumbItems = [
  { text: 'Home', href: '/' },
  { text: 'Components', href: '/components' },
  { text: 'Documentation', href: '/uicomponent' }
]

// Methods
const handleBreadcrumbClick = (item: any, index: number) => {
  console.log('Breadcrumb clicked:', item, index)
  toast.info(`Clicked: ${item.text}`)
}

const handleClickOutside = () => {
  toast.info('Clicked outside!')
}

// Toast methods
const showSuccessToast = () => toast.success('Success toast notification!')
const showErrorToast = () => toast.error('Error toast notification!')
const showWarningToast = () => toast.warning('Warning toast notification!')
const showInfoToast = () => toast.info('Info toast notification!')

// Alert methods
const showSuccessAlert = () => alert.success('Success alert!')
const showErrorAlert = () => alert.error('Error alert!')
const showConfirmAlert = async () => {
  const confirmed = await alert.confirm('Are you sure you want to proceed?', {
    title: 'Confirm Action',
    confirmText: 'Yes, proceed',
    cancelText: 'Cancel'
  })
  
  if (confirmed) {
    toast.success('Action confirmed!')
  } else {
    toast.info('Action cancelled')
  }
}
</script>

<style scoped>
.ui-component-docs {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.docs-header {
  text-align: center;
  margin-bottom: 3rem;
}

.docs-header h1 {
  color: var(--color-primary);
  margin-bottom: 0.5rem;
  font-size: 2.5rem;
}

.docs-header p {
  color: var(--color-text-secondary);
  font-size: 1.125rem;
}

.docs-content {
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

.component-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.component-section h2 {
  color: var(--color-primary);
  margin-bottom: 0.5rem;
  font-size: 2rem;
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: 0.5rem;
}

.component-description {
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
  font-size: 1.125rem;
  line-height: 1.6;
}

.component-demo {
  margin-bottom: 2rem;
}

.component-demo h3 {
  color: var(--color-text-primary);
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.code-example {
  margin-bottom: 2rem;
}

.code-example h4 {
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
  font-size: 1.125rem;
}

.code-example pre {
  background: var(--color-gray-50);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
}

.code-example code {
  color: var(--color-text-primary);
}

.props-table {
  margin-top: 2rem;
}

.props-table h4 {
  color: var(--color-text-primary);
  margin-bottom: 1rem;
  font-size: 1.125rem;
}

.props-table table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.props-table th,
.props-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

.props-table th {
  background: var(--color-gray-50);
  font-weight: 600;
  color: var(--color-text-primary);
}

.props-table td {
  color: var(--color-text-secondary);
}

.props-table tr:last-child td {
  border-bottom: none;
}

.click-outside-demo {
  padding: 2rem;
  background: var(--color-primary-light);
  border: 2px dashed var(--color-primary);
  border-radius: 8px;
  text-align: center;
  color: var(--color-primary);
  font-weight: 500;
}

@media (max-width: 768px) {
  .ui-component-docs {
    padding: 1rem;
  }
  
  .component-section {
    padding: 1.5rem;
  }
  
  .demo-grid {
    grid-template-columns: 1fr;
  }
  
  .docs-header h1 {
    font-size: 2rem;
  }
  
  .component-section h2 {
    font-size: 1.5rem;
  }
}
</style>
