<template>
  <div class="logs">
    <div v-if="!showLogs" class="log-btn" @click="toggleLogs">
        Show Logs
    </div>
    <div v-else class="log-drawer" :style="{
            height: height + 'px',
            bottom: '30px',
            left: '0',
            right: '0',
    }">
        <div class="logs-draggable-line" ref="dragHandle" @mousedown="startDrag"></div>
        <div class="log-content">
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
            height: 100,
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
                this.height = newHeight;
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
.logs {
  .log-btn {
    position: fixed;
    bottom: 20px;
    right: 50%;
    transform: translateX(50%);
    z-index: 1;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    padding: 10px;
    cursor: pointer;
    text-align: center;
    border-radius: 5px;
    transition: background-color 0.3s;

    &:hover {
      background-color: #e0e0e0;
    }
  }
    .log-drawer {
        position: fixed;
        bottom: 30px;
        right: 0;
        left: 0;
        background-color: #fff;
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        overflow-y: auto;
        z-index: 1001;

         .logs-draggable-line{
            position: absolute;
            top: -5px;
            left: 0;
            right: 0;
            height: 5px;
            background-color: transparent;
            cursor: ns-resize;
        }
    
        .log-header {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        border-bottom: 1px solid #ccc;
    
        button {
            background-color: transparent;
            border: none;
            cursor: pointer;
    
            &:hover {
            color: #007bff;
            }
        }
        }
    }
}
</style>