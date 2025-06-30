# BaseDatePicker

## Exposed Methods

### `function()`
Emit the selected date to the parent component.

```ts
const sendDate = (): void => {
      emit("update:value", selectedDate.value);
    };
```
