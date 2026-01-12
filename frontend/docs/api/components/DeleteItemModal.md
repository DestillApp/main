# DeleteItemModal

[View source on GitHub](https://github.com/DestillApp/destill-app-fullstack/blob/main/frontend/src/components/plant/DeleteItemModal.vue)

A confirmation modal for deleting a plant from the inventory, a distillation record, or a distiller.
 *

## Props

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `plantName` | `string` | no | The name of the plant to be deleted. |
| `plantPart` | `string` | no | The part of the plant to be deleted. |
| `distillationDate` | `string` | no | The date of the distillation to be deleted. |
| `distiller` | `string` | no | The distiller to be deleted. |

## Emits

- `close-delete-modal`
- `delete-item`

## Exposed Methods

### `deleteItem()`
Emits the delete-item event to confirm deletion.

### `closeDeleteModal()`
Emits the close-delete-modal event to close the modal without deletion.
