export enum LogType {
  INFO = 'info',
  ERROR = 'error',
  WARNING = 'warning',
  SUCCESS = 'success',
  DEBUG = 'debug',
  WARN = 'warn',
}

export interface LogEntry {
  timestamp: number;
  type: LogType;
  message: string | object;
}

export interface LoggerInterface {
  logs: LogEntry[];
  log(message: any, type?: LogType): void;
  info(message: any): void;
  success(message: any): void;
  warn(message: any): void;
  error(message: any): void;
  debug(message: any): void;
  clear(): void;
}

