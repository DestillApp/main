# ListSorting

## Exposed Methods

### `function()`
Toggles the visibility of the sorting options dropdown.

```ts
const toggleList = (): void => {
      isOpen.value = !isOpen.value;
      if (isOpen.value) {
        document.addEventListener("click", handleClickOutside);
      } else {
        document.removeEventListener("click", handleClickOutside);
      }
    };
```

### `function()`
Selects a sorting option, emits the event, and closes the dropdown.

```ts
const selectOption = (option: string): void => {
      selectedOption.value = option;
      isOpen.value = false;
      emitTyped("choose:sorting", option);
    };
```

### `function()`
Handles clicks outside the dropdown to close it.

```ts
const handleClickOutside = (event: MouseEvent): void => {
      if (
        sortingContainer.value &&
        !sortingContainer.value.contains(event.target as Node)
      ) {
        isOpen.value = false;
      }
    };
```
