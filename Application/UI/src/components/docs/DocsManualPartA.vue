<template>
  <div class="docs-manual-part">
    <section id="intro">
      <h1>Introduction</h1>
      <p class="section-lead">
        This application helps you design, run, and document <strong>API flows</strong> as a visual graph. You connect
        <strong>nodes</strong> (steps), pass data between them, run flows on the server, review past runs, share a
        read-only view with your team, and schedule recurring runs when you need automation.
      </p>
      <p>
        You work in three main areas: <strong>Webflows</strong> (your library of flows), the <strong>editor</strong>
        (canvas + node configuration), and <strong>Environments</strong> (reusable variables for secrets and URLs). Runs
        and reports help you verify what happened on the server; the <strong>Scheduler</strong> runs a flow on a timer.
      </p>
      <div class="docs-try-row">
        <router-link class="docs-btn" to="/example-playground">Try the example playground (no sign-in)</router-link>
        <router-link class="docs-btn docs-btn--secondary" to="/webflows">Go to Webflows (sign-in)</router-link>
      </div>
      <DocsFigure
        alt="Future screenshot: application home or Webflows list showing folders and flow cards with actions to open the editor."
        caption="Planned hero image: where users land after sign-in and how flows are organized."
      />
    </section>

    <section id="webflows-basics">
      <h2>Webflows: folders and flows</h2>
      <p class="section-lead">
        A <strong>Webflow</strong> is a saved project that contains your graph (nodes and edges). You can organize flows
        in <strong>folders</strong> or open a flow directly.
      </p>
      <ul>
        <li><strong>Folder</strong> — groups other webflows; you cannot execute a folder.</li>
        <li><strong>Flow (non-folder)</strong> — has a canvas configuration; this is what you run and schedule.</li>
      </ul>
      <p>
        Create flows from scratch or <strong>import</strong> definitions when you have JSON from a previous export or
        an import wizard. Naming and descriptions help teammates find the right flow later.
      </p>
      <DocsFigure
        alt="Future screenshot: Webflows list view with folder tree, flow rows, and buttons such as create, import, open editor."
        caption="Planned: library view with create/import and navigation into the editor."
      />
    </section>

    <section id="webflows-editor">
      <h2>The editor</h2>
      <p class="section-lead">
        Opening a flow launches the <strong>Webflow editor</strong>: a canvas where you add nodes, connect them, and
        switch between <strong>View</strong> and <strong>Edit</strong> modes.
      </p>
      <ul>
        <li>
          <strong>View mode</strong> — inspect the graph, choose linked environment files, run on the server, browse run
          history, open execution reports, export, and manage public sharing.
        </li>
        <li>
          <strong>Edit mode</strong> — change the graph: add nodes, edit connections, save configuration to the server.
        </li>
      </ul>
      <p>
        Use breadcrumbs and the flow name in the header to stay oriented. Saving persists the current nodes and edges to
        your account.
      </p>
      <DocsFigure
        alt="Future screenshot: Webflow editor with toolbar (env, run history, execute, edit), canvas with API and Transform nodes, and optional side panels."
        caption="Planned: full editor chrome with canvas and toolbar called out."
      />
    </section>

    <section id="canvas-basics">
      <h2>How the graph works</h2>
      <p class="section-lead">
        Your flow is a <strong>directed graph</strong>: <strong>nodes</strong> are steps, and <strong>edges</strong>
        define which step runs after which.
      </p>
      <ul>
        <li>Drag nodes to lay out the diagram; connections show execution order.</li>
        <li>In <strong>edit mode</strong>, you can add nodes and wire handles to build the pipeline.</li>
        <li>
          When you <strong>run</strong> the flow, the engine walks the graph, executes each node, and stores outputs in
          a <strong>variable pool</strong> that later nodes can reference.
        </li>
      </ul>
      <details class="docs-details">
        <summary>Tip: read-only canvas</summary>
        <p>
          In view mode the canvas is read-only so you do not accidentally move nodes while reviewing a run or demoing a
          flow.
        </p>
      </details>
    </section>

    <section id="node-http">
      <h2>HTTP (API) node</h2>
      <p class="section-lead">
        The <strong>HTTP</strong> node sends an HTTP request. You configure URL (often with variables), method,
        headers, query parameters, path segments, and body as your API requires.
      </p>
      <ol>
        <li>Add an <strong>API</strong> node from the toolbar in edit mode.</li>
        <li>Set base URL, path, and method; map headers and query fields.</li>
        <li>Use <strong>variables</strong> from the pool or values from a linked <strong>environment file</strong> for secrets and endpoints.</li>
        <li>Save the node; connect it to upstream/downstream nodes.</li>
      </ol>
      <p>
        After a run, you can open the node’s detail view to see status, HTTP status code, and summarized output—ideal for
        debugging.
      </p>
      <div class="docs-sample">
        <span class="docs-sample__label">Run status badges (same idea as run history)</span>
        <div class="docs-sample__row">
          <Badge variant="success">completed</Badge>
          <Badge variant="error">failed</Badge>
          <Badge variant="warning">running</Badge>
        </div>
      </div>
      <DocsFigure
        alt="Future screenshot: HTTP node card on canvas and/or drawer showing URL field, method dropdown, headers table, and variable chips."
        caption="Planned: HTTP node configuration with fields labeled."
      />
    </section>

    <section id="node-transform">
      <h2>Transform node</h2>
      <p class="section-lead">
        A <strong>Transform</strong> node lets you reshape or compute on data between API calls—filter lists, map
        fields, or prepare payloads for the next step—without leaving the flow.
      </p>
      <p>
        Connect Transform nodes <strong>between</strong> HTTP nodes (or other nodes) so data flows in order: upstream
        outputs become inputs you can reference in the transform configuration.
      </p>
      <DocsFigure
        alt="Future screenshot: Transform node on canvas with edit panel showing script or mapping UI."
        caption="Planned: transform step wired between two API nodes."
      />
    </section>

    <section id="node-openapi">
      <h2>OpenAPI node</h2>
      <p class="section-lead">
        When your Webflow has <strong>OpenAPI</strong> metadata configured, you can add an <strong>OpenAPI</strong>
        node to pick operations from your spec instead of typing every path by hand.
      </p>
      <p>
        This is optional: flows work without OpenAPI. When enabled, link your OpenAPI source in the Webflow settings
        first, then add the node from the editor’s add menu.
      </p>
      <DocsFigure
        alt="Future screenshot: OpenAPI node chooser listing operations from the linked specification."
        caption="Planned: selecting an operation from the imported OpenAPI document."
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import DocsFigure from './DocsFigure.vue'
import Badge from '@/components/common/feedback/Badge.vue'
</script>

