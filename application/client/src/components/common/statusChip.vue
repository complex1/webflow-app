<template>
  <div class="status-chip text-bold" :class="statusClass">
    <i :class="iconClass"></i>
    <span>{{ displayText || status }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { NodeStatus } from '../../classes/Node';
import type { PropType } from 'vue';


type SizeType = 'small' | 'medium' | 'large';

export default defineComponent({
  name: 'StatusChip',
  props: {
    status: {
      type: String as PropType<string>,
      required: true,
      validator(value: string): boolean {
        return Object.values(NodeStatus).includes(value as NodeStatus);
      },
    },
    text: {
      type: String,
      default: undefined
    },
    size: {
      type: String as PropType<SizeType>,
      default: 'medium',
      validator(value: string): boolean {
        return ['small', 'medium', 'large'].includes(value);
      },
    },
  },
  setup(props) {
    const displayText = computed(() => props.text);
    
    const statusClass = computed(() => {
      let sizeClass = '';
      let statusClass = '';
      
      switch (props.size) {
        case 'small':
          sizeClass = 'text-xs';
          break;
        case 'medium':
          sizeClass = 'text-s';
          break;
        case 'large':
          sizeClass = 'text-l';
          break;
        default:
          sizeClass = '';
      }
      
      switch (props.status) {
        case NodeStatus.PENDING:
          statusClass = 'bg-warning text-white';
          break;
        case NodeStatus.IN_PROGRESS:
          statusClass = 'bg-primary text-white';
          break;
        case NodeStatus.SUCCESS:
          statusClass = 'bg-success text-white';
          break;
        case NodeStatus.FAILURE:
          statusClass = 'bg-danger text-white';
          break;
        case NodeStatus.INACTIVE:
          statusClass = 'bg-secondary text-white';
          break;
        case NodeStatus.SKIPPED:
          statusClass = 'bg-info text-white';
          break;
        default:
          statusClass = 'bg-default text-white';
          break;
      }
      
      return `${sizeClass} ${statusClass}`;
    });
    
    const iconClass = computed(() => {
      switch (props.status) {
        case NodeStatus.PENDING:
          return 'pi pi-clock';
        case NodeStatus.IN_PROGRESS:
          return 'pi pi-spinner pi-spin';
        case NodeStatus.SUCCESS:
          return 'pi pi-check-circle';
        case NodeStatus.FAILURE:
          return 'pi pi-times-circle';
        case NodeStatus.INACTIVE:
          return 'pi pi-ban';
        case NodeStatus.SKIPPED:
          return 'pi pi-forward';
        default:
          return 'pi pi-question-circle';
      }
    });
    
    return {
      displayText,
      statusClass,
      iconClass
    };
  },
});
</script>

<style scoped>
.status-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  font-weight: bold;
  font-size: 0.6em;
  padding: 0.2em 0.5em;
  border-radius: 1em;
}

</style>
