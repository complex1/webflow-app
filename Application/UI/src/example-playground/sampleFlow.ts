import HttpNode from '@/apifluxCore/classes/httpNode';
import TransformNode from '@/apifluxCore/classes/transformNode';
import Variable from '@/apifluxCore/classes/variable';
import { NodeType } from '@/apifluxCore/types';
import type { Edge } from '@vue-flow/core';

export const EXAMPLE_API_ID = 'ex-play-api';
export const EXAMPLE_TX_ID = 'ex-play-transform';
/** Input parameter for the transform; wired from the API node's output. */
export const EXAMPLE_TX_PARAM_ID = 'ex-play-param-todo';

/**
 * Serialized webflow payload for `deserializedWebflow`: sample GET + transform.
 * HTTP → (control + data) → Transform that shapes the JSONPlaceholder todo.
 */
export function buildExamplePlaygroundPayload(): { nodes: unknown[]; edges: Edge[] } {
  const http = new HttpNode(EXAMPLE_API_ID);
  http.name = 'Sample HTTP (JSONPlaceholder)';
  http.description = 'GET a public todo — no login. Playground proxy only allows jsonplaceholder.typicode.com.';
  http.method = 'GET';
  http.baseUrl = new Variable({
    name: 'baseUrl',
    type: 'string',
    defaultValue: 'https://jsonplaceholder.typicode.com',
  });
  http.url = new Variable({
    name: 'url',
    type: 'string',
    defaultValue: '/todos/1',
  });

  const tx = new TransformNode({ id: EXAMPLE_TX_ID });
  tx.name = 'Functional node';
  tx.description = 'Maps the API JSON into a small summary object.';
  const param = new Variable({
    id: EXAMPLE_TX_PARAM_ID,
    name: 'todo',
    type: 'object',
    description: 'Response body from the HTTP node',
  });
  tx.parameters = [param];
  tx.transform = [
    'return {',
    '  title: todo && typeof todo === "object" ? todo.title : String(todo),',
    '  done: todo && typeof todo === "object" ? todo.completed : null,',
    '  note: "Computed in the browser — not saved anywhere.",',
    '};',
  ].join('\n');

  const outputVarId = `${EXAMPLE_API_ID}_data`;

  const controlEdge: Edge = {
    id: `e-${EXAMPLE_API_ID}-${EXAMPLE_TX_ID}-flow`,
    source: EXAMPLE_API_ID,
    target: EXAMPLE_TX_ID,
    sourceHandle: EXAMPLE_API_ID,
    targetHandle: EXAMPLE_TX_ID,
    animated: false,
  };

  const dataEdge: Edge = {
    id: `e-${EXAMPLE_API_ID}-${EXAMPLE_TX_ID}-data`,
    source: EXAMPLE_API_ID,
    target: EXAMPLE_TX_ID,
    sourceHandle: outputVarId,
    targetHandle: EXAMPLE_TX_PARAM_ID,
    animated: true,
  };

  return {
    nodes: [
      {
        id: EXAMPLE_API_ID,
        position: { x: 40, y: 120 },
        type: NodeType.API,
        data: { label: http.name, id: EXAMPLE_API_ID },
        config: http.serialized(),
      },
      {
        id: EXAMPLE_TX_ID,
        position: { x: 400, y: 120 },
        type: NodeType.TRANSFORM,
        data: { label: tx.name, id: EXAMPLE_TX_ID },
        config: tx.serialized(),
      },
    ],
    edges: [controlEdge, dataEdge],
  };
}
