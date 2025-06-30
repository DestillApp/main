# EditPlantPage

## Exposed Methods

### `async()`
Fetches the plant details by plant ID from GraphQL API.

```ts
const fetchPlantDetails = async (): Promise<void> => {
      try {
        isLoading.value = true;
        const { data } = await apolloClient.query({
          query: GET_PLANT_BY_ID,
          variables: { id: plantId.value, formatDates: false },
          fetchPolicy: "network-only",
        });
        plantDetails.value = normalizeSelectedFields(
          data.getPlantById,
          fieldsToNormalize
        );
      } catch (error: any) {
        await handleUserError(error);
        plantDetails.value = null;
      } finally {
        isLoading.value = false;
      }
    };
```

### `function()`
Dispatches Vuex action to set a specific plant form field value.

```ts
const setValue = (
      input: keyof NormalizedPlantById,
      value: string | null | number
    ): void => {
      store.dispatch("plant/setValue", { input: input, value: value });
    };
```

### `async()`
Handles the submission of the plant form, validates, and sends data to the backend.

```ts
const submitPlantForm = async (): Promise<void> => {
      isFormValid.value = plantFormValidation(plantForm.value);

      if (isFormValid.value) {
        try {
          const plantFormData = mapPlantForm(plantForm.value);
          await updatePlant({
            id: plantId.value,
            plantInput: plantFormData,
          });
        } catch (error: any) {
          await handleUserError(error);
        }
      } else {
        return;
      }
    };
```

### `async()`
Edits an existing plant and navigates back to the plant list.

```ts
const editPlant = async (): Promise<void> => {
      try {
        await submitPlantForm();
        if (!isFormValid.value) {
          return;
        } else {
          router.push({ name: "PlantListPage", params: { page: page.value } });
        }
      } catch (error) {
        Sentry.captureException(error);
        return;
      }
    };
```

### `async()`
Edits an existing plant and navigates to the add distillation page.

```ts
const editPlantAndDistill = async (): Promise<void> => {
      try {
        await submitPlantForm();
        if (!isFormValid.value) {
          return;
        } else {
          router.push({
            name: "AddDistillationPage",
            params: { id: plantId.value },
          });
        }
      } catch (error) {
        Sentry.captureException(error);
        return;
      }
    };
```
