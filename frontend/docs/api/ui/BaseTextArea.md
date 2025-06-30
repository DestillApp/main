# BaseTextArea

## Exposed Methods

### `function()`
Updates the model value when text area changes.

```ts
const updateValue = (e: Event): void => {
      const target = e.target as HTMLTextAreaElement;
      emit("update:modelValue", target.value, props.id, props.storeName);
    };
```

### `function()`
Emits keyboard events.

```ts
const setKeyboard = (e: Event): void => {
      emit("set:keyboard", e);
    };
```

### `function()`
Emits value change events when text area loses focus.

```ts
const changeValue = (e: Event): void => {
      const target = e.target as HTMLTextAreaElement;
      emit("change:modelValue", target.value, props.id, props.storeName);
    };
```
