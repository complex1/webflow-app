import { generateUUID } from "../utils/uuid";
import ErrorMessage from "./ErrorMessage";

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
    validation (type: string, index: number): ErrorMessage[] | null {
        const errors: ErrorMessage[] = [];
        if (!this.name) {
            errors.push(new ErrorMessage(`${index || ''} ${type} name is required`, 'error'));
        }
        if (!this.formStore && !this.type) {
            errors.push(new ErrorMessage(`${index || ''} ${type} type is required`, 'error'));
        }
        if (!this.formStore && this.type === 'string' && this.defaultValue === null) {
            errors.push(new ErrorMessage(`${index || ''} ${type} default value is required`, 'error'));
        }
        if (!this.formStore && this.type === 'number' && isNaN(this.defaultValue)) {
            errors.push(new ErrorMessage(`${index || ''} ${type} default value must be a number`, 'error'));
        }
        if (!this.formStore && this.type === 'boolean' && typeof this.defaultValue !== 'boolean') {
            errors.push(new ErrorMessage(`${index || ''} ${type} default value must be a boolean`, 'error'));
        }
        if (!this.formStore && this.type === 'array' && !Array.isArray(this.defaultValue)) {
            errors.push(new ErrorMessage(`${index || ''} ${type} default value must be an array`, 'error'));
        }
        if (!this.formStore && this.type === 'object' && typeof this.defaultValue !== 'object') {
            errors.push(new ErrorMessage(`${index || ''} ${type} default value must be an object`, 'error'));
        }
        return errors
    }
}