# ResultsDescriptions

[View source on GitHub](https://github.com/DestillApp/destill-app-fullstack/blob/main/frontend/src/components/results/ResultsDescriptions.vue)

This component renders text areas for entering descriptions related to distillation results, including oil and hydrosol descriptions.
 *

## Props

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `isFormValid` | `boolean` | yes | Indicates if the form is valid. |
| `wasSubmitted` | `boolean` | yes | Indicates if the form was submitted. |

## Exposed Methods

### `setValue()`
Sets a value in the Vuex store for a given input field.

**Parameters:**
- `value` (`string`): The value to set.
- `id` (`string`): The input field identifier.
