# BaseInputDatePicker

A component that combines a text input and a date picker modal for selecting and displaying dates.
 *

## Props

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `label` | `string` | no | The label for the input field. |
| `title` | `string` | no | The title for the date picker modal. |
| `id` | `string` | no | The id for the input field. |
| `value` | `string` | no | The selected date value. |
| `invalidInput` | `boolean` | no | Flag to indicate if the input is invalid. |
| `color` | `string` | no | The color context for styling (e.g., "plant", "distillation"). |

## Exposed Methods

### `changeVisibility()`
Toggles the visibility of the date picker modal.

### `closeModal()`
Closes the date picker modal.

### `updateDate()`
Updates the date value when a new date is selected.

**Parameters:**
- `selectedDate` (`string`): The selected date string.
