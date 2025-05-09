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
        baseUrl: string;
        url: string;
        pathParams?: Variable[];
        queryParams?: Variable[];
        headers?: Variable[];
        body?: Variable | null;
        method?: string;
    }) {
        super(NodeType.HTTP);
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
            fetch(url, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                this.executing = false;
                this.nodeStatus = NodeStatus.SUCCESS;
                this.nodeData = data;
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
}