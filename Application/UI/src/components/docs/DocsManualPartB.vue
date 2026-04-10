<template>
  <div class="docs-manual-part">
    <section id="env-files">
      <h2>Environment files</h2>
      <p class="section-lead">
        An <strong>environment file</strong> is a named collection of <strong>key/value</strong> pairs—typically API
        base URLs, tokens, and stage flags. You manage them under <strong>Environments</strong> in the app.
      </p>
      <ul>
        <li>Create separate files for <strong>dev</strong>, <strong>staging</strong>, and <strong>production</strong> so you never mix secrets.</li>
        <li>Each row has a <strong>key</strong> (how you reference it in nodes) and a <strong>value</strong>.</li>
        <li>Values are stored with your account; treat the screen like any secret UI—avoid sharing your screen when editing production tokens.</li>
      </ul>
      <router-link class="docs-btn" to="/environments">Open Environments</router-link>
      <DocsFigure
        alt="Future screenshot: Environments list and editor showing env file name and a table of keys and values."
        caption="Planned: creating and editing environment variables."
      />
    </section>

    <section id="env-link">
      <h2>Linking an environment to a Webflow</h2>
      <p class="section-lead">
        A Webflow can <strong>link</strong> one or more environment files. When you run the flow (client test or server
        run), you choose which linked file supplies variables for that execution.
      </p>
      <ol>
        <li>Open your Webflow from the library and use the <strong>link environment</strong> action (modal) to attach files.</li>
        <li>In the editor toolbar (view mode), pick the active env file from the dropdown when you need specific values.</li>
        <li>Nodes reference keys from that file when you mark fields as coming from the environment.</li>
      </ol>
      <p>
        Scheduled runs optionally pick <strong>one</strong> linked env file in the schedule—so nightly jobs always use the
        same configuration without pasting secrets into the schedule itself.
      </p>
      <DocsFigure
        alt="Future screenshot: modal linking an env file to a Webflow and toolbar dropdown listing linked files."
        caption="Planned: link modal and env selector on the editor toolbar."
      />
    </section>

    <section id="runs-execute">
      <h2>Running a flow</h2>
      <p class="section-lead">
        You can exercise a flow in two complementary ways: a <strong>local test run</strong> in the browser, or a
        <strong>server run</strong> that persists execution history.
      </p>
      <ul>
        <li>
          <strong>Test run (local)</strong> — from edit mode, runs in your session for quick iteration; useful with the
          example playground pattern for demos.
        </li>
        <li>
          <strong>Run on server</strong> — from view mode, sends the current graph and chosen env to the backend, creates
          a <strong>run</strong> record, and updates node status on the canvas while the job progresses.
        </li>
      </ul>
      <p>
        The <strong>variable pool</strong> holds outputs from each step during a run so downstream nodes and the node
        detail viewer can resolve values.
      </p>
    </section>

    <section id="runs-history">
      <h2>Run history and detail</h2>
      <p class="section-lead">
        The toolbar <strong>Run history</strong> control is a searchable, lazy-loaded list of past server runs. Pick a run
        to load its timeline onto the canvas and inspect per-node results.
      </p>
      <ul>
        <li>Scroll the list to load more runs (pagination under the hood).</li>
        <li>Each entry shows run id, status badge, and time—matching what you see in execution reports.</li>
        <li>Clearing the selection resets canvas execution decorations without leaving the editor.</li>
      </ul>
      <DocsFigure
        alt="Future screenshot: run history dropdown open with rows showing run id, status badges, and timestamps."
        caption="Planned: run picker with status badges and infinite scroll."
      />
    </section>

    <section id="runs-report">
      <h2>Execution report</h2>
      <p class="section-lead">
        For a selected run, open the <strong>execution report</strong> to review the full timeline, errors, and outputs
        in one place—ideal for sharing findings or attaching to tickets.
      </p>
      <ol>
        <li>Select a run from run history.</li>
        <li>Use the report action in the toolbar to open the report modal.</li>
        <li>Review each step’s status, HTTP metadata where applicable, and error messages.</li>
      </ol>
      <p>You can also open a node’s detail drawer while a run is selected to see that node’s slice of the same execution.</p>
      <DocsFigure
        alt="Future screenshot: execution report modal with timeline list and expandable steps."
        caption="Planned: report modal summarizing the server run."
      />
    </section>

    <section id="import-export">
      <h2>Import and export</h2>
      <p class="section-lead">
        <strong>Import</strong> creates a Webflow from supported import data (depending on your app’s import wizard).
        <strong>Export</strong> downloads a JSON snapshot of the flow—name, description, tags, and playground-style
        nodes/edges—for backup or sharing with another workspace.
      </p>
      <ul>
        <li>Use import when onboarding an API definition or migrating a flow.</li>
        <li>Use export before large refactors or to version-control flow JSON in Git.</li>
      </ul>
      <DocsCopyPre
        :text="exportShapeExample"
      />
      <p class="docs-muted">Shape is illustrative; your export follows the app’s current schema.</p>
    </section>

    <section id="sharing">
      <h2>Public sharing</h2>
      <p class="section-lead">
        You can enable a <strong>public link</strong> for a Webflow so anyone with the URL can view the graph in
        <strong>read-only</strong> mode—no sign-in. This is useful for documentation and stakeholder review.
      </p>
      <ul>
        <li>Turn sharing on from the editor toolbar (link icon), then copy the URL.</li>
        <li>Guests see the canvas and node detail; they do not get your environment values or server run history.</li>
        <li>Disable sharing anytime; the token can be kept so the same link works again when re-enabled.</li>
      </ul>
      <div class="docs-try-row">
        <router-link class="docs-btn docs-btn--secondary" to="/example-playground">Compare: example playground (no account)</router-link>
      </div>
      <DocsFigure
        alt="Future screenshot: public share settings popover with toggle and copied URL; second image of read-only share page."
        caption="Planned: share popover and guest view of the flow."
      />
    </section>

    <section id="scheduler-create">
      <h2>Scheduler: creating schedules</h2>
      <p class="section-lead">
        The <strong>Scheduler</strong> runs a Webflow on a timer using a <strong>cron</strong> expression and optional
        timezone. Each schedule can optionally use one <strong>linked environment file</strong> for that run’s variables.
      </p>
      <ol>
        <li>Open <router-link class="docs-inline-link" to="/scheduler">Scheduler</router-link> from the sidebar.</li>
        <li>Click <strong>Add schedule</strong>, choose the Webflow, enter a label, cron, and timezone (e.g. <code>UTC</code>).</li>
        <li>Optionally pick an env file that is already linked to that Webflow.</li>
        <li>Enable or disable the schedule anytime; the next run time is shown in the table.</li>
      </ol>
      <p>
        Cron uses the usual five fields (minute hour day month weekday); the app normalizes them for the scheduler engine.
      </p>
      <DocsCopyPre :text="cronExamples" />
      <DocsFigure
        alt="Future screenshot: Scheduler page table with columns for flow name, cron, timezone, enabled, next run, last outcome."
        caption="Planned: schedules list and create drawer."
      />
    </section>

    <section id="scheduler-outcomes">
      <h2>Scheduler: outcomes</h2>
      <p class="section-lead">
        Each scheduled execution appears like any other server run: it is tied to the schedule so you can filter outcomes
        and open the same execution report and editor deep links.
      </p>
      <ul>
        <li>From the Scheduler table, use <strong>Runs</strong> to page through executions for that schedule.</li>
        <li>
          Use <strong>Open run</strong> (or the Webflow editor with run id) to inspect the timeline on the canvas.
        </li>
        <li>
          The server runs one process with a simple timer—avoid expecting second-perfect timing under heavy load; for
          multi-instance deployments you would need an external queue (future ops topic).
        </li>
      </ul>
    </section>

    <section id="faq">
      <h2>FAQ</h2>
      <details class="docs-details">
        <summary>I don’t see “Run on server”—why?</summary>
        <p>You must be in <strong>view mode</strong> on the Webflow editor and have a valid flow (not a folder). Sign in if your session expired.</p>
      </details>
      <details class="docs-details">
        <summary>Why is my scheduled run not firing?</summary>
        <p>
          Check that the schedule is <strong>enabled</strong>, the cron and timezone are correct, and the server process is
          running. Missed windows while the server was down are skipped (next run advances from “now”).
        </p>
      </details>
      <details class="docs-details">
        <summary>Can guests run my API from a public share link?</summary>
        <p>
          Public share is <strong>view-only</strong> documentation of the graph. It does not expose your env values or
          run history; execution from the share page is not the intended use.
        </p>
      </details>
      <details class="docs-details">
        <summary>Where are secrets stored?</summary>
        <p>
          Environment values live with your account’s environment files. Link only the files a flow needs, and rotate
          keys if you suspect exposure.
        </p>
      </details>
    </section>
  </div>
</template>

<script setup lang="ts">
import DocsFigure from './DocsFigure.vue'
import DocsCopyPre from './DocsCopyPre.vue'

const exportShapeExample = `{
  "name": "My Webflow",
  "description": "",
  "playgroundConfig": {
    "nodes": [ /* ... */ ],
    "edges": [ /* ... */ ]
  }
}`

const cronExamples = `# Every hour at minute 0
0 * * * *

# Every day at 09:30
30 9 * * *`
</script>

<style scoped>
.docs-manual-part section {
  border: 1px solid var(--border-subtle);
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: 22px;
  margin-bottom: 28px;
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
  margin-top: 8px;
}

.docs-btn:hover {
  filter: brightness(1.08);
}

.docs-btn--secondary {
  background: var(--bg-elevated);
  color: var(--text-primary);
  border: 1px solid var(--border-subtle);
}

.docs-try-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 16px 0;
}

.docs-inline-link {
  color: var(--accent-blue);
  font-weight: 600;
}

.docs-muted {
  font-size: var(--text-xs, 0.75rem);
  color: var(--text-muted);
  margin-top: 8px;
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
</style>
