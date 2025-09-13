<template>
  <div class="openapi-docs">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <i class="pi pi-spin pi-spinner"></i>
      <p>Loading OpenAPI documentation...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="hasError" class="error-state">
      <i class="pi pi-exclamation-triangle"></i>
      <h3>Failed to Load Documentation</h3>
      <p>Unable to fetch OpenAPI documentation from the provided URL.</p>
      <button class="btn btn-primary" @click="retryLoad">
        <i class="pi pi-refresh"></i>
        Retry
      </button>
    </div>

    <!-- Success State -->
    <div v-else-if="apiDoc">
      <div class="api-doc-header">
        <div class="flex-v-center " >
          <h4 class="api-doc-header-title">Filter:</h4>
          <select class="api-doc-header-group mx-l" v-model="groupName">
            <option value="">All Groups</option>
            <option v-for="group in groupNameList" :key="group" :value="group">{{ group }}</option>
          </select>
          <input
            type="text"
            class="api-doc-header-search"
            v-model="filter"
            placeholder="Search APIs..."
          />
        </div>
        <div class="api-doc-header-actions">
          <button class="btn btn-primary" :disabled="!addedApis.length" @click="addSelectedApis">
            <i class="pi pi-plus mx-s"></i>
            Add Selected APIs
          </button>
        </div>
      </div>
      <div v-if="filteredApiDoc.length" class="api-doc-content">
        <api-card
          v-for="api in filteredApiDoc"
          :key="api.url + api.method"
          :api="api"
          :selected="addedApis.includes(api.id)"
          @select="toggleApiSelection(api.id)"
        />
      </div>
      <div v-else class="doc-body">
        <p class="placeholder-text">No APIs found matching your criteria.</p>
      </div>
    </div>

    <!-- No URL State -->
    <div v-else class="empty-state">
      <i class="pi pi-file-o"></i>
      <h3>No Documentation URL</h3>
      <p>Please provide a valid OpenAPI documentation URL to display the API docs.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { proxyService } from '../../../services/proxy.service'
import { SessionCache } from '../../../lib/caching'
import { extractApiList, type ExtractedAPI } from '../../../utils/openApiPreprocess'
import apiCard from './apiCard.vue';
import { mapMutations } from 'vuex';
import { extractedOpenApiToHttpNode } from '../../../utils/extractedOpenApiToHttpNode';
const cache = new SessionCache('openApiDocsCache');

// Define interface for API with ID
interface ApiWithId extends ExtractedAPI {
  id: string;
}

export default {
  components: { apiCard },
  name: 'OpenApiDocsComponent',
  props: {
    openApiDocConfig: {
      type: Object,
      default: () => ({ enabled: false, url: '' })
    }
  },
  data() {
    return {
      loading: false,
      apiDoc: null as ApiWithId[] | null,
      hasError: false,
      addedApis: [] as string[],
      filter: '',
      groupName: ''
    }
  },
  computed: {
    filterByGroup(): ApiWithId[] {
      if (!this.apiDoc) return [];
      return this.groupName.length ? this.apiDoc.filter((api: ApiWithId) => api.groupName === this.groupName) : this.apiDoc;
    },
    filteredApiDoc(): ApiWithId[] {
      if (!this.filter) return this.filterByGroup;
      const lowerFilter = this.filter.toLowerCase();
      return this.filterByGroup.filter((api: ApiWithId) =>
        api.name?.toLowerCase().includes(lowerFilter) ||
        api.url?.toLowerCase().includes(lowerFilter) ||
        (api.description && api.description.toLowerCase().includes(lowerFilter))
      );
    },
    groupNameList(): string[] {
      if (!this.apiDoc) return [];
      return this.apiDoc.reduce((acc: string[], api: ApiWithId) => {
        if (api.groupName && !acc.includes(api.groupName)) {
          acc.push(api.groupName);
        }
        return acc;
      }, []);
    },
  },
  methods: {
    ...mapMutations({
      addHttpNode: 'workflowModule/addHttpNode',
    }),
    toggleApiSelection(apiId: string): void {
      const index = this.addedApis.indexOf(apiId);
      if (index > -1) {
        this.addedApis.splice(index, 1);
      } else {
        this.addedApis.push(apiId);
      }
    },
    async loadApiDoc(): Promise<void> {
      // Check if loading from file
      if (this.openApiDocConfig.fromFile && this.openApiDocConfig.fileData) {
        try {
          this.loading = true;
          this.hasError = false;
          
          const extractedApis = extractApiList(this.openApiDocConfig.fileData);
          this.apiDoc = extractedApis.map((api: ExtractedAPI) => ({
            ...api,
            id: `${api.method}-${api.url}`
          }));
          
          this.hasError = false;
        } catch (error) {
          console.error('Error processing uploaded file:', error);
          this.hasError = true;
        } finally {
          this.loading = false;
        }
        return;
      }
      
      // Check cache for URL-based loading
      if (this.openApiDocConfig.url && cache.has(this.openApiDocConfig.url)) {
        this.apiDoc = cache.get(this.openApiDocConfig.url) as ApiWithId[];
        return;
      }
      
      if (!this.openApiDocConfig.url) {
        return;
      }

      this.loading = true;
      this.hasError = false;
      this.apiDoc = null;

      try {
        const response = await proxyService.getOpenApiDoc(this.openApiDocConfig.url);
        if (response && typeof response === 'object' && 'error' in response && response.error) {
          this.hasError = true;
        } else if (response && typeof response === 'object' && 'data' in response) {
          // Add type assertion to ensure response.data is treated as OpenAPIDocument
          const extractedApis = extractApiList(response.data as any);
          // Add unique ID to each API based on method and URL
          this.apiDoc = extractedApis.map((api: ExtractedAPI) => ({
            ...api,
            id: `${api.method}-${api.url}`
          }));
          
          if (this.openApiDocConfig.url) {
            cache.set(this.openApiDocConfig.url, this.apiDoc);
          }
          this.hasError = false;
        } else {
          this.hasError = true;
        }
      } catch (error) {
        console.error('Error loading OpenAPI doc:', error);
        this.hasError = true;
      } finally {
        this.loading = false;
      }
    },

    async retryLoad(): Promise<void> {
      await this.loadApiDoc();
    },

    addSelectedApis(): void {
      if (this.addedApis.length === 0 || !this.apiDoc) {
        return;
      }
      const baseUrl = (this.openApiDocConfig.baseUrl as string) || 
                      (this.openApiDocConfig.url ? new URL(this.openApiDocConfig.url as string).origin : '');
      
      const apiList = this.apiDoc.filter((api: ApiWithId) => this.addedApis.includes(api.id));
      apiList.forEach((api: ApiWithId) => {
        try {
          const nodeData = extractedOpenApiToHttpNode(api, baseUrl);
          this.addHttpNode(nodeData);
        } catch (error) {
          console.error('Error converting OpenAPI to HTTP Node:', error);
        }
      });
      this.$emit('close');
      this.addedApis = [];
    }
  },
  async created() {
    if (this.openApiDocConfig.enabled && (this.openApiDocConfig.url || this.openApiDocConfig.fromFile)) {
      await this.loadApiDoc();
    }
  },
  
  watch: {
    'openApiDocConfig.fileData'() {
      if (this.openApiDocConfig.fromFile && this.openApiDocConfig.fileData) {
        this.loadApiDoc();
      }
    },
    'openApiDocConfig.url'() {
      if (!this.openApiDocConfig.fromFile && this.openApiDocConfig.url) {
        this.loadApiDoc();
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.openapi-docs {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xlarge);
  text-align: center;
  flex: 1;

  i {
    font-size: 48px;
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-large);
  }

  h3 {
    font-size: var(--font-size-large);
    margin-bottom: var(--spacing-medium);
    color: var(--color-text-primary);
  }

  p {
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-large);
    max-width: 400px;
  }
}

.error-state {
  i {
    color: var(--color-danger);
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-small);
  }
}

