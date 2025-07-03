# BaseTextInput

[View source on GitHub](https://github.com/DestillApp/main/blob/main/frontend/src/ui/BaseTextInput.vue)

A customizable text input component with support for validation, theming, and color context.
 *

## Props

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `label` | `string` | no | The label for the input field. |
| `modelValue` | `string & number` | no | The value bound to the input field. |
| `id` | `string` | no | The id for the input field. |
| `disabled` | `boolean` | no | Flag to indicate if the input is disabled. |
| `placeholder` | `string` | no | The placeholder text for the input field. |
| `classType` | `string` | no | The class type for conditional styling (e.g., "number", "time", "results"). |
| `inputColor` | `string` | no | The color context for the input (e.g., "plant", "distillation", "results"). |
| `invalidInput` | `boolean` | no | Flag to indicate if the input is invalid. |
| `storeName` | `string` | no | The name of the store for value updates. |

## Emits

- `update:modelValue`
- `change:modelValue`
- `set:keyboard`

## Exposed Methods

### `updateValue()`
Updates the model value when input changes.

**Parameters:**
- `e` (`Event`): The input event.

### `setKeyboard()`
Emits keyboard events.

**Parameters:**
- `e` (`Event`): The keyboard event.

### `changeValue()`
Emits value change events when input loses focus.

**Parameters:**
- `e` (`Event`): The blur event.
