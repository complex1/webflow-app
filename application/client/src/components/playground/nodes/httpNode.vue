<template>
  <div class="bg-white round-2 shadow-2">
    <connection-handel :id="nodeData.id"></connection-handel>
    <node-header :nodeData="nodeData" />
    <div class="p-m">
      <div class="http-api-container flex-v-center p-s round-1 bg-light mb-m">
        <span
          :class="`http-method-badge text-s text-center px-xs py-2xs round-1 ${getMethodClass(nodeData.method)}`"
        >
          {{ nodeData.method }}
        </span>
        <span class="text-s text-primary-bg ml-s text-truncate" style="max-width: 250px">
          {{ nodeData.baseUrl }}{{ nodeData.url }}
        </span>
      </div>

      <div class="grid-2 gap-m">
        <div class="request-section">
          <div class="section-header border-bottom pb-2xs mb-s">
            <div class="text-s text-primary font-600">Request</div>
          </div>
          
          <div v-if="nodeData.body" class="mb-m">
            <div class="text-xs text-secondary font-500 mb-2xs">Request Body</div>
            <variable-node :variable="nodeData.body"></variable-node>
          </div>
          
          <div v-if="nodeData.pathParams && nodeData.pathParams.length" class="mb-m">
            <div class="text-xs text-secondary font-500 mb-2xs">
              Path Parameters <span class="badge-count">{{ nodeData.pathParams.length }}</span>
            </div>
            <variable-node
              v-for="(param, index) in nodeData.pathParams"
              :key="`path-${index}`"
              :variable="param"
            ></variable-node>
          </div>
          
          <div v-if="nodeData.queryParams && nodeData.queryParams.length" class="mb-m">
            <div class="text-xs text-secondary font-500 mb-2xs">
              Query Parameters <span class="badge-count">{{ nodeData.queryParams.length }}</span>
            </div>
            <variable-node
              v-for="(param, index) in nodeData.queryParams"
              :key="`query-${index}`"
              :variable="param"
            ></variable-node>
          </div>
          
          <div v-if="nodeData.headers && nodeData.headers.length" class="mb-m">
            <div class="text-xs text-secondary font-500 mb-2xs">
              Headers <span class="badge-count">{{ nodeData.headers.length }}</span>
            </div>
            <variable-node
              v-for="(header, index) in nodeData.headers"
              :key="`header-${index}`"
              :variable="header"
            ></variable-node>
          </div>
        </div>
        
        <node-response :nodeData="nodeData"></node-response>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapState } from 'vuex';
import { Workflow } from '../../../classes/Workflow';
import statusChip from '../../common/statusChip.vue';
import NodeHeader from './nodeHeader.vue';
import ConnectionHandel from './connectionHandel.vue';
import NodeState from './nodeState.vue';
import VariableNode from './variableNode.vue';
import HttpNode from '../../../classes/HttpNode';
import NodeResponse from './nodeResponse.vue';

export default {
  components: {
    statusChip,
    VariableNode,
    ConnectionHandel,
    NodeState,
    NodeHeader,
    NodeResponse,
  },
  name: 'HttpNode',
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      workflow: (state: any): Workflow => state.workflowModule.workflow as Workflow,
    }),
    nodeData(): HttpNode | null {
      if (!this.workflow) return null;
      return this.workflow.getNode(this.id);
    },
  },
  methods: {
    getMethodClass(method: string): string {
      switch (method) {
        case 'GET': return 'method-get';
        case 'POST': return 'method-post';
        case 'PUT': return 'method-put';
        case 'DELETE': return 'method-delete';
        case 'PATCH': return 'method-patch';
        default: return '';
      }
    }
  }
};
</script>

<style scoped>
.http-method-badge {
  display: inline-block;
  min-width: 60px;
  font-weight: 600;
}
.method-get {
  background-color: var(--color-success-light);
  color: var(--color-success);
}
.method-post {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
}
.method-put {
  background-color: var(--color-warning-light);
  color: var(--color-warning);
}
.method-delete {
  background-color: var(--color-danger-light);
  color: var(--color-danger);
}
.method-patch {
  background-color: var(--color-info-light);
  color: var(--color-info);
}
.border-bottom {
  border-bottom: 1px solid var(--color-border);
}
.badge-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--color-secondary-light);
  color: var(--color-secondary);
  font-size: 0.7rem;
  height: 16px;
  min-width: 16px;
  padding: 0 4px;
  border-radius: 8px;
  margin-left: 4px;
}
.py-2xs {
  padding-top: 2px;
  padding-bottom: 2px;
}
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
