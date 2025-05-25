import { proxyService } from '../services/proxy.service';
import Node, { NodeStatus, NodeType } from './Node';
import Variable from './Variable';

export default class HttpNode extends Node {
    baseUrl: string;
    url: string;
    pathParams: Variable[];
    queryParams: Variable[];
    headers: Variable[];
    body: Variable | null;
    method: string;

    constructor(config?: {
        id: string;
        baseUrl: string;
        url: string;
        pathParams?: Variable[];
        queryParams?: Variable[];
        headers?: Variable[];
        body?: Variable | null;
        method?: string;
    }) {
        super(config?.id, NodeType.HTTP);
        this.baseUrl = config?.baseUrl || '';
        this.url = config?.url || '';
        this.pathParams = config?.pathParams || [];
        this.queryParams = config?.queryParams || [];
        this.headers = config?.headers || [];
        this.body = config?.body || null;
        this.method = config?.method || 'GET';
        this.executing = false;
        this.hasError = false;
        this.errorMessage = null;
    }

    getUrl(globalStore: Record<string, any>): string {
        let path = this.pathParams.reduce((acc, param) => {
            const value = param.get(globalStore);
            return acc.replace(`:${param.name}`, value);
        }, this.url);

        const query = this.queryParams.map(param => {
            const value = param.get(globalStore);
            return `${param.name}=${encodeURIComponent(value)}`;
        }).join('&');

        return `${this.baseUrl}${path}${query ? `?${query}` : ''}`;
    }

    getHeaders(globalStore: Record<string, any>): Record<string, string> {
        return this.headers.reduce((acc, header) => {
            acc[header.name] = header.get(globalStore);
            return acc;
        }, {} as Record<string, string>);
    }

    getBody(globalStore: Record<string, any>): any {
        return this.body ? this.body.get(globalStore) : null;
    }

    execute(globalStore: Record<string, any>): Promise<any> {
        this.executing = true;
        this.hasError = false;
        this.errorMessage = null;

        const url = this.getUrl(globalStore);
        const headers = this.getHeaders(globalStore);
        const body = this.getBody(globalStore);

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
        return new Promise((resolve, reject) => {
            proxyService.request(options)
            .then((data:any) => {
                if (data.error) {
                    this.hasError = true;
                    this.errorMessage = data.error;
                    this.nodeStatus = NodeStatus.FAILURE;
                    this.nodeData = null;
                } else {
                    this.hasError = false;
                    this.executing = false;
                    this.nodeStatus = NodeStatus.SUCCESS;
                    this.nodeData = data.data;
                }
                resolve(undefined);
            })
            .catch(error => {
                this.executing = false;
                this.hasError = true;
                this.errorMessage = error instanceof Error ? error.message : String(error); // set the error message
                this.nodeStatus = NodeStatus.FAILURE;
                this.nodeData = null;
                resolve(undefined);
            })
            .finally(() => {
                this.executionTime = Date.now() - executionStartTime;
                this.executionDone = true;
            });
        });
    }
    serialized () {
        return {
            ...super.serialized(),
            baseUrl: this.baseUrl,
            url: this.url,
            pathParams: this.pathParams.map(param => param.serialized()),
            queryParams: this.queryParams.map(param => param.serialized()),
            headers: this.headers.map(header => header.serialized()),
            body: this.body ? this.body.serialized() : null,
            method: this.method
        };
    }
    deserialized (data: any) {
        super.deserialized(data);
        this.baseUrl = data.baseUrl;
        this.url = data.url;
        this.pathParams = data.pathParams.map((param: any) => {
            const variable = new Variable();
            variable.deserialized(param);
            return variable;
        });
        this.queryParams = data.queryParams.map((param: any) => {
            const variable = new Variable();
            variable.deserialized(param);
            return variable;
        });
        this.headers = data.headers.map((header: any) => {
            const variable = new Variable();
            variable.deserialized(header);
            return variable;
        });
        this.body = data.body ? new Variable(data.body) : null;
        this.method = data.method;
    }
}