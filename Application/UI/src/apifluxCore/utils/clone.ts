import { ApiNode } from "../nodes/apiNode";
import FunctionalNode from "../nodes/functionalNode";
import Variable from "../nodes/variable";
import type { WebflowNode } from "../types";

export const cloneVariable = (variable: Variable): Variable => {
    const variableObject = variable.serialized();
    const clonedVar = new Variable();
    return clonedVar.deserialized(variableObject);
};

export const cloneApiNode = (apiNode: ApiNode): ApiNode => {
    const clonedNode = new ApiNode();
    // Manually clone Variables within the ApiNode
    clonedNode.id = apiNode.id;
    clonedNode.name = apiNode.name;
    clonedNode.description = apiNode.description;
    clonedNode.type = apiNode.type;
    if (apiNode.baseUrl) {
        clonedNode.baseUrl = cloneVariable(apiNode.baseUrl);
    }
    if (apiNode.url) {
        clonedNode.url = cloneVariable(apiNode.url);
    }
    clonedNode.pathParams = apiNode.pathParams.map(param => cloneVariable(param));
    clonedNode.queryParams = apiNode.queryParams.map(param => cloneVariable(param));
    clonedNode.headers = apiNode.headers.map(header => cloneVariable(header));
    if (apiNode.body) {
        clonedNode.body = cloneVariable(apiNode.body);
    }
    clonedNode.method = apiNode.method;
    return clonedNode
};

export const cloneFunctionalNode = (fnNode: FunctionalNode): FunctionalNode => {
    const clonedNode = new FunctionalNode();
    clonedNode.id = fnNode.id;
    clonedNode.name = fnNode.name;
    clonedNode.description = fnNode.description;
    clonedNode.type = fnNode.type;
    clonedNode.transform = fnNode.transform;
    clonedNode.parameters = fnNode.parameters.map((param: Variable) => cloneVariable(param));
    // Copy other properties if needed
    return clonedNode;
};

export const updateNodeByDeepCopying = (newNode: WebflowNode, existingNode: WebflowNode) => {
    if (newNode.type !== existingNode.type) {
        throw new Error("Node types do not match");
    }
    let clonedNode: WebflowNode;
    if (newNode.type === "API") {
        clonedNode = cloneApiNode(newNode as ApiNode);
    } else if (newNode.type === "FUNCTIONAL") {
        clonedNode = cloneFunctionalNode(newNode as FunctionalNode);
    } else {
        throw new Error("Unsupported node type");
    }
    // Update existing node's properties
    Object.keys(clonedNode).forEach(key => {
        (existingNode as any)[key] = (clonedNode as any)[key];
    });
    return existingNode;
}