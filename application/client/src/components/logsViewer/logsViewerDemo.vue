<template>
  <div class="logs-viewer-demo">
    <h2>Logs Viewer Demo</h2>
    <div class="controls">
      <button @click="addInfoLog" class="control-button info">Add Info Log</button>
      <button @click="addWarningLog" class="control-button warning">Add Warning Log</button>
      <button @click="addErrorLog" class="control-button error">Add Error Log</button>
      <button @click="addDebugLog" class="control-button debug">Add Debug Log</button>
      <button @click="addJsonLog" class="control-button json">Add JSON Log</button>
      <button @click="addMultilineLog" class="control-button multiline">Add Multiline Log</button>
      <button @click="clearLogs" class="control-button clear">Clear Logs</button>
    </div>
    <div class="viewer-container">
      <logs-viewer :logs="logs" @clear="clearLogs"></logs-viewer>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import LogsViewer from './logsViewer.vue';

interface LogEntry {
  timestamp: number;
  type: 'info' | 'error' | 'warning' | 'debug';
  message: string | object;
}

export default defineComponent({
  name: 'LogsViewerDemo',
  components: {
    LogsViewer,
  },
  setup() {
    const logs = ref<LogEntry[]>([
      {
        timestamp: Date.now() - 5000,
        type: 'info',
        message: 'Application started'
      },
      {
        timestamp: Date.now() - 4000,
        type: 'debug',
        message: 'Debug mode enabled'
      },
      {
        timestamp: Date.now() - 3000,
        type: 'info',
        message: 'Loading configuration...'
      },
      {
        timestamp: Date.now() - 2000,
        type: 'warning',
        message: 'Configuration file is using deprecated format'
      }
    ]);

    // Sample JSON for demo
    const sampleJsonData = {
      status: "success",
      data: {
        user: {
          id: 123,
          name: "John Doe",
          email: "john@example.com",
          preferences: {
            theme: "dark",
            notifications: true
          }
        },
        permissions: ["read", "write", "admin"],
        stats: {
          logins: 42,
          lastActive: "2025-05-29T10:30:00Z"
        }
      }
    };

    // Sample multiline text
    const sampleMultilineText = `Error stack trace:
Error: Something went wrong
    at Function.Module._load (module.js:325:25)
    at Function.Module.runMain (module.js:448:10)
    at startup (node.js:146:18)
    at node.js:404:3`;

    const addInfoLog = () => {
      logs.value.push({
        timestamp: Date.now(),
        type: 'info',
        message: `Info log message at ${new Date().toLocaleTimeString()}`
      });
    };

    const addWarningLog = () => {
      logs.value.push({
        timestamp: Date.now(),
        type: 'warning',
        message: `Warning: This is a sample warning at ${new Date().toLocaleTimeString()}`
      });
    };

    const addErrorLog = () => {
      logs.value.push({
        timestamp: Date.now(),
        type: 'error',
        message: `Error: Something went wrong at ${new Date().toLocaleTimeString()}`
      });
    };

    const addDebugLog = () => {
      logs.value.push({
        timestamp: Date.now(),
        type: 'debug',
        message: `Debug information: ${Math.random().toString(36).substring(2, 15)}`
      });
    };

    const addJsonLog = () => {
      // Clone the sample JSON and add a timestamp
      const jsonData = { ...sampleJsonData } as typeof sampleJsonData & { timestamp?: string };
      jsonData.timestamp = new Date().toISOString();
      
      logs.value.push({
        timestamp: Date.now(),
        type: 'info',
        message: jsonData
      });
    };

    const addMultilineLog = () => {
      logs.value.push({
        timestamp: Date.now(),
        type: 'error',
        message: sampleMultilineText
      });
    };

    const clearLogs = () => {
      logs.value = [];
    };

    return {
      logs,
      addInfoLog,
      addWarningLog,
      addErrorLog,
      addDebugLog,
      addJsonLog,
      addMultilineLog,
      clearLogs
    };
  },
});
</script>

<style scoped>
.logs-viewer-demo {
  padding: var(--spacing-xlarge);
  max-width: 1000px;
  margin: 0 auto;
}

h2 {
  margin-bottom: var(--spacing-xlarge);
  color: var(--color-text-primary);
}

.controls {
  margin-bottom: var(--spacing-large);
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-medium);
}

.control-button {
  padding: var(--spacing-medium) var(--spacing-large);
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  box-shadow: var(--shadow-drop);
}

.control-button.info {
  background-color: var(--color-info);
}

.control-button.warning {
  background-color: var(--color-warning);
}

.control-button.error {
  background-color: var(--color-danger);
}

.control-button.debug {
  background-color: var(--color-success);
}

.control-button.json {
  background-color: var(--color-secondary);
}

.control-button.multiline {
  background-color: var(--color-text-secondary);
}

.control-button.clear {
  background-color: var(--color-border);
}

.control-button:hover {
  filter: brightness(1.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--color-primary-rgb), 0.2);
}

.viewer-container {
  height: 500px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  overflow: hidden;
  box-shadow: var(--shadow-drop);
}
</style>
