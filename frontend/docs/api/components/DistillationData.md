# DistillationData

## Exposed Methods

### `param()`
Handles keyboard events for integer-only input and prevents minus sign.

```ts
const handleKeyboard = (e: KeyboardEvent) => {
      setKeyboardIntegerNumber(e);
      preventMinusNumber(e);
    };
```

### `param()`
Saves the distillation time (hours or minutes) to the store.

```ts
const saveTime = (value: string | number, key: string): void => {
      const numericValue = typeof value === "string" ? Number(value) : value;
      const isValid = !isNaN(numericValue) && numericValue >= 0;
      const module = storeName.value;

      store.dispatch(`${module}/setDistillationTime`, {
        [module === "distillation" ? "key" : "input"]: key,
        value: isValid ? numericValue : null,
      });
    };
```
