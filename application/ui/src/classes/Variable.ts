import { generateUUID } from "../utils/uuid";

export default class Variable {
    id: string;
    name: string;
    description: string;
    defaultValue: any;
    type: string;
    formStore: boolean;
    required: boolean;

    constructor(config?: {
        name: string;
        description?: string;
        defaultValue?: any;
        type?: string;
        formStore?: boolean;
        required?: boolean;
    }) {
        this.id = generateUUID();
        this.name = config?.name || '';
        this.description = config?.description || '';
        this.defaultValue = config?.defaultValue || null;
        this.type = config?.type || 'string';
        this.formStore = config?.formStore || true;
        this.required = config?.required || false;
    }

    get(globalStore: Record<string, any>): any {
        try {
            if (this.formStore) {
                return globalStore[this.id] || this.defaultValue;
            }
        }
        catch (error) {
            console.error(`Error getting value for variable ${this.name}:`, error);
            return this.defaultValue;
        }
    }
}