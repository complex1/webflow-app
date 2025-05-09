<template>
  <div class="http-node bg-white round-1">
    <connection-handel :id="nodeData.id"></connection-handel>
    <node-header :nodeData="nodeData" />
    <hr />
    <div class="http-node-content px-m py-s">
      <div class="http-node-api">
        <span
          :class="`http-methods v-center px-s text-s round-1 http-node-methods-${nodeData.method}`"
        >
          <small>
            {{ nodeData.method }}
          </small>
        </span>
        <span class="http-node-url text-s text-primary-bg pl-m">
          {{ nodeData.baseUrl }}{{ nodeData.url }}
        </span>
      </div>

      <div class="grid-2">
        <div>
          <hr class="mt-s" />
          <div class="text-s text-primary text-600 my-s">Request:</div>
          <hr />
          <div class="mt-m" v-if="nodeData.body">
            <div class="text-s text-500 text-secondary">Request Body</div>
            <variable-node
              v-if="nodeData.body"
              :variable="nodeData.body"
            ></variable-node>
          </div>
          <div class="mt-m" v-if="nodeData.pathParams.length">
            <div class="text-s text-500 text-secondary">Path Param</div>
            <variable-node
              v-for="(param, index) in nodeData.pathParams"
              :key="index"
              :variable="param"
            ></variable-node>
          </div>
          <div class="mt-m" v-if="nodeData.queryParams.length">
            <div class="text-s text-500 text-secondary">Query Param</div>
            <variable-node
              v-for="(param, index) in nodeData.queryParams"
              :key="index"
              :variable="param"
            ></variable-node>
          </div>
          <div class="mt-m" v-if="nodeData.headers.length">
            <div class="text-s text-500 text-secondary">Headers</div>
            <variable-node
              v-for="(param, index) in nodeData.headers"
              :key="index"
              :variable="param"
            ></variable-node>
          </div>
        </div>
        <node-response :nodeData="nodeData"></node-response>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapState } from "vuex";
import { Workflow } from "../../../classes/Workflow";
import Popover from "../../common/popover.vue";
import statusChip from "../../common/statusChip.vue";
import NodeHeader from "./nodeHeader.vue";
import ConnectionHandel from "./connectionHandel.vue";
import NodeState from "./nodeState.vue";
import VariableNode from "./variableNode.vue";
import HttpNode from "../../../classes/HttpNode";
import NodeResponse from "./nodeResponse.vue";
export default {
  components: {
    statusChip,
    VariableNode,
    Popover,
    ConnectionHandel,
    NodeState,
    NodeHeader,
    NodeResponse,
  },
  name: "HttpNode",
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
      workflow: (state): Workflow => state.workflowModule.workflow,
    }),
    nodeData(): HttpNode {
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
