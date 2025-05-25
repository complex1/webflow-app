declare global {
	interface Window {
		monaco: any;
	}
}

interface MonacoEditorOptions {
  value: string;
  language: string;
  theme: string;
  readOnly: boolean;
  onChange?: (value: string) => void;
  [key: string]: any;
}
export class MonacoEditor {
    private editor: any;
    private container: HTMLElement;
    private options: MonacoEditorOptions;
    onChange: ((value: string) => void) | undefined;

    constructor(container: HTMLElement, options: MonacoEditorOptions) {
        this.container = container;
        
        // Create a deep copy of options to avoid any reactivity/proxy issues
        this.options = JSON.parse(JSON.stringify({
            ...options,
            value: String(options.value || ''),
            language: String(options.language || 'javascript'),
            theme: String(options.theme || 'vs'),
            readOnly: Boolean(options.readOnly)
        }));
        
        // Store onChange callback separately (not as a reactive property)
        if (options.onChange) {
            // Use Function.prototype.bind to create a new function that's not reactive
            this.onChange = Function.prototype.bind.call(
                options.onChange,
                null
            );
        }
        
        // Create clean editor options without onChange handler
        const editorOptions = { ...this.options };
        delete editorOptions.onChange;
        
        // Create editor with safe options
        this.editor = window.monaco.editor.create(this.container, editorOptions);

        // Set up the change handler with a try-catch to prevent crashes
        this.editor.onDidChangeModelContent(() => {
            setTimeout(() => {
                try {
                    if (this.onChange) {
                        // Get a clean non-reactive value
                        const value = String(this.editor.getValue());
                        this.onChange(value);
                    }
                } catch (error) {
                    console.error('Error in Monaco editor change handler:', error);
                }
            }, 0); // Use setTimeout to break the reactive chain
        });
    }

    public setValue(value: string) {
        try {
            // Convert to string to avoid proxy issues
            const safeValue = String(value || '');
            this.editor.setValue(safeValue);
        } catch (error) {
            console.error('Error setting Monaco editor value:', error);
        }
    }

    public getValue(): string {
        try {
            // Return a clean string copy, not a proxy
            return String(this.editor.getValue());
        } catch (error) {
            console.error('Error getting Monaco editor value:', error);
            return '';
        }
    }

    public changeTheme(theme: string) {
        window.monaco.editor.setTheme(theme);
    }

    public dispose() {
        try {
            if (this.editor) {
                this.editor.dispose();
                this.editor = null;
            }
        } catch (error) {
            console.error('Error disposing Monaco editor:', error);
        }
    }
}
