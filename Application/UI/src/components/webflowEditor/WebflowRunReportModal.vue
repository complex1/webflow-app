<template>
  <Modal
    :open="open"
    :title="modalTitle"
    width="min(960px, 96vw)"
    root-class="webflow-run-report-modal-root"
    @close="emit('close')"
  >
    <div ref="pdfRootRef" class="run-report">
      <Text variant="sm" tone="muted" as="p" class="run-report__intro">
        This report summarizes a single server-side execution: overall outcome, each node in order, timings,
        HTTP status where applicable, errors, outputs, and the final variable pool snapshot.
      </Text>

      <div v-if="loading" class="run-report__loading">
        <Spinner />
        <Text tone="muted">Loading execution…</Text>
      </div>
      <Alert v-else-if="loadError" variant="error">{{ loadError }}</Alert>
      <template v-else-if="execution">
        <div class="run-report__banner" :data-outcome="runOutcomeKey">
          <div class="run-report__banner-main">
            <Heading :level="4" class="run-report__banner-title">{{ runOutcomeLabel }}</Heading>
            <Text variant="sm" tone="muted" class="run-report__banner-sub">{{ bannerSubtitle }}</Text>
          </div>
          <Badge :variant="runStatusBadgeVariant(execution.status)">{{ execution.status }}</Badge>
        </div>

        <div v-if="execution.errorSummary" class="run-report__callout run-report__callout--error">
          <Text variant="sm" weight="medium">Run-level error</Text>
          <Text variant="sm" class="run-report__callout-body">{{ execution.errorSummary }}</Text>
        </div>

        <section class="run-report__section" aria-label="Summary metrics">
          <Heading :level="5" class="run-report__section-title">Summary</Heading>
          <div class="run-report__metrics">
            <div class="run-report__metric">
              <span class="run-report__metric-label">Wall duration</span>
              <span class="run-report__metric-value">{{ wallDurationLabel }}</span>
            </div>
            <div class="run-report__metric">
              <span class="run-report__metric-label">Started</span>
              <span class="run-report__metric-value">{{ formatWhen(execution.createdAt) }}</span>
            </div>
            <div class="run-report__metric">
              <span class="run-report__metric-label">Finished</span>
              <span class="run-report__metric-value">{{
                execution.status === "running" ? "—" : formatWhen(execution.updatedAt)
              }}</span>
            </div>
            <div class="run-report__metric">
              <span class="run-report__metric-label">Timeline steps</span>
              <span class="run-report__metric-value">{{ timeline.length }}</span>
            </div>
          </div>
          <div class="run-report__chips" aria-label="Step outcomes">
            <span class="run-report__chip run-report__chip--ok">
              <strong>{{ stats.success }}</strong> succeeded
            </span>
            <span class="run-report__chip run-report__chip--bad">
              <strong>{{ stats.failure }}</strong> failed
            </span>
            <span class="run-report__chip run-report__chip--skip">
              <strong>{{ stats.skipped }}</strong> skipped
            </span>
            <span v-if="stats.other > 0" class="run-report__chip run-report__chip--muted">
              <strong>{{ stats.other }}</strong> other
            </span>
          </div>
        </section>

        <section class="run-report__section" aria-label="Node timeline">
          <Heading :level="5" class="run-report__section-title">Node-by-node timeline</Heading>
          <Text variant="sm" tone="muted" class="run-report__hint">
            Order matches execution. Each row shows how long the node ran, its status, and any captured output
            or error.
          </Text>
          <ul class="run-report__timeline">
            <li
              v-for="(step, idx) in timeline"
              :key="`${step.nodeId}-${idx}`"
              class="run-report__step"
              :data-status="stepStatusKey(step.status)"
            >
              <div class="run-report__step-card">
                <div class="run-report__step-top">
                  <span class="run-report__step-index">{{ idx + 1 }}</span>
                  <div class="run-report__step-headline">
                    <strong class="run-report__step-name">{{ step.nodeName || step.nodeId }}</strong>
                    <span class="run-report__step-type">{{ step.nodeType }}</span>
                  </div>
                  <Badge :variant="nodeBadgeVariant(step.status)">{{ step.status }}</Badge>
                </div>
                <dl class="run-report__step-meta">
                  <div class="run-report__step-meta-row">
                    <dt>Node id</dt>
                    <dd class="run-report__mono">{{ step.nodeId }}</dd>
                  </div>
                  <div class="run-report__step-meta-row">
                    <dt>Started</dt>
                    <dd>{{ formatWhen(step.startedAt) }}</dd>
                  </div>
                  <div class="run-report__step-meta-row">
                    <dt>Finished</dt>
                    <dd>{{ step.finishedAt ? formatWhen(step.finishedAt) : "—" }}</dd>
                  </div>
                  <div class="run-report__step-meta-row">
                    <dt>Step duration</dt>
                    <dd>{{ formatStepDuration(step) }}</dd>
                  </div>
                  <div v-if="step.httpStatus != null" class="run-report__step-meta-row">
                    <dt>HTTP status</dt>
                    <dd>
                      <span class="run-report__http" :data-http="httpBucket(step.httpStatus)">{{
                        step.httpStatus
                      }}</span>
                    </dd>
                  </div>
                </dl>
                <div v-if="step.error" class="run-report__step-error">
                  <Text variant="sm" weight="medium">Error</Text>
                  <pre class="run-report__pre run-report__pre--error">{{ step.error }}</pre>
                </div>
                <details v-if="step.output !== undefined" class="run-report__details">
                  <summary>Output (structured)</summary>
                  <pre class="run-report__pre">{{ formatJsonTruncated(step.output) }}</pre>
                </details>
              </div>
            </li>
          </ul>
        </section>

        <section class="run-report__section" aria-label="Variable pool">
          <Heading :level="5" class="run-report__section-title">Final variable pool</Heading>
          <Text variant="sm" tone="muted" class="run-report__hint">
            Values keyed by variable id after this run (same shape as the editor’s global variable store). Large
            payloads are truncated in the preview; use <strong>Download JSON</strong> for the full snapshot.
          </Text>
          <div v-if="!variablePoolKeys.length" class="run-report__empty-pool">
            <Text tone="muted">No variable pool was stored for this run.</Text>
          </div>
          <details v-else class="run-report__details run-report__details--pool" open>
            <summary>{{ variablePoolKeys.length }} variable id(s) — show / hide JSON</summary>
            <pre class="run-report__pre run-report__pre--pool">{{ variablePoolPreview }}</pre>
          </details>
        </section>
      </template>
    </div>

    <template #footer>
      <Inline
        gap="sm"
        justify="space-between"
        align="center"
        wrap
        full-width
        class="run-report__footer"
      >
        <Inline gap="sm" wrap>
          <Button variant="secondary" type="button" size="sm" :disabled="!execution || loading" @click="copyMarkdown">
            Copy Markdown
          </Button>
          <Button variant="secondary" type="button" size="sm" :disabled="!execution || loading" @click="downloadJson">
            Download JSON
          </Button>
          <Button
            variant="secondary"
            type="button"
            size="sm"
            :disabled="!execution || loading || pdfGenerating"
            :loading="pdfGenerating"
            @click="downloadPdf"
          >
            Download PDF
          </Button>
        </Inline>
        <span v-if="copyFeedback === 'ok'" class="run-report__feedback run-report__feedback--ok">Copied.</span>
        <span v-else-if="copyFeedback === 'err'" class="run-report__feedback run-report__feedback--err"
          >Could not copy.</span
        >
        <span v-else-if="pdfError" class="run-report__feedback run-report__feedback--err">{{ pdfError }}</span>
      </Inline>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import Modal from "@/components/common/overlay/Modal.vue";
