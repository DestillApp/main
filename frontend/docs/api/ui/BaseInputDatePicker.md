# BaseInputDatePicker

A component that combines a text input and a date picker modal for selecting and displaying dates.
 *

## Props

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `label` | `string` | no |  |
| `title` | `string` | no |  |
| `id` | `string` | no |  |
| `value` | `string` | no |  |
| `invalidInput` | `boolean` | no |  |
| `color` | `string` | no |  |

## Exposed Methods

### `changeVisibility()`
Toggles the visibility of the date picker modal.

### `closeModal()`
Closes the date picker modal.

### `updateDate()`
Updates the date value when a new date is selected.

**Parameters:**
- `selectedDate` (`string`): The selected date string.
