import type { envVariableMap, VariablePool } from "../types";
import { generateUUID } from "../utils";

export default class Variable {
  id: string;
  name: string;
  description: string;
  defaultValue: any;
  type: string;
  fromEnv: boolean;
  envVarName?: string;

  constructor(config?: {
    id?: string;
    name: string;
    description?: string;
    defaultValue?: any;
    type?: string;
    fromEnv?: boolean;
    envVarName?: string;
  }) {
    this.id = config?.id ?? "var-" + generateUUID();
    this.name = config?.name || "";
    this.description = config?.description || "";
    this.defaultValue = config?.defaultValue ?? null;
    this.type = config?.type || "string";
    this.fromEnv = config?.fromEnv || false;
    this.envVarName = config?.envVarName || "";
  }

  get(globalStore: VariablePool, envVariableMap: envVariableMap): any {
    try {
      if (this.fromEnv && this.envVarName) {
        return envVariableMap[this.envVarName] || this.defaultValue;
      }
      return globalStore[this.id] || this.defaultValue;
    } catch (error) {
      return this.defaultValue;
    }
  }

  serialized() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      defaultValue: this.defaultValue,
      type: this.type,
      fromEnv: this.fromEnv,
      envVarName: this.envVarName,
    };
  }

  deserialized(serializedVariable: any) {
    if (!serializedVariable) return this;
    try {
      this.id = serializedVariable.id || generateUUID();
      this.name = serializedVariable.name;
      this.description = serializedVariable.description || "";
      this.defaultValue = serializedVariable.defaultValue || null;
      this.type = serializedVariable.type || "string";
      this.fromEnv = serializedVariable.fromEnv || false;
      this.envVarName = serializedVariable.envVarName || "";
    } catch (error) {
      console.error("Error deserializing variable:", error);
    }
    return this;
  }
}
