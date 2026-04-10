export type DocsNavItem = {
  id: string
  label: string
  children?: DocsNavItem[]
}

/** Sidebar + in-page anchors (`/docs#${id}`). */
export const DOCS_NAV: DocsNavItem[] = [
  { id: 'intro', label: 'Introduction' },
  {
    id: 'webflows',
    label: 'Webflows',
    children: [
      { id: 'webflows-basics', label: 'Folders & flows' },
      { id: 'webflows-editor', label: 'The editor' },
    ],
  },
  {
    id: 'canvas-nodes',
    label: 'Canvas & nodes',
    children: [
      { id: 'canvas-basics', label: 'How the graph works' },
      { id: 'node-http', label: 'HTTP (API) node' },
      { id: 'node-transform', label: 'Transform node' },
      { id: 'node-openapi', label: 'OpenAPI node' },
    ],
  },
  {
    id: 'environments',
    label: 'Environments',
    children: [
      { id: 'env-files', label: 'Environment files' },
      { id: 'env-link', label: 'Linking to a Webflow' },
    ],
  },
  {
    id: 'runs',
    label: 'Runs & reports',
    children: [
      { id: 'runs-execute', label: 'Running a flow' },
      { id: 'runs-history', label: 'Run history & detail' },
      { id: 'runs-report', label: 'Execution report' },
    ],
  },
  { id: 'import-export', label: 'Import & export' },
  { id: 'sharing', label: 'Public sharing' },
  {
    id: 'scheduler',
    label: 'Scheduler',
    children: [
      { id: 'scheduler-create', label: 'Creating schedules' },
      { id: 'scheduler-outcomes', label: 'Outcomes' },
    ],
  },
  { id: 'faq', label: 'FAQ' },
]
