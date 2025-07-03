# BaseSearchItem

[View source on GitHub](https://github.com/DestillApp/main/blob/main/frontend/src/ui/BaseSearchItem.vue)

A search input component with search and clear icons, supporting color context and keyboard shortcuts.
 *

## Props

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `label` | `string` | no | The label for the search input. |
| `inputColor` | `string` | no | The color context for the input (e.g., "plant", "distillation", "results"). |

## Emits

- `search`
- `clear`

## Exposed Methods

### `changeSearchQuery()`
Handles input changes and resets search state if needed.

### `emitSearchQuery()`
Emits the search event and updates the store with the current input value.

### `clearSearchQuery()`
Clears the search input and emits the clear event.

### `handleKeyPress()`
Handles keyboard events for Enter (search) and Escape (clear).

**Parameters:**
- `event` (`KeyboardEvent`): The keyboard event.
