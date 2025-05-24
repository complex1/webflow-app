# Apiflux – Product Documentation

## Overview

**Apiflux** is a developer-focused web application designed to help backend developers visually build, test, and debug API flows using a node-based interface. Inspired by tools like React Flow, the platform allows developers to connect API nodes and data transformation nodes into logical pipelines and execute them in a visual playground.

## Key Features

* **Visual Playground:** Drag-and-drop interface to build API and logic flows.
* **Node Types:**

  * **API Node:** For making HTTP requests with custom headers, method, body, etc.
  * **Transform Node:** For modifying or composing data between API calls using JavaScript-like functions.
* **Execution Engine:** Click "Play" to trigger the pipeline and visualize results at each step.
* **Color-Coded Handles:** Distinct source (outgoing) and target (incoming) connection points.
* **Apple-Inspired UI Theme:** Uses Apple’s color system for a modern and balanced UI.

## Target Audience

* Backend developers
* API architects
* DevOps engineers

## Use Cases

* Testing user registration flows (multi-step API logic)
* Debugging chained microservice requests
* Visualizing transformation logic

## Technology Stack

* **Frontend:** React + React Flow
* **Backend:** Node.js / Express (optional for MVP)
* **Styling:** CSS variables inspired by Apple Design System
* **Storage (MVP):** In-browser (localStorage) or simple cloud save

## Color Palette (Apple-Inspired)

```
--color-primary: #007aff;
--color-secondary: #5856d6;
--color-background: #f2f2f7;
--color-text-primary: #000000;
--color-text-secondary: #3c3c4399;
--color-border: #c6c6c8;
--color-success: #28cd41;
--color-warning: #ffcc00;
--color-danger: #ff3b30;
--color-info: #007aff;
--color-light: #f2f2f7;
--color-dark: #000000;
--color-white: #ffffff;
--color-black: #000000;
```

## Node Design

* **Handles:**

  * Source Handle: Green (`#10B981`)
  * Target Handle: Indigo (`#4F46E5`)
* **API Node Elements:** URL input, method selector, headers editor, body editor
* **Transform Node Elements:** Function input area with validation and output preview

## UI/UX Guidelines

* Balanced layout between the canvas (left) and configuration panels (right)
* Responsive form components for creating nodes and setting configurations
* Clear error states and feedback for failed API calls

## MVP Roadmap

### Phase 1 – Core Playground

* [x] Node-based drag-and-drop canvas
* [x] API node configuration
* [x] Transform node with JS function support
* [x] Execution engine with real API call capability

### Phase 2 – UX Improvements

* [ ] Node grouping / modular pipelines
* [ ] Execution logging
* [ ] Pipeline save/load/share features

### Phase 3 – Collaboration & Sharing

* [ ] User authentication
* [ ] Team flows and shared pipelines
* [ ] Export flows as code/scripts

## Future Enhancements

* GitHub integration
* CLI tool to generate visual pipelines from OpenAPI/Swagger specs
* Auto-suggest transformation functions

---

For questions or feedback, contact the Apiflux team at \[[support@apiflux.dev](mailto:support@apiflux.dev)] or join our Discord.
