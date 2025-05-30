interface Log {
    timestamp: number;
    message: any;
    type: 'info' | 'warn' | 'error' | 'debug';
}

class Logger {
   logs: Log[] = [];

    constructor() {
         // Initialize with an empty log array
         this.logs = [];
    }

   log(message: any, type: 'info' | 'warn' | 'error' | 'debug' = 'info'): void {
       const logEntry: Log = {
           timestamp: new Date().getTime(),
           message,
           type: type || 'info'
       };
       this.logs.push(logEntry);
   }
   info(message: any): void {
         // Log an informational message
         this.log(message, 'info');
   }
   success(message: any): void {
         this.log(message, 'info');
   }
   warn(message: any): void {
       this.log(message, 'warn');
   }
   error(message: any): void {
       this.log(message, 'error');
   }
   debug(message: any): void {
       this.log(message, 'debug');
   }
}

export default Logger;
