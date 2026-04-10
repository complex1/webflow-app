/**
 * Transform nodes execute user-authored JavaScript via `new Function(...)`.
 * Anyone who can edit or import a webflow can run arbitrary code in the browser
 * context. Treat saved flow JSON as untrusted unless your product model explicitly
 * accepts that risk (e.g. private single-tenant workspaces only).
 */
import {
  NodeStatus,
  NodeType,
  type ExecutionEmitter,
  type VariablePool,
} from "../types";
import Node from "./node";
import Variable from "./variable";

export default class TransformNode extends Node {
  parameters: Variable[];
  transform: string;

  constructor(config?: {
    id: string;
    parameters?: Variable[];
    transform?: string;
  }) {
    super(config?.id, NodeType.TRANSFORM);
    this.parameters = config?.parameters || ([] as Variable[]);
    this.transform = config?.transform || "";
  }

  execute(
    globalStore: VariablePool,
    envVariableMap: Record<string, string>,
    dataEmitter: ExecutionEmitter
  ): any {
    this.nodeStatus = NodeStatus.IN_PROGRESS;
    this.error = null;
    dataEmitter(this.id, "nodeStatus", this.nodeStatus);
    dataEmitter(this.id, "error", this.error);
    const paramsNames = this.parameters.map((param) => param.name);
    const paramValues = this.parameters.map(
      (param) => param.get(globalStore, envVariableMap) || null
    );

    return new Promise((resolve) => {
      try {
        const transformFunction = new Function(...paramsNames, this.transform);
        const result = transformFunction(...paramValues);
        this.nodeStatus = NodeStatus.SUCCESS;
        dataEmitter(this.id, "nodeStatus", this.nodeStatus);
        resolve(result);
      } catch (error) {
        this.nodeStatus = NodeStatus.FAILURE;
        this.error = (error as Error).message;
        dataEmitter(this.id, "nodeStatus", this.nodeStatus);
        dataEmitter(this.id, "error", this.error);
        resolve(null);
      } finally {
      }
    });
  }

  serialized() {
    return {
      ...super.serialized(),
      parameters: this.parameters.map((param) => param.serialized()),
      transform: this.transform,
    };
  }

  deserialized(serializedNode: any): void {
    super.deserialized(serializedNode);
    this.parameters = (serializedNode.parameters || []).map((param: any) => {
      const variable = new Variable();
      variable.deserialized(param);
      return variable;
    });
    this.transform = serializedNode.transform || "";
  }
}
