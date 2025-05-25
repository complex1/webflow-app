<template>
  <div class="proxy-test-page">
    <h1>API Proxy Test</h1>
    <p class="description">
      Test the server-side proxy API to make external API requests through the server.
      This helps avoid CORS issues and keeps sensitive API keys on the server.
    </p>
    
    <ProxyExample />
  </div>
</template>

<script>
import ProxyExample from '../components/ProxyExample.vue';

export default {
  name: 'ProxyTestPage',
  components: {
    ProxyExample
  }
};
</script>

<style scoped>
.proxy-test-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  margin-bottom: 10px;
  color: #4f46e5;
}

.description {
  margin-bottom: 30px;
  color: #666;
  line-height: 1.5;
}
</style>