import Heading from "@/components/common/typography/Heading.vue";
import Text from "@/components/common/typography/Text.vue";
import Badge from "@/components/common/feedback/Badge.vue";
import Alert from "@/components/common/feedback/Alert.vue";
import Spinner from "@/components/common/feedback/Spinner.vue";
import Button from "@/components/common/buttons/Button.vue";
import Inline from "@/components/common/foundation/Inline.vue";
import {
  webFlowService,
  type NodeTimelineEntry,
  type WebFlowExecutionDetail,
} from "@/services/webflow";

const props = defineProps<{
  open: boolean;
  webflowId: number;
  runId: number;
  webflowName?: string;
}>();

const emit = defineEmits<{ (e: "close"): void }>();

const loading = ref(false);
const loadError = ref<string | null>(null);
const execution = ref<WebFlowExecutionDetail | null>(null);
const copyFeedback = ref<"idle" | "ok" | "err">("idle");
const pdfRootRef = ref<HTMLElement | null>(null);
const pdfGenerating = ref(false);
const pdfError = ref<string | null>(null);

const modalTitle = computed(() =>
  props.runId > 0 ? `Execution report · Run #${props.runId}` : "Execution report"
);

const webflowLabel = computed(() => props.webflowName?.trim() || "Webflow");

const bannerSubtitle = computed(() => {
  const ex = execution.value;
  if (!ex) return "";
  const base = `${webflowLabel.value} · Run #${ex.id}`;
  return ex.webFlowId != null ? `${base} · Webflow id ${ex.webFlowId}` : base;
});

