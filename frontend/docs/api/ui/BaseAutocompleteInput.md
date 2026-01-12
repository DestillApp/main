# BaseAutocompleteInput

[View source on GitHub](https://github.com/DestillApp/destill-app-fullstack/blob/main/frontend/src/ui/BaseAutocompleteInput.vue)

A customizable autocomplete input component with optional dropdown, validation, and theming.
 *

## Props

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `label` | `string` | no | The label for the input field. |
| `modelValue` | `string & number` | no | The model value bound to the input field. |
| `id` | `string` | no | The id for the input field. |
| `disabled` | `boolean` | no | Flag to indicate if the input is disabled. |
| `placeholder` | `string` | no | The placeholder text for the input field. |
| `classType` | `string` | no | The class type for conditional styling. |
| `color` | `string` | no | The color context for styling (e.g., "plant", "distillation"). |
| `invalidInput` | `boolean` | no | Flag to indicate if the input is invalid. |
| `results` | `any[]` | no | List of results for the dropdown/autocomplete. |
| `toChoose` | `boolean` | no | If true, enables dropdown selection mode. |

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
