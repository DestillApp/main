# DeleteItemModal

## Exposed Methods

### `function()`
Emits the delete-item event to confirm deletion.

```ts
const deleteItem = (): void => {
      emit("delete-item");
    };
```

### `function()`
Emits the close-delete-modal event to close the modal without deletion.

```ts
const closeDeleteModal = (): void => {
      emit("close-delete-modal");
    };
```