const timeline = computed(() => execution.value?.nodeTimeline ?? []);

const stats = computed(() => {
  const s = { success: 0, failure: 0, skipped: 0, other: 0 };
  for (const step of timeline.value) {
    if (step.status === "SUCCESS") s.success += 1;
    else if (step.status === "FAILURE") s.failure += 1;
    else if (step.status === "SKIPPED") s.skipped += 1;
    else s.other += 1;
  }
  return s;
});

const runOutcomeKey = computed(() => {
  const st = execution.value?.status;
  if (st === "completed") return "completed";
  if (st === "failed") return "failed";
  if (st === "running") return "running";
  return "unknown";
});

const runOutcomeLabel = computed(() => {
  const st = execution.value?.status;
  if (st === "completed") return "Run completed successfully";
  if (st === "failed") return "Run failed";
  if (st === "running") return "Run in progress";
  return "Run status unknown";
});

function runStatusBadgeVariant(s: string) {
  if (s === "completed") return "success" as const;
  if (s === "failed") return "error" as const;
  return "default" as const;
}

function nodeBadgeVariant(status: string) {
  if (status === "SUCCESS") return "success" as const;
  if (status === "FAILURE") return "error" as const;
  if (status === "IN_PROGRESS") return "info" as const;
  return "default" as const;
}

function stepStatusKey(status: string) {
  if (status === "SUCCESS") return "success";
  if (status === "FAILURE") return "failure";
  if (status === "SKIPPED") return "skipped";
  if (status === "IN_PROGRESS") return "progress";
  return "other";
}

function httpBucket(code: number) {
  if (code >= 200 && code < 300) return "2xx";
  if (code >= 400 && code < 500) return "4xx";
  if (code >= 500) return "5xx";
  return "other";
}

function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function wallDurationLabelFor(ex: WebFlowExecutionDetail) {
  if (ex.status === "running") return "In progress…";
  try {
    const start = new Date(ex.createdAt).getTime();
    const end = new Date(ex.updatedAt).getTime();
    if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return "—";
    return formatMs(end - start);
  } catch {
    return "—";
  }
}

const wallDurationLabel = computed(() =>
  execution.value ? wallDurationLabelFor(execution.value) : "—"
);

function formatMs(ms: number) {
  if (ms < 1000) return `${Math.round(ms)} ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)} s`;
  const m = Math.floor(ms / 60_000);
  const s = Math.round((ms % 60_000) / 1000);
  return `${m}m ${s}s`;
}

function stepDurationMs(step: NodeTimelineEntry): number | null {
  if (!step.startedAt || !step.finishedAt) return null;
  const a = new Date(step.startedAt).getTime();
  const b = new Date(step.finishedAt).getTime();
  if (!Number.isFinite(a) || !Number.isFinite(b) || b < a) return null;
  return b - a;
}

