import type { ExtractedAPI } from "./openApiPreprocess";
import HttpNode from "../classes/HttpNode";
import Variable from "../classes/Variable";
export const extractedOpenApiToHttpNode = (api: ExtractedAPI, baseUrl: string) => {
  const httpNode = new HttpNode();
  httpNode.name = api.name;
  httpNode.baseUrl = baseUrl;
  httpNode.url = api.url;
  httpNode.method = api.method.toUpperCase();
  
  if (api.body) {
    const bodyVariable = new Variable();
    bodyVariable.name = "body";
    bodyVariable.description = "Request body";
    bodyVariable.defaultValue = api.body;
    bodyVariable.type = "json";
    httpNode.body = bodyVariable;
  }

  if (api.header) {
    httpNode.headers = api.header.map(header => {
      const headerVariable = new Variable({
        name: header.name,
        description: header.description,
        defaultValue: '',
        type: header.type || 'string',
        formStore: true,
        required: header.required || false
      });
      return headerVariable;
    });
  }

  if (api.pathParam) {
    httpNode.pathParams = api.pathParam.map(param => {
      const pathVariable = new Variable({
        name: param.name,
        description: param.description,
        defaultValue: '',
        type: param.type || 'string',
        formStore: true,
        required: param.required || false
      });
      return pathVariable;
    });
  }

  if (api.queryParam) {
    httpNode.queryParams = api.queryParam.map(param => {
      const queryVariable = new Variable({
        name: param.name,
        description: param.description,
        defaultValue: '',
        type: param.type || 'string',
        formStore: true,
        required: param.required || false
      });
      return queryVariable;
    });
  }

  return httpNode;
}

