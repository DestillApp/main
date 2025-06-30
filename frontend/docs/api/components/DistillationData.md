# DistillationData

Handles the distillation data inputs, such as water used and distillation time.
 * Integrates with Vuex to store form data and manage state updates.
 *

## Props

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `isFormValid` | `boolean` | yes | Indicates if the form is valid. |
| `wasSubmitted` | `boolean` | yes | Indicates if the form was submitted. |
| `isEditing` | `boolean` | no | Indicates if the form is in editing mode. |

## Exposed Methods

### `handleKeyboard()`
Handles keyboard events for integer-only input and prevents minus sign.

**Parameters:**
- `e` (`KeyboardEvent`): The keyboard event.

### `saveTime()`
Saves the distillation time (hours or minutes) to the store.

**Parameters:**
- `value` (`string | number`): The value to save.
- `key` (`string`): The key for the time field.
