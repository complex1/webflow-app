# Documentation Images

This folder contains screenshots, diagrams, and other visual assets for the documentation.

## Folder Structure

```
images/
├── components/          # Component screenshots and examples
├── examples/           # Example usage screenshots
├── features/           # Feature demonstration images
├── ui-patterns/        # UI pattern examples
├── design-system/      # Design system visual examples
└── workflows/          # Workflow and process diagrams
```

## Naming Conventions

- Use kebab-case for file names
- Include component or feature name as prefix
- Use descriptive suffixes for different states
- Recommended formats: PNG, JPG, SVG, WebP

### Examples:
- `ui-button-variants.png`
- `ui-modal-open-state.jpg`
- `webflow-playground-overview.png`
- `api-node-connection-example.svg`
- `design-system-colors.png`

## Image Guidelines

- **Screenshots**: Use consistent browser/device for uniform appearance
- **Component Examples**: Show different states (default, hover, disabled, etc.)
- **Workflow Diagrams**: Keep clean and readable with proper contrast
- **File Size**: Optimize images for web (recommended < 500KB per image)
- **Resolution**: Use 2x resolution for Retina display support

## Usage in Documentation

Reference images in documentation using relative paths:

```vue
<img src="./images/components/ui-button-variants.png" alt="Button Variants" />
```

Or in markdown:

```markdown
![Button Variants](./images/components/ui-button-variants.png)
```