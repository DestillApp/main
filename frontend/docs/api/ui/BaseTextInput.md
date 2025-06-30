# BaseTextInput

A customizable text input component with support for validation, theming, and color context.
 *

## Props

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `label` | `string` | no |  |
| `modelValue` | `string | number` | no |  |
| `id` | `string` | no |  |
| `disabled` | `boolean` | no |  |
| `placeholder` | `string` | no |  |
| `classType` | `string` | no |  |
| `inputColor` | `string` | no |  |
| `invalidInput` | `boolean` | no |  |
| `storeName` | `string` | no |  |

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