.api-doc-content {
  flex: 1;
  max-height: 600px;
  overflow-y: auto;
  padding: var(--spacing-large);
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: var(--spacing-large);
}

.doc-header {
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--spacing-large);
  margin-bottom: var(--spacing-large);

  h2 {
    font-size: var(--font-size-xlarge);
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-medium);
  }

  .doc-description {
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-medium);
    line-height: var(--line-height-medium);
  }

  .version-badge {
    display: inline-block;
    background-color: var(--color-primary);
    color: white;
    padding: calc(var(--spacing-small) / 2) var(--spacing-small);
    border-radius: 4pt;
    font-size: var(--font-size-small);
    font-weight: 600;
  }
}

.doc-body {
  .placeholder-text {
    color: var(--color-text-secondary);
    font-style: italic;
    text-align: center;
    padding: var(--spacing-xlarge);
  }
}

.api-doc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-medium);
  padding: var(--spacing-large);
  border-bottom: 1px solid var(--color-border);
  
  .api-doc-header-title {
    font-size: var(--font-size-medium);
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0;
    white-space: nowrap;
  }
  
  .api-doc-header-group {
    min-width: 150px;
    padding: var(--spacing-small) var(--spacing-medium);
    border: 1px solid var(--color-border);
    border-radius: 4pt;
    background-color: var(--color-white);
    color: var(--color-text-primary);
    font-size: var(--font-size-small);
    cursor: pointer;
    transition: border-color 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2);
    }
    
    &:hover {
      border-color: var(--color-primary);
    }
  }
  
  .api-doc-header-search {
    flex: 1;
    padding: var(--spacing-small) var(--spacing-medium);
    border: 1px solid var(--color-border);
    border-radius: 4pt;
    background-color: var(--color-white);
    color: var(--color-text-primary);
    font-size: var(--font-size-small);
    transition: border-color 0.2s ease;
    
    &::placeholder {
      color: var(--color-text-secondary);
    }
    
    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2);
    }
    
    &:hover {
      border-color: var(--color-primary);
    }
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-small);
    
    .api-doc-header-title {
      text-align: center;
    }
    
    .api-doc-header-group {
      min-width: auto;
    }
  }
}

// Dark theme adjustments
.dark-theme {
  .api-doc-header {
    background-color: var(--color-background);
    
    .api-doc-header-group,
    .api-doc-header-search {
      background-color: var(--color-light);
      border-color: var(--color-border);
      color: var(--color-text-primary);
      
      &::placeholder {
        color: var(--color-text-secondary);
      }
    }
  }
}
</style>
