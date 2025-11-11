<template>
  <DocsLayout
    title="Dashboard Overview"
    subtitle="Complete guide to using the Webflow Dashboard"
    :breadcrumbs="breadcrumbs"
    :navigation="navigation"
  >
    <!-- Dashboard Introduction -->
    <DocsCard title="What is the Dashboard?" badge="Overview">
      <p class="docs-text">
        The Dashboard is the central hub for managing your API collections and workflows. 
        It provides an organized workspace where you can create, organize, and manage both 
        <strong>Folders</strong> and <strong>Webflows</strong> in a hierarchical structure.
      </p>
      
      <div class="dashboard-screenshot">
        <img 
          src="./images/examples/dashboard/dashboard.png" 
          alt="Dashboard Overview"
          class="docs-screenshot"
        />
        <p class="docs-caption">Clean dashboard interface when starting fresh</p>
      </div>
    </DocsCard>

    <!-- Folders vs Webflows -->
    <DocsCard title="Folders vs Webflows" badge="Concepts">
      <div class="concept-grid">
        <div class="concept-item">
          <div class="concept-header">
            <i class="fas fa-folder text-amber"></i>
            <h4>Folders</h4>
          </div>
          <p class="docs-text">
            Organizational containers that help you group related Webflows together. 
            Think of them as directories for your API collections.
          </p>
          <ul class="docs-list">
            <li>Create hierarchical organization</li>
            <li>Group related API collections</li>
            <li>No direct API functionality</li>
            <li>Can contain other folders and webflows</li>
          </ul>
        </div>

        <div class="concept-item">
          <div class="concept-header">
            <i class="fas fa-project-diagram text-primary"></i>
            <h4>Webflows</h4>
          </div>
          <p class="docs-text">
            Actual API collections that contain your endpoints, configurations, 
            and workflow logic for testing and managing APIs.
          </p>
          <ul class="docs-list">
            <li>Contains API endpoints and methods</li>
            <li>Supports OpenAPI and Postman configurations</li>
            <li>Executable workflow functionality</li>
            <li>Can be organized within folders</li>
          </ul>
        </div>
      </div>

      <div class="dashboard-screenshot">
        <img 
          src="./images/examples/dashboard/dashboardwithwebflowandfolder.png" 
          alt="Dashboard with Folders and Webflows"
          class="docs-screenshot"
        />
        <p class="docs-caption">Dashboard showing both folders and webflows in organized structure</p>
      </div>
    </DocsCard>

    <!-- Creating Folders -->
    <DocsCard title="Creating Folders" badge="Tutorial">
      <DocsAlert type="info" title="Organization Best Practice">
        Use folders to group related APIs by project, environment, or functionality. 
        This helps maintain a clean and navigable workspace as your API collections grow.
      </DocsAlert>

      <div class="tutorial-steps">
        <div class="tutorial-step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h5>Click "Create Your First Web Flow"</h5>
            <p class="docs-text">From the dashboard, click the primary action button to open the creation form.</p>
          </div>
        </div>

        <div class="tutorial-step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h5>Select "Folder" Type</h5>
            <p class="docs-text">In the form, check the "Is Folder" option to create an organizational container.</p>
          </div>
        </div>

        <div class="tutorial-step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h5>Configure Folder Details</h5>
            <p class="docs-text">Add a name, description, icon, and tags to help identify and organize your folder.</p>
          </div>
        </div>
      </div>

      <div class="dashboard-screenshot">
        <img 
          src="./images/examples/dashboard/createFolder.png" 
          alt="Create Folder Form"
          class="docs-screenshot"
        />
        <p class="docs-caption">Folder creation form with organizational options</p>
      </div>
    </DocsCard>

    <!-- Creating Webflows -->
    <DocsCard title="Creating Webflows" badge="Tutorial">
      <p class="docs-text">
        Webflows are the core functional units that contain your API collections. 
        They can be configured with OpenAPI specifications or Postman collections for rapid setup.
      </p>

      <div class="tutorial-steps">
        <div class="tutorial-step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h5>Access Creation Form</h5>
            <p class="docs-text">Click the "+" button or "Create Your First Web Flow" to open the webflow creation form.</p>
          </div>
        </div>

        <div class="tutorial-step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h5>Basic Information</h5>
            <p class="docs-text">Provide a name, description, and optional icon/tags for your webflow.</p>
          </div>
        </div>

        <div class="tutorial-step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h5>Choose Configuration Method</h5>
            <p class="docs-text">Select between OpenAPI configuration or Postman collection import.</p>
          </div>
        </div>
      </div>

      <div class="dashboard-screenshot">
        <img 
          src="./images/examples/dashboard/addwebflowform.png" 
          alt="Webflow Creation Form"
          class="docs-screenshot"
        />
        <p class="docs-caption">Webflow creation form with configuration options</p>
      </div>
    </DocsCard>

    <!-- OpenAPI Configuration -->
    <DocsCard title="OpenAPI Configuration" badge="Configuration">
      <p class="docs-text">
        OpenAPI (formerly Swagger) configuration allows you to import API specifications 
        to automatically generate endpoints, parameters, and documentation.
      </p>

      <DocsAlert type="success" title="Supported Methods">
        You can configure OpenAPI through server URL or by uploading specification files.
      </DocsAlert>

      <div class="config-methods">
        <div class="config-method">
          <h5>
            <i class="fas fa-server"></i>
            Server URL Configuration
          </h5>
          <p class="docs-text">
            Connect directly to an OpenAPI server endpoint that serves your API specification.
          </p>
          <ul class="docs-list">
            <li>Real-time specification updates</li>
            <li>Direct server connection</li>
            <li>Automatic endpoint discovery</li>
          </ul>

          <div class="dashboard-screenshot">
            <img 
              src="./images/examples/dashboard/addopenPaiCOnfigByServer.png" 
              alt="OpenAPI Server Configuration"
              class="docs-screenshot"
            />
            <p class="docs-caption">OpenAPI configuration using server URL</p>
          </div>
        </div>

        <div class="config-method">
          <h5>
            <i class="fas fa-file-upload"></i>
            File Upload Configuration
          </h5>
          <p class="docs-text">
            Upload OpenAPI specification files (JSON/YAML) directly to your webflow.
          </p>
          <ul class="docs-list">
            <li>Offline specification support</li>
            <li>Version controlled files</li>
            <li>Custom or modified specifications</li>
          </ul>

          <div class="dashboard-screenshot">
            <img 
              src="./images/examples/dashboard/addOpenApiConfigByFile.png" 
              alt="OpenAPI File Configuration"
              class="docs-screenshot"
            />
            <p class="docs-caption">OpenAPI configuration using file upload</p>
          </div>
        </div>
      </div>
    </DocsCard>

    <!-- Postman Configuration -->
    <DocsCard title="Postman Configuration" badge="Configuration">
      <p class="docs-text">
        Import Postman collections to quickly set up your API workflows with pre-configured 
        requests, environments, and test scripts.
      </p>

      <DocsAlert type="info" title="Collection Import">
        Postman collections provide a complete API testing environment with requests, 
        variables, and test scripts that can be imported directly into your webflow.
      </DocsAlert>

      <div class="feature-highlights">
        <div class="feature-item">
          <i class="fas fa-download"></i>
          <h6>Collection Import</h6>
          <p>Import complete Postman collections with all requests and configurations</p>
        </div>
        
        <div class="feature-item">
          <i class="fas fa-cog"></i>
          <h6>Environment Variables</h6>
          <p>Automatically import environment variables and collection variables</p>
        </div>
        
        <div class="feature-item">
          <i class="fas fa-code"></i>
          <h6>Test Scripts</h6>
          <p>Preserve pre-request and test scripts from your Postman collection</p>
        </div>
      </div>

      <div class="dashboard-screenshot">
        <img 
          src="./images/examples/dashboard/AddPostManConfig.png" 
          alt="Postman Configuration"
          class="docs-screenshot"
        />
        <p class="docs-caption">Postman collection configuration interface</p>
      </div>
    </DocsCard>

    <!-- Best Practices -->
    <DocsCard title="Best Practices" badge="Tips">
      <div class="best-practices-grid">
        <div class="practice-item">
          <i class="fas fa-sitemap text-primary"></i>
          <h6>Organization Strategy</h6>
          <ul class="docs-list">
            <li>Use folders to group by project or environment</li>
            <li>Name webflows descriptively (e.g., "User Management API")</li>
            <li>Use tags for additional categorization</li>
          </ul>
        </div>

        <div class="practice-item">
          <i class="fas fa-code-branch text-success"></i>
          <h6>Configuration Management</h6>
          <ul class="docs-list">
            <li>Use OpenAPI for auto-generated documentation</li>
            <li>Import Postman collections for existing workflows</li>
            <li>Keep configurations updated with API changes</li>
          </ul>
        </div>

        <div class="practice-item">
          <i class="fas fa-shield-alt text-warning"></i>
          <h6>Security Considerations</h6>
          <ul class="docs-list">
            <li>Store sensitive data in environment variables</li>
            <li>Use secure server URLs for OpenAPI</li>
            <li>Regularly update API configurations</li>
          </ul>
        </div>
      </div>
    </DocsCard>

  </DocsLayout>
