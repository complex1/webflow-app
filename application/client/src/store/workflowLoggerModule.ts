import type { LogEntry } from "../classes/logger";

export interface WorkflowLogsState {
  logs: LogEntry[];
}
export default {
  namespaced: true,
  state: {
    logs: [],
  } as WorkflowLogsState,
  mutations: {
    addLog(state: WorkflowLogsState, log: LogEntry) {
      state.logs.push(log);
    },
    clearLogs(state: WorkflowLogsState) {
      state.logs = [];
    },
  }
};