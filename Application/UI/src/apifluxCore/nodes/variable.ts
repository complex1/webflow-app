import type { VariablePool } from "../types";
import { generateUUID } from "../utils/uuid";
import ErrorMessage from "./errorMessage";

export default class Variable {
    id: string;
    name: string;
    description: string;
    defaultValue: any;
    type: string;
    fromEnv: boolean;
    envVarName?: string;

    constructor(config?: {
        name: string;
        description?: string;
        defaultValue?: any;
        type?: string;
        fromEnv?: boolean;
        envVarName?: string;
    }) {
        this.id = 'var-' + generateUUID();
        this.name = config?.name || '';
        this.description = config?.description || '';
        this.defaultValue = config?.defaultValue || null;
        this.type = config?.type || 'string';
        this.fromEnv = config?.fromEnv || false;
        this.envVarName = config?.envVarName || '';
    }

    get(globalStore: VariablePool, envVariableMap: Record<string, string>): any {
        try {
            if (this.fromEnv && this.envVarName) {
                return envVariableMap[this.envVarName] || this.defaultValue;
            }
            return globalStore[this.id] || this.defaultValue;
        }
        catch (error) {
            return this.defaultValue;
        }
    }
    validation (type: string, index: number): ErrorMessage[] | null {
        const errors: ErrorMessage[] = [];
        if (!this.name) {
            errors.push(new ErrorMessage(`${index || ''} ${type} name is required`, 'error'));
        }
        if (!this.type) {
            errors.push(new ErrorMessage(`${index || ''} ${type} type is required`, 'error'));
        }
        if (this.fromEnv && !this.envVarName) {
            errors.push(new ErrorMessage(`${index || ''} ${type} envVarName is required when fromEnv is true`, 'error'));
        }

        return errors;
    }

    serialized(){
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            defaultValue: this.defaultValue,
            type: this.type,
            fromEnv: this.fromEnv,
            envVarName: this.envVarName
        };
    }
    deserialized(serializedVariable: any) {
        if (!serializedVariable || !serializedVariable.name) return this;
        try {
            this.id = serializedVariable.id || generateUUID();
            this.name = serializedVariable.name;
            this.description = serializedVariable.description || '';
            this.defaultValue = serializedVariable.defaultValue || null;
            this.type = serializedVariable.type || 'string';
            this.fromEnv = serializedVariable.fromEnv || false;
            this.envVarName = serializedVariable.envVarName || '';
        } catch (error) {
            console.error('Error deserializing variable:', error);
        }
        return this;
    }
    setConfig(value: any): void {
        this.name = value.name;
        this.description = value.description;
        this.defaultValue = value.defaultValue;
        this.type = value.type;
        this.fromEnv = value.fromEnv;
        this.envVarName = value.envVarName;
    }
}