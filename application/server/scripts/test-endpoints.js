const https = require('https');
const http = require('http');

const testEndpoints = [
  { url: 'http://localhost:3000/', name: 'Landing Page', expectStatus: 200 },
  { url: 'http://localhost:3000/app/login', name: 'Login Page (via proxy)', expectStatus: 200 },
  { url: 'http://localhost:3000/api/health', name: 'API Health Check', expectStatus: 200 },
  { url: 'http://localhost:3000/robots.txt', name: 'Robots.txt', expectStatus: 200 },
  { url: 'http://localhost:3000/sitemap.xml', name: 'Sitemap.xml', expectStatus: 200 },
  { url: 'http://localhost:3000/css/landing.css', name: 'Landing CSS', expectStatus: 200 },
  { url: 'http://localhost:3000/images/favicon.ico', name: 'Favicon', expectStatus: 200 },
];

async function testEndpoint(endpoint) {
  console.log(`Testing: ${endpoint.name} (${endpoint.url})`);
  
  return new Promise((resolve) => {
    const protocol = endpoint.url.startsWith('https') ? https : http;
    
    const req = protocol.get(endpoint.url, (res) => {
      const { statusCode } = res;
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const success = statusCode === endpoint.expectStatus;
        console.log(`[${success ? 'PASS' : 'FAIL'}] ${endpoint.name}: ${statusCode} (Expected: ${endpoint.expectStatus})`);
        resolve({
          success,
          statusCode,
          endpoint: endpoint.name,
          data: data.length > 100 ? `${data.substring(0, 100)}...` : data
        });
      });
    }).on('error', (err) => {
      console.log(`[FAIL] ${endpoint.name}: ${err.message}`);
      resolve({
        success: false,
        error: err.message,
        endpoint: endpoint.name
      });
    });
    
    req.on('error', (err) => {
      console.log(`[FAIL] ${endpoint.name}: ${err.message}`);
      resolve({
        success: false,
        error: err.message,
        endpoint: endpoint.name
      });
    });
    
    req.end();
  });
}

async function runTests() {
  console.log('Starting endpoint tests...');
  
  const results = await Promise.all(testEndpoints.map(testEndpoint));
  
  const passed = results.filter(r => r.success).length;
  const failed = results.length - passed;
  
  console.log(`\n=== Test Summary ===`);
  console.log(`Total Tests: ${results.length}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  
  return failed === 0;
}

runTests().then((allPassed) => {
  console.log(`\nTests ${allPassed ? 'PASSED' : 'FAILED'}`);
});
