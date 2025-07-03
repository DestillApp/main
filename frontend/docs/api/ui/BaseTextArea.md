# BaseTextArea

[View source on GitHub](https://github.com/DestillApp/main/blob/main/frontend/src/ui/BaseTextArea.vue)

A customizable text area component with support for validation, theming, and color context.
 *

## Props

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `label` | `string` | no | The label for the text area. |
| `modelValue` | `string` | no | The value bound to the text area. |
| `id` | `string` | no | The id for the text area. |
| `placeholder` | `string` | no | The placeholder text for the text area. |
| `invalidInput` | `boolean` | no | Flag to indicate if the input is invalid. |
| `inputColor` | `string` | no | The color context for the text area (e.g., "results"). |
| `storeName` | `string` | no | The name of the store for value updates. |

## Emits

- `update:modelValue`
- `change:modelValue`
- `set:keyboard`

## Exposed Methods

### `updateValue()`
Updates the model value when text area changes.

**Parameters:**
- `e` (`Event`): The input event.

### `setKeyboard()`
Emits keyboard events.

**Parameters:**
- `e` (`Event`): The keyboard event.

### `changeValue()`
Emits value change events when text area loses focus.

**Parameters:**
- `e` (`Event`): The blur event.
