import Node from ".";
import { proxyService } from "../service";
import { NodeStatus, NodeType, type ExecutionEmitter, type VariablePool } from "../types";
import Variable from "./variable";

export class ApiNode extends Node {
    baseUrl: Variable = new Variable({ name: "baseUrl", type: "string" });
    url: Variable = new Variable({ name: "url", type: "string" });
    pathParams: Variable[] = [];
    queryParams: Variable[] = [];
    headers: Variable[] = [];
    body: Variable = new Variable({ name: "body", type: "object" });
    method: string = '';
    constructor(id?: string) {
        super(id, NodeType.API);
        this.pathParams = [];
        this.queryParams = [];
        this.headers = [];
        this.method = 'GET';
    }
    getUrl(globalStore: VariablePool, envVariableMap: Record<string, string>): string {
        const baseUrl = this.baseUrl ? this.baseUrl.get(globalStore, envVariableMap) : '';
        const url = this.url ? this.url.get(globalStore, envVariableMap) : '';
        const path = this.pathParams.reduce((acc, param) => {
            const value = param.get(globalStore, envVariableMap);
            return acc.replace(new RegExp(`(:${param.name}|\\{${param.name}\\})`, 'g'), value);
        }, url);

        const query = this.queryParams.map(param => {
            const value = param.get(globalStore, envVariableMap);
            return `${param.name}=${encodeURIComponent(value)}`;
        }).join('&');
        return `${baseUrl}${path}${query ? `?${query}` : ''}`;
    }
    getHeaders(globalStore: VariablePool, envVariableMap: Record<string, string>): Record<string, string> {
        return this.headers.reduce((acc, header) => {
            acc[header.name] = header.get(globalStore, envVariableMap);
            return acc;
        }, {} as Record<string, string>);
    }

    getBody(globalStore: VariablePool, envVariableMap: Record<string, string>): any {
        return this.body ? this.body.get(globalStore, envVariableMap) : null;
    }

