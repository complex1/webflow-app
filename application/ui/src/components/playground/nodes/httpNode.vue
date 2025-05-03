<template>
  <div class="http-node bg-white shadow-1 round-1">
    <connection-handel :id="nodeData.id"></connection-handel>
    <div class="http-node-header p-s gap-4 flex-space-between flex-v-center">
      <div>
        <h3 class="text-dark text-m">{{ nodeData.name }}</h3>
        <p v-if="nodeData.description" class="text-secondry text-s">
          {{ nodeData.description }}
        </p>
      </div>
      <div class="flex-v-center" >
        <status-chip :status="nodeData.nodeStatus"></status-chip>
        <popover>
          <template #target>
            <button class="btn btn-icon ml-m">
              <i class="pi pi-ellipsis-v cursor-pointer"></i>
            </button>
          </template>
          <template #content>
            <div class="text-s">
              <strong>Status:</strong> {{ nodeData.nodeStatus }}
              <br />
              <strong>Executing:</strong> {{ nodeData.executing }}
              <br />
              <strong>Error:</strong> {{ nodeData.hasError }}
              <br />
              <strong>Error Message:</strong> {{ nodeData.errorMessage }}
            </div>
          </template>
        </popover>
      </div>
    </div>
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
          <div class="mt-m">
            <h4 class="text-s">Path Param</h4>
            <variable-node
              v-for="(param, index) in nodeData.pathParams"
              :key="index"
              :variable="param"
            ></variable-node>
          </div>
          <div class="mt-m">
            <h4 class="text-s">Query Param</h4>
            <variable-node
              v-for="(param, index) in nodeData.queryParams"
              :key="index"
              :variable="param"
            ></variable-node>
          </div>
          <div class="mt-m">
            <h4 class="text-s">Headers</h4>
            <variable-node
              v-for="(param, index) in nodeData.headers"
              :key="index"
              :variable="param"
            ></variable-node>
          </div>
        </div>
        <div class="http-node-res mt-m">
          <popover :tooltip="true">
            <template #target>
              <span class="text-s text-secondary flex-v-center">
                <span class="px-s">Response</span>
                <small class="pi pi-info-circle cursor-pointer"></small>
              </span>
            </template>
            <template #content>
              <node-state />
            </template>
          </popover>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapState } from "vuex";
import HttpNode from "../../../classes/HttpNode";
import { Workflow } from "../../../classes/Workflow";
import Popover from "../../common/popover.vue";
import statusChip from "../../common/statusChip.vue";
import ConnectionHandel from "./connectionHandel.vue";
import NodeState from './nodeState.vue';
import VariableNode from "./variableNode.vue";
export default {
  components: { statusChip, VariableNode, Popover, ConnectionHandel, NodeState },
  name: "HttpNode",
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      nodeData: {
        id: "4",
        name: "shuabhm",
        description: "",
        type: "HTTP",
        nodeStatus: "INACTIVE",
        nodeData: {
          name: "shuabhm",
          age: 20,
          gender: "unknown",
          description: "",
        },
        executing: false,
        hasError: false,
        errorMessage: null,
        order: 0,
        baseUrl: "http://loclahost:4000",
        url: "/guest/api/:pathParam",
        pathParams: [
          {
            id: "1",
            name: "pathParam",
            description: " wfcwer fqw er",
            defaultValue: null,
            type: "string",
            formStore: true,
            required: false,
          },
        ],
        queryParams: [
          {
            id: "2",
            name: "test",
            description: "",
            defaultValue: null,
            type: "string",
            formStore: true,
            required: false,
          },
        ],
        headers: [
          {
            id: "3",
            name: "token",
            description: "",
            defaultValue: null,
            type: "string",
            formStore: true,
            required: false,
          },
        ],
        body: null,
        method: "POST",
      },
    };
  },
  computed: {
    // ...mapState({
    //     workflow: (state):Workflow => state.workflowModule.workflow,
    // }),
    // nodeData (): HttpNode {
    //     return this.workflow.getNode(this.id);
    // },
  },
};
</script>

<style scoped lang="scss">
.http-node {
  min-width: 200px;

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
