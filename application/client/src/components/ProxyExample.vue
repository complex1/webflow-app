<template>
  <div class="proxy-example">
    <h2>Proxy API Test</h2>
    
    <div class="form-group">
      <label for="apiUrl">API URL</label>
      <input 
        type="text" 
        id="apiUrl" 
        v-model="apiUrl" 
        placeholder="https://api.example.com/data"
      />
    </div>
    
    <div class="form-group">
      <label for="method">Method</label>
      <select id="method" v-model="method">
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="DELETE">DELETE</option>
      </select>
    </div>
    
    <div class="form-group" v-if="['POST', 'PUT'].includes(method)">
      <label for="requestBody">Request Body (JSON)</label>
      <textarea 
        id="requestBody" 
        v-model="requestBodyText" 
        placeholder='{"key": "value"}'
        rows="5"
      ></textarea>
    </div>
    
    <div class="form-group">
      <button @click="sendRequest" :disabled="loading">
        {{ loading ? 'Sending...' : 'Send Request' }}
      </button>
    </div>
    
    <div v-if="error" class="error">
      <h3>Error</h3>
      <pre>{{ error }}</pre>
    </div>
    
    <div v-if="response" class="response">
      <h3>Response</h3>
      <div class="response-info">
        <div><strong>Status:</strong> {{ response.status }}</div>
        <div><strong>Status Text:</strong> {{ response.statusText }}</div>
      </div>
      <div class="response-data">
        <h4>Data</h4>
        <pre>{{ prettyResponse }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { proxyService } from '../services/proxy.service';

export default {
  name: 'ProxyExample',
  setup() {
    const apiUrl = ref('https://jsonplaceholder.typicode.com/posts/1');
    const method = ref('GET');
    const requestBodyText = ref('{\n  "title": "foo",\n  "body": "bar",\n  "userId": 1\n}');
    const response = ref(null);
    const error = ref(null);
    const loading = ref(false);
    
    const prettyResponse = computed(() => {
      if (!response.value || !response.value.data) return '';
      
      try {
        return JSON.stringify(response.value.data, null, 2);
      } catch (err) {
        return String(response.value.data);
      }
    });
    
    const sendRequest = async () => {
      error.value = null;
      response.value = null;
      loading.value = true;
      
      try {
        let requestBody = {};
        
        if (['POST', 'PUT'].includes(method.value) && requestBodyText.value) {
          try {
            requestBody = JSON.parse(requestBodyText.value);
          } catch (err) {
            error.value = `Invalid JSON in request body: ${err.message}`;
            loading.value = false;
            return;
          }
        }
        
        const options = {
          url: apiUrl.value,
          method: method.value,
          ...((['POST', 'PUT'].includes(method.value)) ? { body: requestBody } : {})
        };
        
        const result = await proxyService.request(options);
        response.value = result;
      } catch (err) {
        error.value = err.message || 'Unknown error occurred';
      } finally {
        loading.value = false;
      }
    };
    
    return {
      apiUrl,
      method,
      requestBodyText,
      response,
      error,
      loading,
      prettyResponse,
      sendRequest
    };
  }
};
</script>

<style scoped>
.proxy-example {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input, select, textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 14px;
}

button {
  padding: 10px 15px;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:disabled {
  background-color: #a5a5a5;
  cursor: not-allowed;
}

.error {
  margin-top: 20px;
  padding: 10px;
  background-color: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: 4px;
}

.response {
  margin-top: 20px;
  padding: 10px;
  background-color: #e8f5e9;
  border: 1px solid #c8e6c9;
  border-radius: 4px;
}

.response-info {
  margin-bottom: 10px;
  font-size: 14px;
}

pre {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-family: monospace;
  font-size: 13px;
}
</style>