function formatStepDuration(step: NodeTimelineEntry) {
  const ms = stepDurationMs(step);
  return ms == null ? "—" : formatMs(ms);
}

function formatJson(v: unknown): string {
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
}

function timelineStats(tl: NodeTimelineEntry[]) {
  const s = { success: 0, failure: 0, skipped: 0, other: 0 };
  for (const step of tl) {
    if (step.status === "SUCCESS") s.success += 1;
    else if (step.status === "FAILURE") s.failure += 1;
    else if (step.status === "SKIPPED") s.skipped += 1;
    else s.other += 1;
  }
  return s;
}

const MAX_PREVIEW_JSON = 48_000;

function formatJsonTruncated(v: unknown): string {
  const full = formatJson(v);
  if (full.length <= MAX_PREVIEW_JSON) return full;
  return `${full.slice(0, MAX_PREVIEW_JSON)}\n\n… truncated (${full.length} characters total) — use Download JSON for full data.`;
}

const variablePoolKeys = computed(() => {
  const pool = execution.value?.variablePool;
  if (!pool || typeof pool !== "object") return [];
  return Object.keys(pool).sort();
});

const variablePoolPreview = computed(() => {
  const pool = execution.value?.variablePool;
  if (!pool || typeof pool !== "object") return "—";
  return formatJsonTruncated(pool);
});

function buildMarkdown(ex: WebFlowExecutionDetail): string {
  const name = props.webflowName?.trim() || "Webflow";
  const tl = ex.nodeTimeline || [];
  const st = timelineStats(tl);
  const lines: string[] = [];
  lines.push(`# Execution report`);
  lines.push(``);
  lines.push(`- **Webflow:** ${name}`);
  lines.push(`- **Run id:** ${ex.id}`);
  lines.push(`- **Webflow id:** ${ex.webFlowId}`);
  lines.push(`- **Status:** ${ex.status}`);
  lines.push(`- **Started:** ${ex.createdAt}`);
  lines.push(`- **Updated:** ${ex.updatedAt}`);
  lines.push(`- **Wall duration:** ${wallDurationLabelFor(ex)}`);
  if (ex.errorSummary) {
    lines.push(`- **Run error:** ${ex.errorSummary}`);
  }
  lines.push(``);
  lines.push(`## Step summary`);
  lines.push(``);
  lines.push(
    `Succeeded: **${st.success}** · Failed: **${st.failure}** · Skipped: **${st.skipped}** · Other: **${st.other}**`
  );
  lines.push(``);
  lines.push(`## Timeline`);
  lines.push(``);
  tl.forEach((step, idx) => {
    lines.push(`### ${idx + 1}. ${step.nodeName || step.nodeId} (${step.nodeType})`);
    lines.push(``);
    lines.push(`- **Status:** ${step.status}`);
    lines.push(`- **Node id:** \`${step.nodeId}\``);
    lines.push(`- **Started:** ${step.startedAt}`);
    lines.push(`- **Finished:** ${step.finishedAt ?? "—"}`);
    lines.push(`- **Step duration:** ${formatStepDuration(step)}`);
    if (step.httpStatus != null) lines.push(`- **HTTP:** ${step.httpStatus}`);
    if (step.error) {
      lines.push(`- **Error:**`);
      lines.push(`\`\`\`text`);
      lines.push(step.error);
      lines.push(`\`\`\``);
    }
    if (step.output !== undefined) {
      lines.push(`- **Output:**`);
      lines.push(`\`\`\`json`);
      lines.push(formatJsonTruncated(step.output));
      lines.push(`\`\`\``);
    }
    lines.push(``);
  });
  lines.push(`## Variable pool`);
  lines.push(``);
  if (ex.variablePool && typeof ex.variablePool === "object" && Object.keys(ex.variablePool).length) {
    lines.push(`\`\`\`json`);
    lines.push(formatJsonTruncated(ex.variablePool));
    lines.push(`\`\`\``);
  } else {
    lines.push(`_No variable pool stored._`);
  }
  return lines.join("\n");
}

