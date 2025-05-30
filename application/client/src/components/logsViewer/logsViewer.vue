<template>
  <div class="logs-viewer fh">
    <div class="logs-header flex-v-center flex-space-between">
      <h2 class="logs-title">{{ title }}</h2>
      <div class="logs-filter">
        <div class="logs-actions">
          <button @click="clearLogs" class="action-button" title="Clear console">
            <i class="pi pi-trash"></i>
          </button>
          <button @click="copyLogs" class="action-button" title="Copy logs to clipboard">
            <i class="pi pi-copy"></i>
          </button>
          <button @click="closeLogs" class="action-button" title="Close logs">
            <i class="pi pi-times"></i>
          </button>
        </div>
      </div>
    </div>
    
    <div class="logs-container" ref="logsContainer">
      <div 
        v-for="(log, index) in filteredLogs" 
        :key="index" 
        class="log-entry"
        :class="log.type"
      >
        <div class="log-timestamp">{{ formatTimestamp(log.timestamp) }}</div>
        <div class="log-icon"><i :class="getLogIcon(log.type)"></i></div>
        <div class="log-content">
          <template v-if="isJsonObject(log.message)">
            <json-viewer :json-data="parseJsonMessage(log.message)" :max-expand-depth="1"></json-viewer>
          </template>
          <template v-else-if="containsNewlines(log.message)">
            <div class="multi-line">
              <pre>{{ log.message }}</pre>
            </div>
          </template>
          <template v-else>
            <span>{{ log.message }}</span>
          </template>
        </div>
      </div>
      <div v-if="filteredLogs.length === 0" class="empty-logs">
        <p>No log entries to display</p>
        <p v-if="filterActive" class="filter-hint">Try adjusting your filter settings</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import JsonViewer from './jsonViewer.vue';
import type { LogEntry } from '../../classes/logger';
import { LogType } from '../../classes/logger';

export default defineComponent({
  name: 'LogsViewer',
  components: {
    JsonViewer
  },
  props: {
    logs: {
      type: Array as () => LogEntry[],
      required: true
    },
    title: {
      type: String,
      default: 'Logs Viewer'
    }
  },
  emits: ['clear', 'close'],
  setup(props, { emit }) {
    const logsContainer = ref<HTMLElement | null>(null);
    const autoScroll = ref(true);

    const filteredLogs = computed(() => {
      return props.logs;
    });

    const filterActive = computed(() => {
      return false; // Always false since we don't have filtering now
    });

    const scrollToBottom = () => {
      if (logsContainer.value && autoScroll.value) {
        setTimeout(() => {
          if (logsContainer.value) {
            logsContainer.value.scrollTop = logsContainer.value.scrollHeight;
          }
        }, 0);
      }
    };

    const formatTimestamp = (timestamp: number): string => {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    };

    const getLogIcon = (type: LogType): string => {
      // Map log types to their respective icons
      const iconMap: Record<LogType, string> = {
        [LogType.INFO]: 'pi pi-info-circle',
        [LogType.ERROR]: 'pi pi-exclamation-triangle',
        [LogType.WARNING]: 'pi pi-exclamation-circle',
        [LogType.WARN]: 'pi pi-exclamation-circle',
        [LogType.DEBUG]: 'pi pi-bug',
        [LogType.SUCCESS]: 'pi pi-check-circle'
      };
      return iconMap[type] || 'pi pi-info-circle';
    };



    const clearLogs = () => {
      emit('clear');
    };

    const copyLogs = () => {
      const text = filteredLogs.value
        .map(log => {
          const time = formatTimestamp(log.timestamp);
          let message = '';
          
          if (typeof log.message === 'string') {
            message = log.message;
          } else {
            try {
              message = JSON.stringify(log.message, null, 2);
            } catch (e) {
              message = String(log.message);
            }
          }
          
          return `[${time}] [${log.type.toUpperCase()}] ${message}`;
        })
        .join('\n');
        
      navigator.clipboard.writeText(text)
        .then(() => {
          console.log('Logs copied to clipboard');
          // You could add a toast notification here
        })
        .catch(err => {
          console.error('Failed to copy logs', err);
        });
    };

    const isJsonObject = (message: any): boolean => {
      if (typeof message === 'object' && message !== null) {
        return true;
      }
      
      if (typeof message === 'string') {
        try {
          const parsed = JSON.parse(message);
          return typeof parsed === 'object' && parsed !== null;
        } catch (e) {
          return false;
        }
      }
      
      return false;
    };

    const parseJsonMessage = (message: any): object => {
      if (typeof message === 'object' && message !== null) {
        return message;
      }
      
      if (typeof message === 'string') {
        try {
          return JSON.parse(message);
        } catch (e) {
          return { error: 'Failed to parse JSON', message };
        }
      }
      
      return { value: message };
    };

    const containsNewlines = (message: any): boolean => {
      if (typeof message !== 'string') {
        return false;
      }
      
      return message.includes('\n') || message.includes('\r');
    };

    const closeLogs = () => {
      emit('close');
    };

    // Watch for changes to the logs array and scroll to bottom
    watch(() => props.logs.length, () => {
      scrollToBottom();
    });

    onMounted(() => {
      scrollToBottom();
    });

    return {
      logsContainer,
      filteredLogs,
      filterActive,
      formatTimestamp,
      getLogIcon,
      clearLogs,
      copyLogs,
      isJsonObject,
      parseJsonMessage,
      containsNewlines,
      closeLogs
    };
  }
});
</script>

