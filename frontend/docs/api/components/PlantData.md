# PlantData

This component renders inputs and manages data related to plant material used in distillation, including weight, state, and drying/age information.
 *

## Props

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `isFormValid` | `boolean` | yes |  |
| `isResetting` | `boolean` | no |  |
| `isEditing` | `boolean` | no |  |
| `wasSubmitted` | `boolean` | yes |  |

## Exposed Methods

### `handleKeyboard()`
Handles keyboard events for integer-only input and prevents minus sign.

**Parameters:**
- `e` (`KeyboardEvent`): The keyboard event.
