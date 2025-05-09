<template>
  <div class="http-node bg-white round-1">
    <connection-handel :id="nodeData.id"></connection-handel>
    <node-header :nodeData="nodeData" />
    <hr />
    <div class="http-node-content p-m">
      <div class="http-node-api">
        <span
          :class="`http-methods px-m py-s text-s round-1 http-node-methods-${nodeData.method}`"
          >{{ nodeData.method }}</span
        >
        <span class="http-node-url text-s text-primary-bg pl-m">
          {{ nodeData.baseUrl }}{{ nodeData.url }}
        </span>
      </div>
      <hr class="mt-m" />
      <div class="grid-2">
        <div>
          <div class="mt-m" v-if="nodeData.body">
            <h4 class="text-s">Request Body</h4>
            <variable-node
              v-if="nodeData.body"
              :variable="nodeData.body"
            ></variable-node>
          </div>
          <div class="mt-m" v-if="nodeData.pathParams.length">
            <h4 class="text-s">Path Param</h4>
            <variable-node
              v-for="(param, index) in nodeData.pathParams"
              :key="index"
              :variable="param"
            ></variable-node>
          </div>
          <div class="mt-m" v-if="nodeData.queryParams.length">
            <h4 class="text-s">Query Param</h4>
            <variable-node
              v-for="(param, index) in nodeData.queryParams"
              :key="index"
              :variable="param"
            ></variable-node>
          </div>
          <div class="mt-m" v-if="nodeData.headers.length">
            <h4 class="text-s">Headers</h4>
            <variable-node
              v-for="(param, index) in nodeData.headers"
              :key="index"
              :variable="param"
            ></variable-node>
          </div>
        </div>
        <div class="http-node-res mt-m">
          <popover :tooltip="false">
            <template #target>
              <span class="text-s text-secondary flex-v-center">
                <span class="px-s">Response</span>
                <small class="pi pi-info-circle cursor-pointer"></small>
              </span>
            </template>
            <template #content>
              <node-state :node="nodeData" />
            </template>
          </popover>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapState } from "vuex";
import { Workflow } from "../../../classes/Workflow";
import Popover from "../../common/popover.vue";
import statusChip from "../../common/statusChip.vue";
import NodeHeader from './nodeHeader.vue';
import ConnectionHandel from "./connectionHandel.vue";
import NodeState from './nodeState.vue';
import VariableNode from "./variableNode.vue";
import HttpNode from '../../../classes/HttpNode';
export default {
  components: { statusChip, VariableNode, Popover, ConnectionHandel, NodeState, NodeHeader },
  name: "HttpNode",
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapState({
        workflow: (state):Workflow => state.workflowModule.workflow,
    }),
    nodeData (): HttpNode {
        return this.workflow.getNode(this.id);
    },
  },
};
</script>

<style scoped lang="scss">
.http-node {
  min-width: 200px;
  filter: drop-shadow(var(--shadow-drop));

  &-url {
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &-methods {
    &-GET {
      background-color: var(--color-success);
      color: var(--color-white);
    }
    &-POST {
      background-color: var(--color-primary);
      color: var(--color-white);
    }
    &-PUT {
      background-color: var(--color-warning);
      color: var(--color-white);
    }
    &-DELETE {
      background-color: var(--color-danger);
      color: var(--color-white);
    }
    &-PATCH {
      background-color: var(--color-info);
      color: var(--color-white);
    }
  }
  &-res {
    display: flex;
    align-items: flex-end;
    flex-direction: column;
  }
}
</style>
