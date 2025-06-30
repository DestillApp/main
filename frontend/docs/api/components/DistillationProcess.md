# DistillationProcess

## Exposed Methods

### `param()`
Fetches initial data from local storage via the Vuex store for a specified key.

```ts
const fetchData = (key: string, value: boolean): void => {
      store.dispatch("distillation/fetchLocalStorageData", {
        key: key,
        isPlant: value,
      });
    };
```

### `param()`
Fetches archive data from local storage via the Vuex store for a specified key.

```ts
const fetchArchiveData = (key: string): void => {
      store.dispatch("results/fetchDistillationDataFromLocalStorage", key);
    };
```

### `param()`
Updates the value of a specified input field in the Vuex store.

```ts
const setValue = (value: string, input: string): void => {
      if (props.isEditing) {
        store.dispatch("results/setDistillationDataValue", {
          input: input,
          value: value,
        });
      } else {
        store.dispatch("distillation/setValue", { input: input, value: value });
      }
    };
```

### `param()`
Handles setting the selected distillation type and updating the store.

```ts
const setDistillationType = (
      value: DistillationType,
      input: string
    ): void => {
      setValue(value, input);
      distillationType.value = value;
    };
```

### `param()`
Sets the selected distillation apparatus and updates the store.

```ts
const setDistillationApparatus = (value: string, input: string): void => {
      setValue(value, input);
      distillationApparatus.value = value;
    };
```
