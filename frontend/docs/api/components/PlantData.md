# PlantData

This component renders inputs and manages data related to plant material used in distillation, including weight, state, and drying/age information.
 *

## Props

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `isFormValid` | `boolean` | yes | Indicates if the form is valid. |
| `isResetting` | `boolean` | no | Indicates if the form is being reset. |
| `isEditing` | `boolean` | no | Indicates if the form is in editing mode. |
| `wasSubmitted` | `boolean` | yes | Indicates if the form was submitted. |

## Exposed Methods

### `handleKeyboard()`
Handles keyboard events for integer-only input and prevents minus sign.

**Parameters:**
- `e` (`KeyboardEvent`): The keyboard event.
