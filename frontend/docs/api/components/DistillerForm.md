# DistillerForm

## Exposed Methods

### `function()`
Sets the integer value for the capacity input.

```ts
const setInteger = (value: string): void => {
      if (!value) {
        capacity.value = null;
        return;
      } else {
        const integerNumber = parseInt(value);
        capacity.value = integerNumber;
      }
    };
```

### `async()`
Handles form submission, validates input, and dispatches actions to add a distiller.

```ts
const addDistiller = async (): Promise<void> => {
      const distiller: { material: string; capacity: number; heating: string } =
        {
          material: material.value,
          capacity: capacity.value ? capacity.value : 0,
          heating: heating.value,
        };

      isFormValid.value = distillerFormValidation(distiller);
      if (isFormValid.value) {
        try {
          const addDistillerResult = await store.dispatch(
            "settings/addDistiller",
            distiller
          );
          if (addDistillerResult === "Unauthorized") {
            await store.dispatch("auth/logout");
            router.push("/login");
            return;
          }

          const fetchSettingsResult = await store.dispatch(
            "settings/fetchSettings"
          );
          if (fetchSettingsResult === "Unauthorized") {
            await store.dispatch("auth/logout");
            router.push("/login");
            return;
          }
          closeModal();
        } catch (error) {
          Sentry.captureException(error);
          console.error("Failed to add distiller:", error);
        }
      } else {
        console.error("Form is invalid");
      }
    };
```

### `function()`
Emits the close-modal event to close the modal.

```ts
const closeModal = (): void => {
      emit("close-modal");
    };
```
