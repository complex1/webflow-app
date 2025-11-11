<template>
  <DocsLayout
    title="Environment Files"
    subtitle="Complete guide to managing environment variables and configurations"
    :breadcrumbs="breadcrumbs"
    :navigation="navigation"
  >
    <!-- Environment Files Introduction -->
    <DocsCard title="What are Environment Files?" badge="Overview">
      <p class="docs-text">
        Environment Files are centralized configuration containers that store key-value pairs 
        of environment variables. They provide a secure and organized way to manage 
        <strong>API keys</strong>, <strong>configuration values</strong>, and <strong>environment-specific settings</strong> 
        across your webflows and API collections.
      </p>
      
      <div class="feature-highlights">
        <div class="feature-item">
          <i class="fas fa-key"></i>
          <h6>Secure Storage</h6>
          <p>Store sensitive API keys and tokens securely</p>
        </div>
        
        <div class="feature-item">
          <i class="fas fa-sync"></i>
          <h6>Reusable Configs</h6>
          <p>Share configurations across multiple webflows</p>
        </div>
        
        <div class="feature-item">
          <i class="fas fa-layer-group"></i>
          <h6>Environment Management</h6>
          <p>Separate dev, staging, and production environments</p>
        </div>
      </div>

      <div class="dashboard-screenshot">
        <img 
          src="./images/examples/envfile/env-file-dashboard.png" 
          alt="Environment Files Dashboard"
          class="docs-screenshot"
        />
        <p class="docs-caption">Environment Files dashboard showing all your configuration files</p>
      </div>
    </DocsCard>

    <!-- Creating Environment Files -->
    <DocsCard title="Creating Environment Files" badge="Tutorial">
      <p class="docs-text">
        Environment files allow you to define reusable configuration sets that can be linked 
        to multiple webflows. Each file contains key-value pairs representing environment variables.
      </p>

      <div class="tutorial-steps">
        <div class="tutorial-step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h5>Access Environment Files</h5>
            <p class="docs-text">Navigate to the Environment Files section from the main navigation menu.</p>
          </div>
        </div>

        <div class="tutorial-step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h5>Click "Add Environment File"</h5>
            <p class="docs-text">Use the primary action button to open the environment file creation form.</p>
          </div>
        </div>

        <div class="tutorial-step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h5>Configure Basic Information</h5>
            <p class="docs-text">Add a descriptive name and optional description to identify your environment file.</p>
          </div>
        </div>

        <div class="tutorial-step">
          <div class="step-number">4</div>
          <div class="step-content">
            <h5>Add Environment Variables</h5>
            <p class="docs-text">Define key-value pairs for your configuration variables with optional descriptions.</p>
          </div>
        </div>
      </div>

      <div class="dashboard-screenshot">
        <img 
          src="./images/examples/envfile/envfile-form.png" 
          alt="Environment File Creation Form"
          class="docs-screenshot"
        />
        <p class="docs-caption">Environment file creation form with variable configuration</p>
      </div>

      <DocsAlert type="info" title="Naming Best Practices">
        Use descriptive names like "Production API Keys", "Development Config", or "Staging Environment" 
        to easily identify the purpose and environment of each file.
      </DocsAlert>
    </DocsCard>

    <!-- Environment Variables Structure -->
    <DocsCard title="Environment Variables Structure" badge="Configuration">
      <p class="docs-text">
        Each environment file contains a collection of configuration variables with three main components:
      </p>

      <div class="config-structure">
        <div class="structure-item">
          <div class="structure-header">
            <i class="fas fa-key text-primary"></i>
            <h6>Key</h6>
          </div>
          <p class="docs-text">
            The variable name (e.g., <code class="docs-inline-code">API_BASE_URL</code>, <code class="docs-inline-code">AUTH_TOKEN</code>)
          </p>
          <ul class="docs-list">
            <li>Use UPPERCASE with underscores</li>
            <li>Be descriptive and consistent</li>
            <li>Avoid special characters</li>
          </ul>
        </div>

        <div class="structure-item">
          <div class="structure-header">
            <i class="fas fa-edit text-success"></i>
            <h6>Value</h6>
          </div>
          <p class="docs-text">
            The actual configuration value (e.g., URLs, tokens, settings)
          </p>
          <ul class="docs-list">
            <li>Store sensitive data securely</li>
            <li>Use placeholder values for examples</li>
            <li>Keep values environment-specific</li>
          </ul>
        </div>

        <div class="structure-item">
          <div class="structure-header">
            <i class="fas fa-comment text-warning"></i>
            <h6>Description</h6>
          </div>
          <p class="docs-text">
            Optional documentation explaining the variable's purpose
          </p>
          <ul class="docs-list">
            <li>Explain the variable's purpose</li>
            <li>Include format examples</li>
            <li>Note any special requirements</li>
          </ul>
        </div>
      </div>

      <div class="dashboard-screenshot">
        <img 
          src="./images/examples/envfile/envfile-detail.png" 
          alt="Environment File Details"
          class="docs-screenshot"
        />
        <p class="docs-caption">Detailed view of environment variables with keys, values, and descriptions</p>
      </div>
    </DocsCard>

    <!-- Managing Environment Files -->
    <DocsCard title="Managing Environment Files" badge="Operations">
      <p class="docs-text">
        Environment files support full CRUD operations and additional management features 
        to help you organize and maintain your configurations effectively.
      </p>

      <div class="operations-grid">
        <div class="operation-item">
          <div class="operation-icon">
            <i class="fas fa-eye text-info"></i>
          </div>
          <div class="operation-content">
            <h6>View Details</h6>
            <p>Inspect all variables and their configurations in a detailed modal view.</p>
          </div>
        </div>

        <div class="operation-item">
          <div class="operation-icon">
            <i class="fas fa-edit text-primary"></i>
          </div>
          <div class="operation-content">
            <h6>Edit Configuration</h6>
            <p>Modify existing variables, add new ones, or update descriptions.</p>
          </div>
        </div>

        <div class="operation-item">
          <div class="operation-icon">
            <i class="fas fa-copy text-success"></i>
          </div>
          <div class="operation-content">
            <h6>Duplicate File</h6>
            <p>Create copies for different environments with a new name.</p>
          </div>
        </div>

        <div class="operation-item">
          <div class="operation-icon">
            <i class="fas fa-trash text-danger"></i>
          </div>
          <div class="operation-content">
            <h6>Delete File</h6>
            <p>Remove environment files that are no longer needed.</p>
          </div>
        </div>

        <div class="operation-item">
          <div class="operation-icon">
            <i class="fas fa-search text-secondary"></i>
          </div>
          <div class="operation-content">
            <h6>Search & Filter</h6>
            <p>Quickly find specific environment files using the search functionality.</p>
          </div>
        </div>

        <div class="operation-item">
          <div class="operation-icon">
            <i class="fas fa-clipboard text-warning"></i>
          </div>
          <div class="operation-content">
            <h6>Copy Values</h6>
            <p>Copy individual variable values to clipboard for quick access.</p>
          </div>
        </div>
      </div>

      <div class="dashboard-screenshot">
        <img 
          src="./images/examples/envfile/envfile-action.png" 
          alt="Environment File Actions"
          class="docs-screenshot"
        />
        <p class="docs-caption">Environment file actions menu with all available operations</p>
      </div>
    </DocsCard>

    <!-- Linking to Webflows -->
    <DocsCard title="Linking Environment Files to Webflows" badge="Integration">
      <p class="docs-text">
        Environment files become powerful when linked to webflows. This allows you to use 
        environment variables in your API requests, making your workflows dynamic and environment-aware.
      </p>

      <DocsAlert type="success" title="Dynamic Configuration">
        Once linked, environment variables can be referenced in your API endpoints, 
        headers, and request bodies using the syntax: <code class="docs-inline-code">{{API_BASE_URL}}</code>
      </DocsAlert>

      <div class="linking-process">
        <div class="link-step">
          <div class="link-icon">
            <i class="fas fa-project-diagram"></i>
          </div>
          <div class="link-content">
            <h6>1. Open Webflow Playground</h6>
            <p>Navigate to any webflow's playground environment.</p>
          </div>
        </div>

        <div class="link-step">
          <div class="link-icon">
            <i class="fas fa-layer-group"></i>
          </div>
          <div class="link-content">
            <h6>2. Access Environment Manager</h6>
            <p>Use the environment selector or manager to link environment files.</p>
          </div>
        </div>

        <div class="link-step">
          <div class="link-icon">
            <i class="fas fa-link"></i>
          </div>
          <div class="link-content">
            <h6>3. Link Environment File</h6>
            <p>Select and link the appropriate environment file to your webflow.</p>
          </div>
        </div>

        <div class="link-step">
          <div class="link-icon">
            <i class="fas fa-play"></i>
          </div>
          <div class="link-content">
            <h6>4. Use Variables</h6>
            <p>Reference variables in your API calls using double curly braces syntax.</p>
          </div>
        </div>
      </div>
    </DocsCard>

    <!-- Best Practices -->
    <DocsCard title="Best Practices" badge="Guidelines">
      <div class="best-practices-grid">
        <div class="practice-category">
          <h6>
            <i class="fas fa-shield-alt text-danger"></i>
            Security Practices
          </h6>
          <ul class="docs-list">
            <li>Never store plain text passwords or secrets</li>
            <li>Use environment-specific files for sensitive data</li>
            <li>Regularly rotate API keys and tokens</li>
            <li>Limit access to production environment files</li>
          </ul>
        </div>

        <div class="practice-category">
          <h6>
            <i class="fas fa-sitemap text-primary"></i>
            Organization Strategies
          </h6>
          <ul class="docs-list">
            <li>Create separate files for each environment</li>
            <li>Use descriptive names and detailed descriptions</li>
            <li>Group related configurations together</li>
            <li>Document variable purposes and formats</li>
          </ul>
        </div>

        <div class="practice-category">
          <h6>
            <i class="fas fa-code text-success"></i>
            Naming Conventions
          </h6>
          <ul class="docs-list">
            <li>Use UPPERCASE for variable keys</li>
            <li>Separate words with underscores</li>
            <li>Be consistent across all environment files</li>
            <li>Include prefixes for different services (e.g., DB_, API_)</li>
          </ul>
        </div>

        <div class="practice-category">
          <h6>
            <i class="fas fa-sync text-warning"></i>
            Maintenance Tips
          </h6>
          <ul class="docs-list">
            <li>Regularly review and update configurations</li>
            <li>Remove unused environment variables</li>
            <li>Keep descriptions current and accurate</li>
            <li>Test configurations in non-production environments first</li>
          </ul>
        </div>
      </div>
    </DocsCard>

    <!-- Common Use Cases -->
    <DocsCard title="Common Use Cases" badge="Examples">
      <p class="docs-text">
        Environment files are versatile and can be used in various scenarios to improve 
        your API workflow management and configuration organization.
      </p>

      <div class="use-cases-grid">
        <div class="use-case">
          <div class="use-case-header">
            <i class="fas fa-server text-primary"></i>
            <h6>API Configuration</h6>
          </div>
          <ul class="docs-list">
            <li><code class="docs-inline-code">API_BASE_URL</code> - Base URL for API endpoints</li>
            <li><code class="docs-inline-code">API_KEY</code> - Authentication key</li>
            <li><code class="docs-inline-code">API_VERSION</code> - API version number</li>
            <li><code class="docs-inline-code">TIMEOUT</code> - Request timeout values</li>
          </ul>
        </div>

        <div class="use-case">
          <div class="use-case-header">
            <i class="fas fa-database text-success"></i>
            <h6>Database Settings</h6>
          </div>
          <ul class="docs-list">
            <li><code class="docs-inline-code">DB_HOST</code> - Database host address</li>
            <li><code class="docs-inline-code">DB_PORT</code> - Database port number</li>
            <li><code class="docs-inline-code">DB_NAME</code> - Database name</li>
            <li><code class="docs-inline-code">DB_CONNECTION_STRING</code> - Full connection string</li>
          </ul>
        </div>

        <div class="use-case">
          <div class="use-case-header">
            <i class="fas fa-lock text-warning"></i>
            <h6>Authentication</h6>
          </div>
          <ul class="docs-list">
            <li><code class="docs-inline-code">AUTH_TOKEN</code> - Bearer token</li>
            <li><code class="docs-inline-code">CLIENT_ID</code> - OAuth client ID</li>
            <li><code class="docs-inline-code">CLIENT_SECRET</code> - OAuth client secret</li>
            <li><code class="docs-inline-code">REFRESH_TOKEN</code> - Token refresh endpoint</li>
          </ul>
        </div>

        <div class="use-case">
          <div class="use-case-header">
            <i class="fas fa-cloud text-info"></i>
            <h6>Third-party Services</h6>
          </div>
          <ul class="docs-list">
            <li><code class="docs-inline-code">STRIPE_API_KEY</code> - Payment processing</li>
            <li><code class="docs-inline-code">SENDGRID_API_KEY</code> - Email service</li>
            <li><code class="docs-inline-code">AWS_ACCESS_KEY</code> - Cloud storage</li>
            <li><code class="docs-inline-code">GOOGLE_API_KEY</code> - Google services</li>
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
  { label: 'Environment Files' },
  { label: 'Overview' }
]

