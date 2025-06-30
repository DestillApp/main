# ResultsDescriptions

## Exposed Methods

### `function()`
Sets a value in the Vuex store for a given input field.

```ts
const setValue = (value: string, id: string): void => {
      store.dispatch("results/setValue", { input: id, value });
    };
```