</template>

<script setup lang="ts">
import DocsLayout from './DocsLayout.vue'
import DocsCard from './DocsCard.vue'
import DocsAlert from './DocsAlert.vue'

const breadcrumbs = [
  { label: 'Documentation' },
  { label: 'Dashboard' },
  { label: 'Overview' }
]

const navigation = [
  {
    title: 'Getting Started',
    items: [
      { label: 'Dashboard Overview', icon: 'fas fa-tachometer-alt' },
      { label: 'Quick Start Guide', icon: 'fas fa-rocket' }
    ]
  },
  {
    title: 'Core Concepts',
    items: [
      { label: 'Folders & Webflows', icon: 'fas fa-layer-group' },
      { label: 'API Configuration', icon: 'fas fa-cogs' }
    ]
  },
  {
    title: 'Components',
    items: [
      { label: 'UI Components', icon: 'fas fa-puzzle-piece' },
      { label: 'Design System', icon: 'fas fa-palette' }
    ]
  }
]
</script>

<script lang="ts">
export default {
  name: 'DashboardDocs'
}
</script>

<style scoped>
.docs-screenshot {
  width: 100%;
  max-width: 800px;
  height: auto;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-border-subtle);
  margin: var(--spacing-lg) 0;
}

.dashboard-screenshot {
  text-align: center;
  margin: var(--spacing-xl) 0;
}

