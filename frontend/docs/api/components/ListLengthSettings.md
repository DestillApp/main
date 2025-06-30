# ListLengthSettings

## Exposed Methods

### `function()`
Toggles the visibility of the list dropdown and manages click outside event.

```ts
const toggleList = (): void => {
      isListVisible.value = !isListVisible.value;
      if (isListVisible.value) {
        document.addEventListener("click", handleClickOutside);
      } else {
        document.removeEventListener("click", handleClickOutside);
      }
    };
```

### `function()`
Emits the selected list length and closes the dropdown.

```ts
const selectLength = (length: number): void => {
      emitTyped("select-length", length);
      isListVisible.value = false;
    };
```

### `function()`
Handles clicks outside the dropdown to close it.

```ts
const handleClickOutside = (event: MouseEvent): void => {
      if (
        settingsContainer.value &&
        !settingsContainer.value.contains(event.target as Node)
      ) {
        isListVisible.value = false;
      }
    };
```
