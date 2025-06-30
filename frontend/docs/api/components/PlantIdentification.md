# PlantIdentification

## Exposed Methods

### `function()`
Dispatches an action to the Vuex store to set a specific value.

```ts
const setValue = (currentValue: string, input: string): void => {
      store.dispatch("plant/setValue", { input, value: currentValue });
    };
```
