# BaseDatePicker

[View source on GitHub](https://github.com/DestillApp/main/blob/main/frontend/src/ui/BaseDatePicker.vue)

A modal date picker component using Vuetify, supporting dark theme and color customization.
 *

## Props

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string` | no | The title displayed in the date picker. |
| `value` | `string` | no | The selected date value. |
| `color` | `string` | no | The color context for styling (e.g., "plant", "distillation"). |

## Emits

- `update:value`

## Exposed Methods

### `sendDate()`
Emit the selected date to the parent component.