const navigation = [
  {
    title: 'Getting Started',
    items: [
      { label: 'Dashboard Overview', icon: 'fas fa-tachometer-alt' },
      { label: 'Environment Files', icon: 'fas fa-file-code' },
      { label: 'Quick Start Guide', icon: 'fas fa-rocket' }
    ]
  },
  {
    title: 'Core Features',
    items: [
      { label: 'Creating Env Files', icon: 'fas fa-plus-circle' },
      { label: 'Managing Variables', icon: 'fas fa-cogs' },
      { label: 'Linking to Webflows', icon: 'fas fa-link' }
    ]
  },
  {
    title: 'Best Practices',
    items: [
      { label: 'Security Guidelines', icon: 'fas fa-shield-alt' },
      { label: 'Organization Tips', icon: 'fas fa-sitemap' }
    ]
  }
]
</script>

<script lang="ts">
export default {
  name: 'EnvFileDocs'
}
</script>

<style>
/* Force enable scrolling - override body overflow: hidden */
body {
  overflow: auto !important;
}

html {
  overflow: auto !important;
}
</style>

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

.config-structure {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  margin: var(--spacing-lg) 0;
}

.structure-item {
  padding: var(--spacing-lg);
  background: var(--color-background-subtle);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-subtle);
}

.structure-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.structure-header i {
  font-size: var(--font-size-lg);
}

