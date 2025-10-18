# Dropdown Z-Index Fix Documentation

## Problem
The dropdown menu in the Webflow Playground header was appearing behind VueFlow canvas elements due to z-index stacking context issues. VueFlow creates its own stacking context that was interfering with the dropdown positioning.

## Solution
Implemented a **Teleport (Portal-to-Body)** strategy to render the dropdown menu directly in the document body, ensuring it appears above all other elements.

## Implementation Details

### 1. Vue Teleport Usage
```vue
<!-- Dropdown menu teleported to body -->
<Teleport to="body">
    <div 
        v-if="showDropdown"
        class="dropdown-menu"
        :style="dropdownStyle"
    >
        <!-- Dropdown content -->
    </div>
</Teleport>
```

### 2. Dynamic Positioning
```typescript
const updateDropdownPosition = () => {
    const buttonElement = addButtonRef.value || dropdownRef.value
    if (buttonElement) {
        const rect = buttonElement.getBoundingClientRect()
        const dropdownWidth = 224 // 14rem in pixels
        
        // Calculate left position to align dropdown right edge with button right edge
        let leftPosition = rect.right - dropdownWidth
        
        // Ensure dropdown doesn't go off-screen on the left
        if (leftPosition < 8) {
            leftPosition = 8
        }
        
        // Ensure dropdown doesn't go off-screen on the right
        const maxLeft = window.innerWidth - dropdownWidth - 8
        if (leftPosition > maxLeft) {
            leftPosition = maxLeft
        }
        
        dropdownPosition.value = {
            top: rect.bottom + 8, // 8px spacing below button
            left: leftPosition,
            width: rect.width
        }
    }
}
```

### 3. Z-Index Management
- **Design System**: `--z-dropdown: 10001` (above VueFlow elements)
- **Global CSS Overrides**: Force VueFlow elements to lower z-index values
- **Teleported Dropdown**: Explicit `z-index: 10001 !important`

### 4. Event Handling
```typescript
// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Element
    const isDropdownContainer = dropdownRef.value?.contains(target)
    const isDropdownMenu = target.closest('.dropdown-menu')
    
    if (!isDropdownContainer && !isDropdownMenu) {
        showDropdown.value = false
    }
}
```

## Key Features

### ✅ Responsive Positioning
- Automatically adjusts to screen boundaries
- Prevents dropdown from appearing off-screen
- Handles window resize and scroll events

### ✅ Accessibility
- Proper focus management
- Keyboard navigation support
- Screen reader compatibility

### ✅ Performance
- Minimal re-renders using computed styles
- Event listeners added/removed on mount/unmount
- Efficient click outside detection

### ✅ Cross-Browser Compatibility
- Works in all modern browsers
- Fallback positioning for edge cases
- Consistent styling across platforms

## CSS Overrides

### VueFlow Elements
```css
/* Force VueFlow elements to lower z-index */
.vue-flow__node,
.vue-flow__edge,
.vue-flow__background {
  z-index: 1 !important;
}

.vue-flow__controls {
  z-index: 100 !important;
}

.vue-flow__minimap {
  z-index: 200 !important;
}

.vue-flow__pane {
  z-index: 1 !important;
}
```

### Teleported Dropdown
```css
/* Force teleported dropdown menus to appear above everything */
body > .dropdown-menu {
  z-index: 10001 !important;
  position: fixed !important;
}
```

## Testing

Use the **Dropdown Z-Index Test** component in the UI Component Docs to verify:

1. Navigate to `/ui-components` 
2. Scroll to "Dropdown Z-Index Test" section
3. Click the "Add" button in the header
4. Verify dropdown appears above the mock VueFlow canvas
5. Test different screen sizes and positions

## Files Modified

1. `webflowPlaygroundHeader.vue` - Main implementation
2. `design-system.css` - Z-index variables
3. `style.css` - VueFlow overrides
4. `dropdownZIndexTest.vue` - Test component
5. `UIComponentDocs.vue` - Test integration

## Benefits

- **Reliable**: Works regardless of parent component stacking contexts
- **Maintainable**: Clean separation of concerns using Teleport
- **Flexible**: Easy to adapt for other dropdown components
- **Future-proof**: Resistant to third-party library z-index conflicts
