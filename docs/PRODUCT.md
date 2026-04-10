# API Flux — product narrative

Audience: builders, tech leads, and evaluators skimming positioning before trying the app.  
Product: **API Flux** — visual API workflows with server-side execution, environments, and history.

---

**The visual way to design, run, and share API workflows—without spinning up a new backend project every time.**

Connect HTTP services, reshape data with transforms, and drive calls from OpenAPI—then **run flows on the server**, reuse **environment variables** across stages, and **review every execution** in one place. Built for teams that live in APIs but want **clarity and repeatability**, not another pile of ad hoc scripts.

---

## Problem

- API work is often **fragmented**: one-off `curl` commands, scattered Postman collections, and throwaway scripts that never match what production does.
- **Orchestration** (call A → map → call B) is hard to read in code reviews and harder to hand off.
- **Secrets and base URLs** get copy-pasted; staging vs prod drifts quietly.
- **Observability** is weak: “what did we actually send, and what came back?” disappears after the terminal scrolls away.
- Standing up a **real service** just to try an integration is heavy for prototyping and internal tools.

---

## Why it matters

When API flows are invisible or brittle, teams ship slower, debug longer, and repeat the same integration work in every repo. A **single, inspectable graph** plus **consistent runs** turns integration from tribal knowledge into something teams can **share, replay, and improve**.

---

## Solution

**API Flux** is a **visual webflow editor** backed by a **lightweight API**: you build graphs of **nodes** (HTTP, Transform, OpenAPI, and more), attach **environment files**, and **execute flows on the server** with **saved history** and execution detail—so the same canvas is both the **design surface** and the **source of truth** for how data moves between services.

---

## Differentiation

| Theme | What API Flux emphasizes |
|--------|---------------------------|
| **Graph-first** | Flows are **nodes and edges**, not a folder of scripts—onboarding and handoff are faster. |
| **Server-side runs** | Execution happens **in your workspace**, not only in a local client—aligned with how you reason about reliability. |
| **Environments as data** | Variables live in **env files** and link to flows—less copy-paste, clearer promotion paths. |
| **History as a feature** | Runs are **listed and reviewable**, not lost after success or failure. |
| **Open & self-hostable** | **Open source** stack you can run yourself when control matters. |

---

## Features (grouped)

### Editor & canvas

- **Visual webflow editor** for composing flows on a canvas.
- **Nodes** with inputs/outputs wired together to show **data flow** explicitly.

### Node types (core)

- **HTTP (API)** — call REST endpoints with methods, headers, and bodies driven by the graph and env.
- **Transform** — map, filter, and reshape payloads between steps (e.g. JSON mapping).
- **OpenAPI** — bring in a spec and call operations in a structured way.

### Configuration

- **Environment files** for reusable variables (base URLs, tokens, timeouts).
- **Linking environments to webflows** so the same graph targets different backends cleanly.

### Execution & observability

- **Server-side workflow runs** with consistent inputs.
- **Execution history** and **detail/report** views so you can audit requests and responses.

### Collaboration & automation

- **Import / export** for moving flows between workspaces or repos.
- **Public sharing** via links for read-oriented collaboration.
- **Scheduler** for recurring runs and outcomes (where enabled in your deployment).

### Platform

- **Authenticated workspaces** and user profiles for private data and flows.

---

## Use cases

- **Prototype integrations** between internal and vendor APIs before committing backend code.
- **Debug and document** production-like paths with **replayable** runs instead of one-off curls.
- **Standardize onboarding** for new engineers: “open this flow, pick env, run.”
- **Hand off to QA or PM** with **shared flows** and clear execution history.
- **Light automation** for recurring API checks when a full workflow engine is overkill.

---

## Before vs After

| Before | After |
|--------|--------|
| Scripts and snippets living in chat, gists, and laptops | **One canvas** per flow, stored with your workspace |
| “Works on my machine” URLs and tokens | **Environment files** and linked configs |
| Guessing what was sent last Tuesday | **Run history** with inspectable detail |
| Onboarding = reading code paths | Onboarding = **reading the graph** and running it |
| New integration = new repo or service | New integration = **new flow** in the editor |

---

## Advanced features

- **OpenAPI-driven** nodes for large or evolving surface areas.
- **Transforms** for non-trivial mapping without deploying intermediate services.
- **Scheduler** for time-based execution and outcome tracking (deployment-dependent).
- **Sharing** and **import/export** for governance-friendly distribution of flows.

---

## Benefits (emotional)

- **Confidence:** You see the whole path—fewer “mystery” failures in production integrations.
- **Calm handoffs:** The flow is the explanation; less tribal knowledge stuck in one person’s terminal history.
- **Pride in clarity:** Teams ship integrations that **look intentional**, not accidental.
- **Ownership:** Self-hostable, open code when your organization demands it.

---

## CTA

- **Try it:** Open the app, create a webflow, attach an environment, and **run**—then open **history** and confirm the world matches what you expect.
- **Go deeper:** Read the in-app documentation for nodes, environments, runs, and sharing.
- **Build with us:** Star or fork the open-source project if self-hosting or contributions fit your model.

---

## Social proof

- **Open source (MIT)** — inspect the implementation, adapt it, and run it on your infrastructure.
- **Built for engineers** — positioning and UX assume you already speak HTTP, JSON, and environments; no low-code bait-and-switch.

*(Add customer logos, quotes, or usage stats here when you have them; keep claims verifiable.)*

---

## Comparison

| Approach | Strength | Where API Flux fits |
|----------|----------|----------------------|
| **Ad hoc scripts** | Fast for one person | API Flux wins on **sharing**, **history**, and **visual clarity** |
| **API client collections** | Great for manual calls | API Flux adds **orchestration**, **transforms**, and **server runs** as a system |
| **Custom microservices** | Full control | API Flux fits **faster iteration** and **lighter ops** for integration-heavy work |
| **Heavy iPaaS / enterprise automation** | Broad connectors | API Flux stays **developer-native** and **self-hostable** for teams that want code-adjacent control |

---

*This document is the canonical product story for marketing and onboarding copy; align feature claims with the shipped product and your deployment.*
