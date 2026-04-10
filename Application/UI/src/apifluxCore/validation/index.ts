import type HttpNode from "../classes/httpNode";
import type TransformNode from "../classes/transformNode";
import type Variable from "../classes/variable";
import { NodeType, type ValidationError, type WebflowNode } from "../types";



const validateVariable = (variable: Variable, envVarList: string[], variableTitle: string, checkDefaults: boolean = false): ValidationError[] => {
    const errors: ValidationError[] = [];
    const variableId = variable['id'];
    if (!variable.name) {
        errors.push({ variableId, field: "name", message: `${variableTitle} name is required` });
    }
    if (!variable.type) {
        errors.push({ variableId, field: "type", message: `${variableTitle} type is required` });
    }
    if (variable.fromEnv && !envVarList.includes(variable?.envVarName || '')) {
        errors.push({ variableId, field: "envVar", message: `${variableTitle} Environment variable ${variable?.envVarName || ''} not found` });
    }
    if (checkDefaults && !variable.defaultValue) {
        if (!variable.fromEnv) {
            errors.push({ variableId, field: "defaultValue", message: `For ${variableTitle} value is required` });
        }
    }
    return errors;
}

const validateTransformNode = (node: TransformNode, envVarList: string[]): ValidationError[] => {
    const errors: ValidationError[] = [];
    node.parameters.forEach((param, index) => {
        const paramErrors = validateVariable(param, envVarList, `Parameter ${index + 1}`, true);
        errors.push(...paramErrors);
    });
    if (!node.transform) {
        errors.push({ field: "transform", message: "Transform function is required" });
    }
    return errors;
}

const validateApiNode = (node: HttpNode, envVarList: string[]): ValidationError[] => {
    const errors: ValidationError[] = [];
    const baseUrlErrors = validateVariable(node.baseUrl, envVarList, 'Base URL', true);
    const urlErrors = validateVariable(node.url, envVarList, 'Endpoint URL', true);
    const headersErrors = node.headers.reduce<ValidationError[]>((acc, header, index) => {
        const headerErrors = validateVariable(header, envVarList, `Header ${index + 1}`);
        return acc.concat(headerErrors);
    }, []);
    const queryParamsErrors = node.queryParams.reduce<ValidationError[]>((acc, param, index) => {
        const paramErrors = validateVariable(param, envVarList, `Query Parameter ${index + 1}`);
        return acc.concat(paramErrors);
    }, []);
    const pathParamsErrors = node.pathParams.reduce<ValidationError[]>((acc, param, index) => {
        const paramErrors = validateVariable(param, envVarList, `Path Parameter ${index + 1}`);
        return acc.concat(paramErrors);
    }, []);
    const bodyErrors = validateVariable(node.body, envVarList, 'Body');
    errors.push(
        ...baseUrlErrors,
        ...urlErrors,
        ...headersErrors,
        ...queryParamsErrors,
        ...pathParamsErrors,
        ...bodyErrors
    );
    return errors;
}

export const validateNode = (node: WebflowNode, envVarList: string[]): ValidationError[] => {
    const errors: ValidationError[] = [];
    if (!node.name) {
        errors.push({ field: "name", message: "Node name is required" });
    }
    if (node.getType() === NodeType.API) {
        const apiNode = node as HttpNode;
        const apiErrors = validateApiNode(apiNode, envVarList);
        errors.push(...apiErrors);
    }
    if (node.getType() === NodeType.TRANSFORM) {
        const transformNode = node as TransformNode;
        const transformErrors = validateTransformNode(transformNode, envVarList);
        errors.push(...transformErrors);
    }
    return errors;
}