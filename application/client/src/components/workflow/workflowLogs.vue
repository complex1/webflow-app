<template>
  <div class="logs">
    <div v-if="!showLogs" class="log-btn flex-v-center" @click="toggleLogs">
        <i class="pi pi-list" style="margin-right: var(--spacing-small);"></i>
        <span>Show Logs</span>
    </div>
    <div v-else class="log-drawer" :style="{
            height: height + 'px',
            bottom: '0',
            left: '0',
            right: '0',
    }">
        <div class="logs-draggable-line" ref="dragHandle" @mousedown="startDrag"></div>
        <div class="log-content fh">
            <logs-viewer :logs="logs" title="Workflow Logs" @close="toggleLogs" />
        </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import logsViewer from '../logsViewer/logsViewer.vue';
export default {
  components: { logsViewer },
    name: 'WorkflowLogs',
    data() {
        return {
            showLogs: false,
            height: 200,
        };
    },
    computed: {
        ...mapState({
            logs: state => state.workflowLoggerModule.logs,
        }),
    },
    methods: {
        toggleLogs() {
            this.showLogs = !this.showLogs;
        },
        startDrag(event) {
            const onMouseMove = (e) => {
                const windowHeight = window.innerHeight;
                const newHeight = windowHeight - e.clientY;
                this.height = Math.max(150, newHeight); // Minimum height of 150px and maximum height of window height minus 50px
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        },
    },
}
</script>

<style lang="scss" scoped>
/* Using CSS variables from the global application style */
.logs {
  .log-btn {
    position: fixed;
    bottom: var(--spacing-xlarge);
    right: 50%;
    transform: translateX(50%);
    z-index: 1;
    background-color: var(--color-light);
    border: 1px solid var(--color-border);
    padding: var(--spacing-medium);
    cursor: pointer;
    text-align: center;
    border-radius: 5px;
    transition: background-color 0.3s;
    box-shadow: var(--shadow-drop);

    &:hover {
      background-color: var(--color-background);
    }
  }
    .log-drawer {
        position: fixed;
        bottom: 0;
        right: 0;
        left: 0;
        background-color: var(--color-background);
        box-shadow: 0 -2px 10px var(--mask-color);
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        overflow-y: auto;
        z-index: 1001;
        border-top: 1px solid var(--color-border);

         .logs-draggable-line{
            position: absolute;
            top: -5px;
            left: 0;
            right: 0;
            height: 10px;
            background-color: transparent;
            cursor: ns-resize;
            
            &:hover {
              &:after {
                content: '';
                position: absolute;
                top: 4px;
                left: 50%;
                transform: translateX(-50%);
                width: 40px;
                height: 2px;
                background-color: var(--color-border);
                border-radius: 2px;
              }
            }
        }
    
        .log-header {
        display: flex;
        justify-content: space-between;
        padding: var(--spacing-medium);
        border-bottom: 1px solid var(--color-border);
    
        button {
            background-color: transparent;
            border: none;
            cursor: pointer;
    
            &:hover {
            color: var(--color-primary);
            }
        }
        }
    }
}
</style>