.concept-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  margin: var(--spacing-lg) 0;
}

.concept-item {
  padding: var(--spacing-lg);
  background: var(--color-background-subtle);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-subtle);
}

.concept-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.concept-header i {
  font-size: var(--font-size-xl);
}

.concept-header h4 {
  margin: 0;
  color: var(--color-text-primary);
}

.text-amber {
  color: var(--color-warning);
}

.text-primary {
  color: var(--color-primary);
}

.tutorial-steps {
  margin: var(--spacing-lg) 0;
}

.tutorial-step {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  align-items: flex-start;
}

.step-number {
  background: var(--color-primary);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  flex-shrink: 0;
}

.step-content h5 {
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--color-text-primary);
}

.config-methods {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  margin: var(--spacing-lg) 0;
}

.config-method h5 {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
}

.config-method i {
  color: var(--color-primary);
}

.feature-highlights {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  margin: var(--spacing-lg) 0;
}

.feature-item {
  text-align: center;
  padding: var(--spacing-lg);
  background: var(--color-background-elevated);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-subtle);
}

.feature-item i {
  font-size: var(--font-size-2xl);
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
}

.feature-item h6 {
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--color-text-primary);
}

.feature-item p {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.best-practices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  margin: var(--spacing-lg) 0;
}

.practice-item {
  padding: var(--spacing-lg);
  background: var(--color-background-elevated);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-subtle);
}

.practice-item i {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-sm);
}

.practice-item h6 {
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--color-text-primary);
}

.text-success {
  color: var(--color-success);
}

.text-warning {
  color: var(--color-warning);
}

/* Force enable scrolling - override body overflow: hidden */
body {
  overflow: auto !important;
}

html {
  overflow: auto !important;
}
</style>

<style scoped>
/* Fix scrolling issues */
.docs-container {
  height: auto !important;
  min-height: 100vh;
  overflow-y: auto;
  padding-bottom: var(--spacing-3xl);
}

.docs-main {
  height: auto !important;
  overflow-y: visible;
  max-height: none;
}

.docs-sidebar {
  height: auto !important;
  max-height: calc(100vh - var(--spacing-xl));
  position: sticky;
  top: var(--spacing-lg);
  overflow-y: auto;
}

@media (max-width: 768px) {
  .concept-grid {
    grid-template-columns: 1fr;
  }
  
  .tutorial-step {
    flex-direction: column;
    text-align: center;
  }
  
  .config-methods {
    gap: var(--spacing-lg);
  }
  
  .feature-highlights {
    grid-template-columns: 1fr;
  }
  
  .best-practices-grid {
    grid-template-columns: 1fr;
  }
  
  .docs-sidebar {
    position: static;
    height: auto;
    max-height: none;
  }
}
</style>