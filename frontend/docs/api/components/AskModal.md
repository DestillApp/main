# AskModal

[View source on GitHub](https://github.com/DestillApp/destill-app-fullstack/blob/main/frontend/src/components/AskModal.vue)

A confirmation modal for restoring a plant and its weight to the inventory.
 *

## Props

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `plantName` | `string` | yes | The name of the plant to be restored. |
| `plantPart` | `string` | yes | The part of the plant to be restored. |
| `distillationWeight` | `number` | yes | The weight of the plant to be restored. |

## Emits

- `close-modal`
- `handle-yes`

## Exposed Methods

### `handleYes()`
Emits the handle-yes event to confirm plant restoration.

### `closeModal()`
Emits the close-modal event to close the modal without restoration.
