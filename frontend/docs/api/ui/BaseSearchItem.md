# BaseSearchItem

## Exposed Methods

### `function()`
Handles input changes and resets search state if needed.

```ts
const changeSearchQuery = (): void => {
      if (isSearchEmitted.value) {
        isSearchEmitted.value = false;
      }
      if (inputValue.value === "") {
        clearSearchQuery();
      }
    };
```

### `function()`
Emits the search event and updates the store with the current input value.

```ts
const emitSearchQuery = (): void => {
      if (inputValue.value) {
        store.dispatch("updateSearchQuery", inputValue.value);
        emit("search");
        isSearchEmitted.value = true;
      }
    };
```

### `function()`
Clears the search input and emits the clear event.

```ts
const clearSearchQuery = (): void => {
      inputValue.value = "";
      store.dispatch("updateSearchQuery", "");
      isSearchEmitted.value = false;
      emit("clear");
    };
```

### `function()`
Handles keyboard events for Enter (search) and Escape (clear).

```ts
const handleKeyPress = (event: KeyboardEvent): void => {
      if (event.key === "Enter" && !isSearchEmitted.value) {
        emitSearchQuery();
      }
      if (event.key === "Escape") {
        clearSearchQuery();
      }
    };
```
