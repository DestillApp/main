# AskModal

A confirmation modal for restoring a plant and its weight to the inventory.
 *

## Props

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `plantName` | `string` | yes |  |
| `plantPart` | `string` | yes |  |
| `distillationWeight` | `number` | yes |  |

## Emits

- `close-modal`
- `handle-yes`

## Exposed Methods

### `handleYes()`
Emits the handle-yes event to confirm plant restoration.

### `closeModal()`
Emits the close-modal event to close the modal without restoration.