    execute(globalStore: VariablePool, envVariableMap: Record<string, string>, dataEmitter: ExecutionEmitter): Promise<any> {
        this.executing = true;
        dataEmitter(this.id, 'executing' , true);
        this.hasError = false;
        dataEmitter(this.id, 'hasError' , false);
        this.errorMessage = null;
        dataEmitter(this.id, 'errorMessage' , null);


        const url = this.getUrl(globalStore, envVariableMap);
        const headers = this.getHeaders(globalStore, envVariableMap);
        const body = this.getBody(globalStore, envVariableMap);

        const options = {
            url,
            method: this.method,
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: body ? JSON.stringify(body) : null
        };
        if (this.method === 'GET') {
            options.body = null;
        }
        if (this.method === 'POST') {
            options.headers['Content-Type'] = 'application/json';
        } else if (this.method === 'PUT') {
            options.headers['Content-Type'] = 'application/json';
        } else if (this.method === 'DELETE') {
            options.body = null;
            options.headers['Content-Type'] = 'application/json';
        }
        const executionStartTime = Date.now();
        this.executionDone = false;
        dataEmitter(this.id, 'executionDone' , false);
        return new Promise((resolve) => {
            proxyService.request(options)
            .then((data:any) => {
                if (data.error) {
                    this.hasError = true;
                    dataEmitter(this.id, 'hasError' , true);
                    this.errorMessage = data.error;
                    dataEmitter(this.id, 'errorMessage' , this.errorMessage);
                    this.nodeStatus = NodeStatus.FAILURE;
                    dataEmitter(this.id, 'nodeStatus' , this.nodeStatus);
                } else {
                    this.hasError = false;
                    dataEmitter(this.id, 'hasError' , false);
                    this.executing = false;
                    dataEmitter(this.id, 'executing' , false);
                    this.nodeStatus = NodeStatus.SUCCESS;
                    dataEmitter(this.id, 'nodeStatus' , this.nodeStatus);
                }
                resolve(data);
            })
            .catch((error: { message: string | null; }) => {
                this.executing = false;
                dataEmitter(this.id, 'executing' , false);
                this.hasError = true;
                dataEmitter(this.id, 'hasError' , true);
                this.errorMessage = error.message;
                dataEmitter(this.id, 'errorMessage' , this.errorMessage);
                this.nodeStatus = NodeStatus.FAILURE;
                dataEmitter(this.id, 'nodeStatus' , this.nodeStatus);
                resolve(undefined);
            })
            .catch((error: { message: string | null; }) => {
                this.executing = false;
                dataEmitter(this.id, 'executing' , false);
                this.hasError = true;
                dataEmitter(this.id, 'hasError' , true);
                this.errorMessage = error.message;
                dataEmitter(this.id, 'errorMessage' , this.errorMessage);
                this.nodeStatus = NodeStatus.FAILURE;
                dataEmitter(this.id, 'nodeStatus' , this.nodeStatus);
                resolve(undefined);
            })
            .finally(() => {
                this.executionTime = Date.now() - executionStartTime;
                dataEmitter(this.id, 'executionTime' , this.executionTime);
                this.executionDone = true;
                dataEmitter(this.id, 'executionDone' , true);
            });
        });
    }
    validate (envVariablelist: string[]): { valid: boolean; errors: string[] } {
        const errors: string[] = [];
        if (!this.name || this.name?.trim() === '') {
            errors.push('Node name is required');
        }
        if (!this.baseUrl.fromEnv && (!this.baseUrl.defaultValue || this.baseUrl.defaultValue.trim() === '')) {
            errors.push('Base URL is required');
        }
        if (!this.url.fromEnv && (!this.url.defaultValue || this.url.defaultValue.trim() === '')) {
            errors.push('Endpoint URL is required');
        }
        this.pathParams.forEach(param => {
            if (!param.name && param.name.trim() === '') {
                errors.push('Path parameter name is required');
            }
        });
        this.queryParams.forEach(param => {
            if (!param.name && param.name.trim() === '') {
                errors.push('Query parameter name is required');
            }
        });
        this.headers.forEach(header => {
            if (!header.name && header.name.trim() === '') {
                errors.push('Header name is required');
            }
        });

        // if any variable is linked to env variable, check if it exists in envVariableMap
        const allVariables = [this.baseUrl, this.url, this.body, ...this.pathParams, ...this.queryParams, ...this.headers];
        allVariables.forEach(variable => {
            if (variable.fromEnv) {
                if (!variable.envVarName || variable.envVarName?.trim() === '') {
                    errors.push(`Environment variable name is required for variable ${variable.name}`);
                } else if (!envVariablelist.includes(variable.envVarName)) {
                    errors.push(`Environment variable ${variable.envVarName} not found for variable ${variable.name}`);
                }
            }
        });

        return { valid: errors.length === 0, errors };
    }
    serialized() {
        return {
            ...super.serialized(),
            baseUrl: this.baseUrl.serialized(),
            url: this.url.serialized(),
            pathParams: this.pathParams.map(param => param.serialized()),
            queryParams: this.queryParams.map(param => param.serialized()),
            headers: this.headers.map(header => header.serialized()),
            body: this.body.serialized(),
            method: this.method
        }
    }
    deserialized(serializedNode: any) {
        super.deserialized(serializedNode);
        this.baseUrl = new Variable();
        this.baseUrl.deserialized(serializedNode.baseUrl);
        this.url = new Variable();
        this.url.deserialized(serializedNode.url);
        this.pathParams = serializedNode.pathParams.map((param: any) => {
            const variable = new Variable();
            variable.deserialized(param);
            return variable;
        });
        this.queryParams = serializedNode.queryParams.map((param: any) => {
            const variable = new Variable();
            variable.deserialized(param);
            return variable;
        });
        this.headers = serializedNode.headers.map((header: any) => {
            const variable = new Variable();
            variable.deserialized(header);
            return variable;
        });
        this.body = new Variable();
        this.body.deserialized(serializedNode.body);
        this.method = serializedNode.method;
    }
}