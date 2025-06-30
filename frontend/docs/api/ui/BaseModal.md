# BaseModal

## Exposed Methods

### `function()`
Emits the close-modal event to notify parent to close the modal.

```ts
const closeModal = (): void => {
      emit("close-modal");
    };
```
