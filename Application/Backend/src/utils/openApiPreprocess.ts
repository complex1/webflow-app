const generateUUID = (): string => {
  // Simple UUID generator for demonstration purposes
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

interface OpenAPIDocument {
  openapi: string;
  components?: {
    parameters?: Record<string, ParameterObject>;
    schemas?: Record<string, any>;
  };
  paths: Record<string, Record<string, OperationObject>>;
}

interface ParameterObject {
  name: string;
  in: 'query' | 'path' | 'header';
  required?: boolean;
  schema?: { type?: string };
  description?: string;
  $ref?: string;
}

interface OperationObject {
  operationId?: string;
  summary?: string;
  tags?: string[];
  parameters?: Array<ParameterObject | RefObject>;
  requestBody?: RequestBodyObject;
}

interface RequestBodyObject {
  content: Record<string, MediaTypeObject>;
}

interface MediaTypeObject {
  schema?: SchemaObject | RefObject;
}

interface RefObject {
  $ref: string;
}

interface SchemaObject {
  type: string;
  properties?: Record<string, SchemaObject | RefObject>;
  items?: SchemaObject | RefObject;
  $ref?: string;
}

interface ExtractedField {
  name: string;
  required: boolean;
  type: string;
  description?: string;
}

interface ExtractedAPI {
  id: string;
  groupName: string;
  name: string;
  url: string;
  method: string;
  description?: string; // Add description field which is used in filtering
  header?: ExtractedField[];
  pathParam?: ExtractedField[];
  queryParam?: ExtractedField[];
  body?: any;
}

// Export the interfaces
export type { ExtractedAPI, ExtractedField };

export function extractApiList(openApiDoc: OpenAPIDocument): ExtractedAPI[] {
  const result: ExtractedAPI[] = [];

  for (const [url, methods] of Object.entries(openApiDoc.paths || {})) {
    for (const [method, operation] of Object.entries(methods)) {
      const {
        operationId,
        tags = ['default'],
        parameters = [],
        requestBody,
      } = operation;

      const queryParam: ExtractedField[] = [];
      const pathParam: ExtractedField[] = [];
      const header: ExtractedField[] = [];

      parameters.forEach((param) => {
        const resolved: ParameterObject = isRef(param)
          ? resolveRef<ParameterObject>(openApiDoc, param.$ref)
          : param;

        const target: ExtractedField = {
          name: resolved.name,
          required: resolved.required || false,
          type: resolved.schema?.type || 'string',
          description: resolved.description || '',
        };

        switch (resolved.in) {
          case 'query': queryParam.push(target); break;
          case 'path': pathParam.push(target); break;
          case 'header': header.push(target); break;
        }
      });

      let body: any = null;
      if (requestBody) {
        const content = requestBody.content || {};
        const contentType = Object.keys(content).find(type =>
          ['application/json', 'multipart/form-data', 'application/x-www-form-urlencoded'].includes(type)
        );

        const mediaTypeObj = content[contentType!];
        if (mediaTypeObj?.schema) {
          const resolvedSchema = isRef(mediaTypeObj.schema)
            ? resolveRef<SchemaObject>(openApiDoc, mediaTypeObj.schema.$ref)
            : mediaTypeObj.schema;
          body = generateObjectShape(resolvedSchema, openApiDoc);
        }
      }

      result.push({
        id: generateUUID(), // Assuming generateUUID is a utility function to create unique IDs
        groupName: tags[0],
        name: operation.summary || operationId || `${method.toUpperCase()} ${url}`,
        url,
        method: method.toUpperCase(),
        header,
        pathParam,
        queryParam,
        body,
      });
    }
  }

  return result;
}

// Utility: check if something is a $ref object
function isRef(obj: any): obj is RefObject {
  return !!obj.$ref;
}

// Utility: resolve $ref
function resolveRef<T>(doc: OpenAPIDocument, ref: string): T {
  const parts = ref.replace(/^#\//, '').split('/');
  return parts.reduce((obj, key) => (obj as any)?.[key], doc) as T;
}

// Build JS-like object shape for schema
function generateObjectShape(schema: SchemaObject | RefObject, doc: OpenAPIDocument): any {
  if (isRef(schema)) {
    schema = resolveRef<SchemaObject>(doc, schema.$ref);
  }

  if (schema.type === 'object' && schema.properties) {
    const obj: Record<string, any> = {};
    for (const [key, prop] of Object.entries(schema.properties)) {
      const resolved = isRef(prop) ? resolveRef<SchemaObject>(doc, prop.$ref) : prop;
      obj[key] = generateObjectShape(resolved, doc);
    }
    return obj;
  }

  if (schema.type === 'array') {
    const items = schema.items!;
    const resolvedItem = isRef(items) ? resolveRef<SchemaObject>(doc, items.$ref!) : items;
    return [generateObjectShape(resolvedItem, doc)];
  }

  return schema.type || 'string';
}