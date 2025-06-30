# ResultsPlant

## Exposed Methods

### `function()`
Fetches plant data from local storage for a given key.

```ts
const fetchPlantData = (key: string): void => {
      store.dispatch("results/fetchDistilledPlantFromLocalStorage", key);
    };
```

### `function()`
Fetches distillation data from local storage for a given key.

```ts
const fetchDistillationData = (key: string): void => {
      store.dispatch("results/fetchDistillationDataFromLocalStorage", key);
    };
```