<style scoped>
.logs-viewer {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  font-size: var(--font-size-small);
  color: var(--color-text-primary);
  background-color: var(--color-background);
  border-radius: 4px;
  overflow: hidden;
}

.logs-header {
  padding: var(--spacing-medium);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.logs-title {
  font-size: var(--font-size-medium);
  font-weight: bold;
  color: var(--color-text-primary);
  margin: 0;
}

.logs-filter {
  display: flex;
  align-items: center;
  gap: var(--spacing-medium);
}

.logs-actions {
  display: flex;
  gap: var(--spacing-small);
}

.action-button {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  border-radius: 4px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.action-button:hover {
  background-color: var(--color-light);
  border-color: var(--color-primary);
}

.logs-container {
  flex: 1;
  overflow-y: auto;
  padding: 0;
  max-height: calc(100% - 50px); /* Adjust based on header height */
}

.log-entry {
  display: flex;
  padding: var(--spacing-small) var(--spacing-medium);
  border-bottom: 1px solid var(--color-border-light, rgba(0,0,0,0.05));
  min-height: 24px;
  align-items: flex-start;
  transition: all 0.2s ease;
}

.log-entry:hover {
  filter: brightness(0.95);
}

.log-entry.info {
  color: var(--color-info);
  background-color: rgba(var(--color-info-rgb), 0.05);
  border-left: 3px solid var(--color-info);
}

.log-entry.error {
  color: var(--color-danger);
  background-color: rgba(var(--color-danger-rgb), 0.05);
  border-left: 3px solid var(--color-danger);
}

.log-entry.warning, .log-entry.warn {
  color: var(--color-warning);
  background-color: rgba(var(--color-warning-rgb), 0.05);
  border-left: 3px solid var(--color-warning);
}

.log-entry.debug {
  color: var(--color-success);
  background-color: rgba(var(--color-success-rgb), 0.05);
  border-left: 3px solid var(--color-success);
}

.log-entry.success {
  color: var(--color-success);
  background-color: rgba(var(--color-success-rgb), 0.05);
  border-left: 3px solid var(--color-success);
}

.log-timestamp {
  flex-shrink: 0;
  width: 80px;
  color: var(--color-text-secondary);
  padding-right: var(--spacing-medium);
}

.log-icon {
  flex-shrink: 0;
  width: 20px;
  margin-right: var(--spacing-medium);
  text-align: center;
}

.log-content {
  flex: 1;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  color: var(--color-text-primary);
}

.multi-line {
  background-color: var(--color-light);
  padding: var(--spacing-medium);
  border-radius: 4px;
  margin: var(--spacing-small) 0;
  overflow-x: auto;
  border: 1px solid var(--color-border);
}

.multi-line pre {
  margin: 0;
  white-space: pre-wrap;
  tab-size: 4;
}

.empty-logs {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100px;
  color: var(--color-text-secondary);
}

.filter-hint {
  font-size: var(--font-size-small);
  margin-top: var(--spacing-medium);
  color: var(--color-text-secondary);
}

.icon {
  font-size: var(--font-size-medium);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* PrimeIcons specific styling */
.pi {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>