async function copyMarkdown() {
  const ex = execution.value;
  if (!ex) return;
  try {
    await navigator.clipboard.writeText(buildMarkdown(ex));
    copyFeedback.value = "ok";
    setTimeout(() => {
      copyFeedback.value = "idle";
    }, 2200);
  } catch {
    copyFeedback.value = "err";
    setTimeout(() => {
      copyFeedback.value = "idle";
    }, 3200);
  }
}

function downloadJson() {
  const ex = execution.value;
  if (!ex) return;
  const blob = new Blob([JSON.stringify(ex, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `webflow-run-${ex.id}-report.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Inline resolved colors on the clone so html2canvas does not parse color-mix() / color() from stylesheets. */
function mirrorPaintForPdfSnapshot(origRoot: HTMLElement, clonedRoot: HTMLElement) {
  const walk = (o: Element, c: Element) => {
    if (o instanceof HTMLElement && c instanceof HTMLElement) {
      const cs = window.getComputedStyle(o);
      const props = [
        "background-color",
        "color",
        "border-top-color",
        "border-right-color",
        "border-bottom-color",
        "border-left-color",
      ] as const;
      for (const prop of props) {
        const v = cs.getPropertyValue(prop).trim();
        if (!v || v === "transparent" || v === "rgba(0, 0, 0, 0)") continue;
        if (/color-mix|color\(|oklch|lab\(|lch\(/i.test(v)) continue;
        c.style.setProperty(prop, v);
      }
    }
    const on = o.children;
    const cn = c.children;
    for (let i = 0; i < Math.min(on.length, cn.length); i++) {
      walk(on[i]!, cn[i]!);
    }
  };
  walk(origRoot, clonedRoot);
}

/**
 * Client-side PDF: lazy-load html2canvas + jsPDF only when exporting so a stale Vite dep cache
 * does not break the whole WebflowEditor route (504 Outdated Optimize Dep).
 */
async function downloadPdf() {
  const ex = execution.value;
  const el = pdfRootRef.value;
  if (!ex || !el) return;

  pdfGenerating.value = true;
  pdfError.value = null;

  const details = [...el.querySelectorAll("details")] as HTMLDetailsElement[];
  const prevOpen = details.map((d) => d.open);
  details.forEach((d) => {
    d.open = true;
  });

  const prevMaxHeight = el.style.maxHeight;
  const prevOverflow = el.style.overflow;

  el.style.maxHeight = "none";
  el.style.overflow = "visible";

  try {
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);

    const addCanvasToPdfPages = (
      canvas: HTMLCanvasElement,
      pdf: InstanceType<typeof jsPDF>,
      marginMm: number
    ) => {
      const pageWidthMm = pdf.internal.pageSize.getWidth() - marginMm * 2;
      const pageHeightMm = pdf.internal.pageSize.getHeight() - marginMm * 2;

      const srcW = canvas.width;
      const srcH = canvas.height;
      const scale = pageWidthMm / srcW;
      let cursorPx = 0;

      while (cursorPx < srcH) {
        const slicePx = Math.min(Math.ceil(pageHeightMm / scale), srcH - cursorPx);

        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = srcW;
        sliceCanvas.height = slicePx;
        const ctx = sliceCanvas.getContext("2d");
        if (!ctx) {
          throw new Error("Canvas 2D context unavailable");
        }
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, srcW, slicePx);
        ctx.drawImage(canvas, 0, cursorPx, srcW, slicePx, 0, 0, srcW, slicePx);

        const sliceData = sliceCanvas.toDataURL("image/jpeg", 0.88);
        const sliceHeightMm = slicePx * scale;

        if (cursorPx > 0) {
          pdf.addPage();
        }
        pdf.addImage(sliceData, "JPEG", marginMm, marginMm, pageWidthMm, sliceHeightMm);

        cursorPx += slicePx;
      }
    };

    await nextTick();
    await new Promise<void>((r) => requestAnimationFrame(() => r()));
    await new Promise<void>((r) => requestAnimationFrame(() => r()));

    const pixels = el.scrollWidth * el.scrollHeight;
    const scale = pixels > 6_000_000 ? 1 : pixels > 2_500_000 ? 1.5 : 2;

    const canvas = await html2canvas(el, {
      scale,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "#ffffff",
      onclone: (_doc, clonedEl) => {
        if (clonedEl instanceof HTMLElement) {
          mirrorPaintForPdfSnapshot(el, clonedEl);
        }
      },
    });

    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    addCanvasToPdfPages(canvas, pdf, 12);
    pdf.save(`webflow-run-${ex.id}-report.pdf`);
  } catch (err) {
    console.error("[WebflowRunReportModal] PDF export failed", err);
    pdfError.value = "Could not generate PDF.";
    setTimeout(() => {
      pdfError.value = null;
    }, 5000);
  } finally {
    el.style.maxHeight = prevMaxHeight;
    el.style.overflow = prevOverflow;
    details.forEach((d, i) => {
      d.open = prevOpen[i]!;
    });
    pdfGenerating.value = false;
  }
}

async function load() {
  loadError.value = null;
  execution.value = null;
  if (!props.open) return;
  const wf = props.webflowId;
  const rid = props.runId;
  if (!Number.isFinite(wf) || wf <= 0 || !Number.isFinite(rid) || rid <= 0) {
    loadError.value = "Invalid webflow or run.";
    return;
  }
  loading.value = true;
  try {
    execution.value = await webFlowService.getExecution(wf, rid);
  } catch {
    loadError.value = "Could not load this execution.";
  } finally {
    loading.value = false;
  }
}

watch(
  () => [props.open, props.webflowId, props.runId] as const,
  () => {
    void load();
  },
  { immediate: true }
);

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      pdfError.value = null;
    }
  }
);
</script>

<style scoped>
.run-report {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  max-height: min(78vh, 880px);
  overflow-y: auto;
  padding-right: var(--space-1);
}
.run-report__intro {
  margin: 0;
  line-height: 1.5;
}
.run-report__loading {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: var(--space-3) 0;
}
.run-report__banner {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  page-break-inside: avoid;
  break-inside: avoid;
}
.run-report__banner[data-outcome="completed"] {
  /* Solid rgba — html2canvas cannot parse color-mix() / modern color() */
  background: rgba(34, 197, 94, 0.12);
  border-color: rgba(34, 197, 94, 0.4);
}
.run-report__banner[data-outcome="failed"] {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.4);
}
.run-report__banner[data-outcome="running"] {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.38);
}
.run-report__banner-title {
  margin: 0 0 var(--space-1);
  font-size: var(--text-lg);
}
.run-report__banner-sub {
  margin: 0;
}
.run-report__callout {
  padding: var(--space-3);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
}
.run-report__callout--error {
  border-color: rgba(239, 68, 68, 0.45);
  background: rgba(239, 68, 68, 0.08);
}
.run-report__callout-body {
  margin: var(--space-1) 0 0;
  white-space: pre-wrap;
  word-break: break-word;
}
.run-report__section-title {
  margin: 0 0 var(--space-2);
  font-size: var(--text-md);
}
.run-report__hint {
  margin: 0 0 var(--space-3);
  line-height: 1.45;
}
.run-report__metrics {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}
.run-report__metric {
  padding: var(--space-3);
  border-radius: var(--radius-md);
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
}
.run-report__metric-label {
  display: block;
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 4px;
}
.run-report__metric-value {
  font-size: var(--text-sm);
  word-break: break-word;
}
.run-report__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.run-report__chip {
  font-size: var(--text-sm);
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid var(--border-subtle);
  background: var(--bg-elevated);
}
.run-report__chip--ok {
  border-color: rgba(34, 197, 94, 0.45);
}
.run-report__chip--bad {
  border-color: rgba(239, 68, 68, 0.45);
}
.run-report__chip--skip {
  border-color: rgba(107, 114, 128, 0.55);
}
.run-report__chip--muted {
  opacity: 0.9;
}
.run-report__timeline {
  list-style: none;
  margin: 0;
  padding: 0 0 0 4px;
  position: relative;
}
.run-report__timeline::before {
  content: "";
  position: absolute;
  left: 15px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: var(--border-subtle);
  border-radius: 1px;
}
.run-report__step {
  position: relative;
  padding-left: 36px;
  margin-bottom: var(--space-3);
}
.run-report__step::before {
  content: "";
  position: absolute;
  left: 9px;
  top: 18px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--bg-secondary);
  border: 3px solid var(--border-default);
  z-index: 1;
}
.run-report__step[data-status="success"]::before {
  border-color: var(--success-green, #2e7d32);
  background: rgba(34, 197, 94, 0.22);
}
.run-report__step[data-status="failure"]::before {
  border-color: var(--error-red);
  background: rgba(239, 68, 68, 0.2);
}
.run-report__step[data-status="skipped"]::before {
  border-color: var(--text-muted);
}
.run-report__step[data-status="progress"]::before {
  border-color: var(--accent-blue);
}
.run-report__step-card {
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: var(--space-3);
  background: var(--bg-secondary);
  page-break-inside: avoid;
  break-inside: avoid;
}
.run-report__step-top {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}
.run-report__step-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.75rem;
  height: 1.75rem;
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: 700;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
}
.run-report__step-headline {
  flex: 1;
  min-width: 12rem;
}
.run-report__step-name {
  display: block;
  font-size: var(--text-sm);
}
.run-report__step-type {
  font-size: var(--text-xs);
  color: var(--text-muted);
}
.run-report__step-meta {
  margin: 0;
  display: grid;
  gap: 6px;
  font-size: var(--text-sm);
}
.run-report__step-meta-row {
  display: grid;
  grid-template-columns: 6.5rem 1fr;
  gap: var(--space-2);
  align-items: start;
}
.run-report__step-meta-row dt {
  margin: 0;
  font-weight: 600;
  color: var(--text-muted);
}
.run-report__step-meta-row dd {
  margin: 0;
  word-break: break-word;
}
.run-report__mono {
  font-family: ui-monospace, monospace;
  font-size: 0.85em;
}
.run-report__http[data-http="2xx"] {
  color: var(--success-green, #2e7d32);
  font-weight: 600;
}
.run-report__http[data-http="4xx"],
.run-report__http[data-http="5xx"] {
  color: var(--error-red);
  font-weight: 600;
}
.run-report__step-error {
  margin-top: var(--space-2);
}
.run-report__pre {
  margin: var(--space-1) 0 0;
  padding: var(--space-2);
  background: var(--bg-elevated);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  overflow: auto;
  max-height: 240px;
  white-space: pre-wrap;
  word-break: break-word;
}
.run-report__pre--error {
  max-height: 180px;
  border: 1px solid rgba(239, 68, 68, 0.45);
}
.run-report__pre--pool {
  max-height: 320px;
}
.run-report__details {
  margin-top: var(--space-2);
  font-size: var(--text-sm);
}
.run-report__details summary {
  cursor: pointer;
  font-weight: 600;
  color: var(--accent-blue);
}
.run-report__empty-pool {
  padding: var(--space-2) 0;
}
.run-report__footer {
  width: 100%;
}
.run-report__feedback {
  font-size: var(--text-sm);
}
.run-report__feedback--ok {
  color: var(--success-green, #2e7d32);
  font-weight: 600;
}
.run-report__feedback--err {
  color: var(--error-red);
  font-weight: 600;
}
</style>

<style>
/* Unscoped: root lives in Teleport; used for print-friendly layout */
@media print {
  .webflow-run-report-modal-root .af-modal__backdrop {
    display: none !important;
  }
  .webflow-run-report-modal-root {
    position: static !important;
    display: block !important;
    background: #fff !important;
  }
  .webflow-run-report-modal-root .af-modal__panel {
    width: 100% !important;
    max-width: none !important;
    box-shadow: none !important;
    border: none !important;
    padding: 12px !important;
  }
  .webflow-run-report-modal-root .af-modal__close {
    display: none !important;
  }
  .webflow-run-report-modal-root .af-modal__footer {
    display: none !important;
  }
}
</style>
