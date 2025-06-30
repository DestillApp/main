# BaseTextArea

A customizable text area component with support for validation, theming, and color context.
 *

## Props

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `label` | `string` | no |  |
| `modelValue` | `string` | no |  |
| `id` | `string` | no |  |
| `placeholder` | `string` | no |  |
| `invalidInput` | `boolean` | no |  |
| `inputColor` | `string` | no |  |
| `storeName` | `string` | no |  |

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
