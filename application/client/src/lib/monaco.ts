import * as monaco from 'monaco-editor';

// Configure worker paths
self.MonacoEnvironment = {
  getWorker: function (_moduleId, label) {
    if (label === 'json') {
      return new Worker(new URL('monaco-editor/esm/vs/language/json/json.worker?worker', import.meta.url), { type: 'module' });
    }
    if (label === 'javascript' || label === 'typescript') {
      return new Worker(new URL('monaco-editor/esm/vs/language/typescript/ts.worker?worker', import.meta.url), { type: 'module' });
    }
    return new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker?worker', import.meta.url), { type: 'module' });
  }
};

export default monaco;