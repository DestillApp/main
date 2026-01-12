# ListSorting

[View source on GitHub](https://github.com/DestillApp/destill-app-fullstack/blob/main/frontend/src/components/ListSorting.vue)

Dropdown component for selecting a sorting option for a list. Displays the current sorting and emits the selected value.
 *

## Props

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `options` | `string[]` | yes | Array of sorting options. |
| `sorting` | `string` | yes | The currently selected sorting option. |

## Emits

- `choose:sorting`

## Exposed Methods

### `toggleList()`
Toggles the visibility of the sorting options dropdown.

### `selectOption()`
Selects a sorting option, emits the event, and closes the dropdown.

**Parameters:**
- `option` (`string`): The selected sorting option.

### `handleClickOutside()`
Handles clicks outside the dropdown to close it.

**Parameters:**
- `event` (`MouseEvent`): The click event.
