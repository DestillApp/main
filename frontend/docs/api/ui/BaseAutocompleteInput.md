# BaseAutocompleteInput

A customizable autocomplete input component with optional dropdown, validation, and theming.
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
| `color` | `string` | no |  |
| `invalidInput` | `boolean` | no |  |
| `results` | `any[]` | no |  |
| `toChoose` | `boolean` | no |  |

## Emits

- `update:modelValue`
- `choose:item`
- `update:onBlur`
- `open:list`

## Exposed Methods

### `updateValue()`
Updates the model value when input changes.

**Parameters:**
- `e` (`Event`): The input event.

### `chooseItem()`
Updates the model value after clicking a list item.
Temporarily disables blur to prevent unintended triggers.

**Parameters:**
- `result` (`any`): The selected result/item.

### `handleBlur()`
Handles the blur event for the input field.
Emits the onBlur event if blur is not disabled.

### `openList()`
Opens or closes the dropdown list.