.structure-header h6 {
  margin: 0;
  color: var(--color-text-primary);
}

.text-primary { color: var(--color-primary); }
.text-success { color: var(--color-success); }
.text-warning { color: var(--color-warning); }
.text-danger { color: var(--color-danger); }
.text-info { color: var(--color-info); }
.text-secondary { color: var(--color-text-secondary); }

.operations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-md);
  margin: var(--spacing-lg) 0;
}

.operation-item {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-background-elevated);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-subtle);
  align-items: flex-start;
}

.operation-icon {
  flex-shrink: 0;
}

.operation-icon i {
  font-size: var(--font-size-lg);
}

.operation-content h6 {
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--color-text-primary);
}

.operation-content p {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.linking-process {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  margin: var(--spacing-lg) 0;
}

.link-step {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--color-background-elevated);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-subtle);
  align-items: center;
}

.link-icon {
  background: var(--color-primary-light);
  color: var(--color-primary);
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.link-icon i {
  font-size: var(--font-size-lg);
}

.link-content h6 {
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--color-text-primary);
}

.link-content p {
  margin: 0;
  color: var(--color-text-secondary);
}

.best-practices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  margin: var(--spacing-lg) 0;
}

.practice-category {
  padding: var(--spacing-lg);
  background: var(--color-background-elevated);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-subtle);
}

.practice-category h6 {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin: 0 0 var(--spacing-md) 0;
  color: var(--color-text-primary);
}

.practice-category i {
  font-size: var(--font-size-lg);
}

.use-cases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
  margin: var(--spacing-lg) 0;
}

.use-case {
  padding: var(--spacing-lg);
  background: var(--color-background-elevated);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-subtle);
}

.use-case-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.use-case-header i {
  font-size: var(--font-size-xl);
}

.use-case-header h6 {
  margin: 0;
  color: var(--color-text-primary);
}

@media (max-width: 768px) {
  .feature-highlights {
    grid-template-columns: 1fr;
  }
  
  .tutorial-step {
    flex-direction: column;
    text-align: center;
  }
  
  .config-structure {
    grid-template-columns: 1fr;
  }
  
  .operations-grid {
    grid-template-columns: 1fr;
  }
  
  .link-step {
    flex-direction: column;
    text-align: center;
  }
  
  .best-practices-grid {
    grid-template-columns: 1fr;
  }
  
  .use-cases-grid {
    grid-template-columns: 1fr;
  }
}
</style>