# AddPlantPage

## Exposed Methods

### `async()`
Handles the submission of the plant form, validates, and sends data to the backend.

```ts
const submitPlantForm = async (): Promise<void> => {
      wasSubmitted.value = true;
      isFormValid.value = plantFormValidation(plantForm.value);

      if (isFormValid.value) {
        try {
          const plantFormData = mapPlantForm(plantForm.value);
          const result = await createPlant({
            input: plantFormData,
          });
          if (result?.data) {
            plantId.value = result.data.createPlant._id;
          }
        } catch (error: any) {
          await handleUserError(error);
          wasSubmitted.value = false;
        }
      } else {
        return;
      }
    };
```

### `async()`
Saves the plant and navigates to the plant list page.

```ts
const savePlant = async (): Promise<void> => {
      try {
        await submitPlantForm();
        if (!isFormValid.value) {
          return;
        } else {
          router.push({ name: "PlantListPage", params: { page: 1 } });
        }
      } catch (error) {
        Sentry.captureException(error);
        return;
      }
    };
```

### `async()`
Saves the plant and navigates to the add distillation page.

```ts
const savePlantAndDistill = async (): Promise<void> => {
      try {
        await submitPlantForm();
        if (!isFormValid.value) {
          return;
        } else {
          router.push({
            name: "AddDistillationPage",
            params: {
              id: plantId.value,
            },
          });
        }
      } catch (error) {
        Sentry.captureException(error);
        return;
      }
    };
```
