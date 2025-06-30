# BaseTextInput

## Exposed Methods

### `function()`
Updates the model value when input changes.

```ts
const updateValue = (e: Event): void => {
      const target = e.target as HTMLInputElement;
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
Emits value change events when input loses focus.

```ts
const changeValue = (e: Event): void => {
      const target = e.target as HTMLInputElement;
      emit("change:modelValue", target.value, props.id, props.storeName);
    };
```
