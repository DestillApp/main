# PlantIdentification

This component renders a form to input and manage data related to plant material used in distillation, including plant name and part.
 *

## Props

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `isFormValid` | `boolean` | yes | Indicates if the form is valid. |
| `wasSubmitted` | `boolean` | yes | Indicates if the form was submitted. |

## Exposed Methods

### `setValue()`
Dispatches an action to the Vuex store to set a specific value.

**Parameters:**
- `currentValue` (`string`): The current value to be set.
- `input` (`string`): The input field name.
