import { proxyService } from "../service";
import {
  NodeStatus,
  NodeType,
  type envVariableMap,
  type ExecutionEmitter,
  type VariablePool,
} from "../types";
import Node from "./node";
import Variable from "./variable";

export default class HttpNode extends Node {
  baseUrl: Variable = new Variable({ name: "baseUrl", type: "string" });
  url: Variable = new Variable({ name: "url", type: "string" });
  pathParams: Variable[] = [];
  queryParams: Variable[] = [];
  headers: Variable[] = [];
  body: Variable = new Variable({ name: "body", type: "object" });
  method: string = "";

  constructor(id?: string) {
    super(id, NodeType.API);
    this.pathParams = [];
    this.queryParams = [];
    this.headers = [];
    this.method = "GET";
  }

  getUrl(globalStore: VariablePool, envVariableMap: envVariableMap): string {
    const baseUrl = this.baseUrl
      ? this.baseUrl.get(globalStore, envVariableMap)
      : "";
    const url = this.url ? this.url.get(globalStore, envVariableMap) : "";
    const path = this.pathParams.reduce((acc, param) => {
      const value = param.get(globalStore, envVariableMap);
      return acc.replace(
        new RegExp(`(:${param.name}|\\{${param.name}\\})`, "g"),
        value
      );
    }, url);

    const query = this.queryParams
      .map((param) => {
        const value = param.get(globalStore, envVariableMap);
        return `${param.name}=${encodeURIComponent(value)}`;
      })
      .join("&");
    return `${baseUrl}${path}${query ? `?${query}` : ""}`;
  }

  getHeaders(
    globalStore: VariablePool,
    envVariableMap: envVariableMap
  ): Record<string, string> {
    return this.headers.reduce((acc, header) => {
      acc[header.name] = header.get(globalStore, envVariableMap);
      return acc;
    }, {} as Record<string, string>);
  }

  getBody(globalStore: VariablePool, envVariableMap: envVariableMap): any {
    return this.body ? this.body.get(globalStore, envVariableMap) : null;
  }

  execute(
    globalStore: VariablePool,
    envVariableMap: envVariableMap,
    dataEmitter: ExecutionEmitter
  ): Promise<any> {
    this.nodeStatus = NodeStatus.IN_PROGRESS;
    this.error = null;
    dataEmitter(this.id, "nodeStatus", this.nodeStatus);
    dataEmitter(this.id, "error", this.error);

    const url = this.getUrl(globalStore, envVariableMap);
    const headers = this.getHeaders(globalStore, envVariableMap);
    const body = this.getBody(globalStore, envVariableMap);

    const options = {
      url,
      method: this.method,
      headers: {
        ...headers,
      },
      data: body || null,
    };

    if (this.method === "GET") {
      options.data = null;
    }
    if (this.method === "POST") {
      options.headers["Content-Type"] = "application/json";
    } else if (this.method === "PUT") {
      options.headers["Content-Type"] = "application/json";
    } else if (this.method === "DELETE") {
      options.data = null;
      options.headers["Content-Type"] = "application/json";
    }

    return new Promise((resolve) => {
      proxyService
        .request(options)
        .then((data: any) => {
          if (data.error) {
            this.hasError = true;
            dataEmitter(this.id, "hasError", true);
            this.error = data.error;
            this.nodeStatus = NodeStatus.FAILURE;
            dataEmitter(this.id, "nodeStatus", this.nodeStatus);
            resolve(undefined);
          } else {
            this.hasError = false;
            dataEmitter(this.id, "hasError", false);
            this.nodeStatus = NodeStatus.SUCCESS;
            dataEmitter(this.id, "nodeStatus", this.nodeStatus);
            resolve(data.data);
          }
        })
        .catch((error) => {
          this.nodeStatus = NodeStatus.FAILURE;
          this.error = error;
          dataEmitter(this.id, "nodeStatus", this.nodeStatus);
          dataEmitter(this.id, "error", this.error);
          resolve(null);
        })
        .finally(() => {});
    });
  }

  serialized() {
    return {
      ...super.serialized(),
      baseUrl: this.baseUrl.serialized(),
      url: this.url.serialized(),
      pathParams: this.pathParams.map((param) => param.serialized()),
      queryParams: this.queryParams.map((param) => param.serialized()),
      headers: this.headers.map((header) => header.serialized()),
      body: this.body.serialized(),
      method: this.method,
    };
  }

  deserialized(serializedNode: any) {
    super.deserialized(serializedNode);
    this.baseUrl = new Variable().deserialized(serializedNode.baseUrl);
    this.url = new Variable().deserialized(serializedNode.url);
    this.pathParams = serializedNode.pathParams.map((param: any) =>
      new Variable().deserialized(param)
    );
    this.queryParams = serializedNode.queryParams.map((param: any) =>
      new Variable().deserialized(param)
    );
    this.headers = serializedNode.headers.map((header: any) =>
      new Variable().deserialized(header)
    );
    this.body = new Variable().deserialized(serializedNode.body);
    this.method = serializedNode.method;
  }
}
