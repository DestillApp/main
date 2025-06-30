# ResultsDescriptions

This component renders text areas for entering descriptions related to distillation results, including oil and hydrosol descriptions.
 *

## Props

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `isFormValid` | `boolean` | yes |  |
| `wasSubmitted` | `boolean` | yes |  |

## Exposed Methods

### `setValue()`
Sets a value in the Vuex store for a given input field.

**Parameters:**
- `value` (`string`): The value to set.
- `id` (`string`): The input field identifier.
