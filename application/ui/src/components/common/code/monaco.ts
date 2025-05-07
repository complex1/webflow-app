declare global {
	interface Window {
		monaco: any;
	}
}
const monaco = window.monaco;
export class MonacoEditor {
    private editor: any;
    private container: HTMLElement;
    private options: any;
    onChange: ((value: string) => void) | undefined;

    constructor(container: HTMLElement, options: any) {
        this.container = container;
        this.options = options;
        this.editor = monaco.editor.create(this.container, this.options);

        this.editor.onDidChangeModelContent(() => {
            if (this.onChange) {
                this.onChange(this.editor.getValue());
            }
        });
        this.onChange = options.onChange;
    }

    public setValue(value: string) {
        this.editor.setValue(value);
    }

    public getValue(): string {
        return this.editor.getValue();
    }

    public changeTheme(theme: string) {
        monaco.editor.setTheme(theme);
    }

    public dispose() {
        this.editor.dispose();
    }
}
