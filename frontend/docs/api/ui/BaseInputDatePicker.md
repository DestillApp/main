# BaseInputDatePicker

## Exposed Methods

### `function()`
Toggles the visibility of the date picker modal.

```ts
const changeVisibility = (): void => {
      isOpen.value = !isOpen.value;
    };
```

### `function()`
Closes the date picker modal.

```ts
const closeModal = (): void => {
      isOpen.value = false;
    };
```

### `function()`
Updates the date value when a new date is selected.

```ts
const updateDate = (selectedDate: string): void => {
      date.value = selectedDate;
    };
```
