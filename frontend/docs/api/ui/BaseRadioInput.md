# BaseRadioInput

A radio group component that allows selecting one option from a list of options.
 *

## Props

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `options` | `string[]` | yes | The list of options to display as radio buttons. |
| `modelValue` | `string` | yes | The currently selected value. |
| `title` | `string` | yes | The label/title for the radio group. |
| `name` | `string` | no | The name attribute for the radio group. |
| `color` | `string` | no | The color for the radio buttons. |

## Emits

- `update:modelValue`
- `selectOption`