<style scoped>
.docs-manual-part section {
  border: 1px solid var(--border-subtle);
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: 22px;
  margin-bottom: 28px;
}

.docs-manual-part h1 {
  font-size: 26px;
  margin: 0 0 12px;
  font-weight: 600;
}

.docs-manual-part h2 {
  font-size: 18px;
  margin: 0 0 8px;
  font-weight: 600;
}

.section-lead {
  color: var(--text-secondary);
  margin: 0 0 12px;
  line-height: 1.55;
}

.docs-manual-part p,
.docs-manual-part li {
  color: var(--text-secondary);
  line-height: 1.55;
}

.docs-manual-part ul,
.docs-manual-part ol {
  margin: 0 0 12px;
  padding-left: 20px;
}

.docs-try-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 16px 0;
}

.docs-btn {
  display: inline-flex;
  align-items: center;
  padding: 8px 14px;
  border-radius: var(--radius-md);
  background: var(--accent-blue);
  color: white;
  font-size: var(--text-sm, 0.875rem);
  font-weight: 600;
  text-decoration: none;
}

.docs-btn:hover {
  filter: brightness(1.08);
}

.docs-btn--secondary {
  background: var(--bg-elevated);
  color: var(--text-primary);
  border: 1px solid var(--border-subtle);
}

.docs-details {
  margin-top: 12px;
  padding: 10px 12px;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  background: var(--bg-elevated);
}

.docs-details summary {
  cursor: pointer;
  font-weight: 600;
  color: var(--text-primary);
}

.docs-sample {
  margin: 16px 0;
  padding: 12px;
  border-radius: var(--radius-md);
  border: 1px dashed var(--border-default);
  background: var(--bg-elevated);
}

.docs-sample__label {
  display: block;
  font-size: var(--text-xs, 0.75rem);
  color: var(--text-muted);
  margin-bottom: 8px;
}

.docs-sample__row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
</style>
