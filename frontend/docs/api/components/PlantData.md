# PlantData

## Exposed Methods

### `param()`
Handles keyboard events for integer-only input and prevents minus sign.

```ts
const handleKeyboard = (e: KeyboardEvent) => {
      setKeyboardIntegerNumber(e);
      preventMinusNumber(e);
    };
```
