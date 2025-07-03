# ListLengthSettings

[View source on GitHub](https://github.com/DestillApp/main/blob/main/frontend/src/components/ListLengthSettings.vue)

Dropdown component for selecting the number of items displayed in a list. Allows the user to choose between different list lengths and emits the selected value.
 *

## Props

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string` | yes | The title displayed above the list. |
| `listColor` | `"plant" | "distillation" | "results"` | yes | The color theme for the list. |
| `chosenLength` | `number` | yes | The currently selected list length. |

## Emits

- `select-length`

## Exposed Methods

### `toggleList()`
Toggles the visibility of the list dropdown and manages click outside event.

### `selectLength()`
Emits the selected list length and closes the dropdown.

**Parameters:**
- `length` (`number`): The selected list length.

### `handleClickOutside()`
Handles clicks outside the dropdown to close it.

**Parameters:**
- `event` (`MouseEvent`): The click event.
