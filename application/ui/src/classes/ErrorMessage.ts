class ErrorMessage {
  message: string;
  type: string;
  constructor(message: string, type: string) {
    this.message = message;
    this.type = type;
  }
  getMessage(): string {
    return this.message;
  }
  getType(): string {
    return this.type;
  }
  setMessage(message: string): void {
    this.message = message;
  }
  setType(type: string): void {
    this.type = type;
  }
}

export default ErrorMessage;