<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="af-dialog" role="dialog" aria-modal="true">
        <div class="af-dialog__backdrop" @click="emit('cancel')" />
        <div class="af-dialog__panel">
          <header class="af-dialog__header">
            <div>
              <p class="eyebrow">Delete node</p>
              <h3>{{ props.nodeName || 'Unnamed node' }}</h3>
            </div>
            <button class="icon-btn" type="button" @click="emit('cancel')">
              ✕
            </button>
          </header>

          <p class="muted">
            This action will remove the node from the flow. Downstream links will be
            disconnected. Continue?
          </p>

          <div class="af-dialog__actions">
            <button class="btn btn--ghost" type="button" @click="emit('cancel')">Cancel</button>
            <button class="btn btn--danger" type="button" @click="emit('confirm')">Delete node</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  open: boolean
  nodeName?: string
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>

<style scoped>
.af-dialog {
  position: fixed;
  inset: 0;
  z-index: var(--z-overlay, 50);
  display: grid;
  place-items: center;
}

.af-dialog__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
}

.af-dialog__panel {
  position: relative;
  width: min(440px, 92vw);
  background: var(--bg-secondary);
  border: 1px solid var(--border-default);
  border-radius: 14px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.35);
}

.af-dialog__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.eyebrow {
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin: 0 0 4px;
}

h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 18px;
}

.muted {
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

.af-dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn {
  border: 1px solid var(--border-default);
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 14px;
  cursor: pointer;
  background: transparent;
  color: var(--text-primary);
  transition: background var(--transition-default), color var(--transition-default), border var(--transition-default);
}

.btn--ghost:hover {
  border-color: var(--accent-blue);
}

.btn--danger {
  background: rgba(239, 68, 68, 0.12);
  border-color: var(--error-red);
  color: var(--error-red);
}

.btn--danger:hover {
  background: rgba(239, 68, 68, 0.18);
}

.icon-btn {
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 18px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-default);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
