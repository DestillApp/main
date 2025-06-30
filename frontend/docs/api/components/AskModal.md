# AskModal

## Exposed Methods

### `function()`
Emits the handle-yes event to confirm plant restoration.

```ts
const handleYes = () => {
      emit("handle-yes");
    };
```

### `function()`
Emits the close-modal event to close the modal without restoration.

```ts
const closeModal = () => {
      emit("close-modal");
    };
```
