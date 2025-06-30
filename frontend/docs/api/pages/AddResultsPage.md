# AddResultsPage

## Exposed Methods

### `function()`
Helper function to set distillation details in Vuex state.

```ts
const setDistillationDetails = (details: GetDistillationById): void => {
      const distillationKeys = Object.keys(details).filter(
        (key) =>
          key !== "_id" &&
          key !== "__typename" &&
          key !== "choosedPlant" &&
          key !== "distillationTime"
      ) as (keyof GetDistillationById)[];

      for (const key of distillationKeys) {
        store.dispatch("results/setDistillationDataValue", {
          input: key,
          value: details[key],
        });
      }

      const timeKeys = Object.keys(details.distillationTime).filter(
        (key) => key !== "__typename"
      ) as (keyof DistillationTime)[];

      for (const key of timeKeys) {
        store.dispatch("results/setDistillationTime", {
          input: key,
          value: details.distillationTime[key],
        });
      }
    };
```

### `function()`
Helper function to set plant details in Vuex state.

```ts
const setPlantDetails = (details: NormalizedPlantById): void => {
      const keys = Object.keys(details).filter(
        (key) => key !== "_id" && key !== "__typename"
      ) as (keyof NormalizedPlantById)[];

      for (const key of keys) {
        store.dispatch("results/setPlantDataValue", {
          input: key,
          value: details[key],
        });
      }
    };
```

### `async()`
Fetches the plant details by plant ID from GraphQL API.

```ts
const fetchPlantDetails = async (plantId: string): Promise<void> => {
      try {
        const { data } = await apolloClient.query({
          query: GET_PLANT_BY_ID,
          variables: { id: plantId, formatDates: true },
        });
        const plantDetails = normalizeSelectedFields(
          data.getPlantById,
          fieldsToNormalize
        );
        setPlantDetails(plantDetails);
      } catch (error: any) {
        await handleUserError(error);
      }
    };
```

### `async()`
Fetches the distillation details by distillation ID from GraphQL API.

```ts
const fetchDistillationDetails = async (): Promise<void> => {
      try {
        const { data } = await apolloClient.query({
          query: GET_DISTILLATION_BY_ID,
          variables: { id: distillationId.value, formatDates: true },
        });
        const distillationDetails = data.getDistillationById;
        setDistillationDetails(distillationDetails);
        await fetchPlantDetails(distillationDetails.choosedPlant.id);
      } catch (error: any) {
        await handleUserError(error);
      }
    };
```

### `async()`
Handles the submission of the results form, validates, and sends data to the backend.

```ts
const submitResultsForm = async (): Promise<void> => {
      wasSubmitted.value = true;
      isFormValid.value = resultsFormValidation(resultsForm.value);
      if (isFormValid.value) {
        try {
          const resultsFormData = mapResultsForm(resultsForm.value);
          await createDistillationArchive({
            input: resultsFormData,
          });
        } catch (error: any) {
          await handleUserError(error);
          wasSubmitted.value = false;
          throw error;
        }
      } else {
        return;
      }
    };
```

### `async()`
Deletes the distillation from the database by its ID.

```ts
const removeDistillation = async (): Promise<void> => {
      try {
        await apolloClient.mutate({
          mutation: DELETE_DISTILLATION,
          variables: { id: distillationId.value },
        });
      } catch (error: any) {
        await handleUserError(error);
        throw error;
      }
    };
```

### `async()`
Saves the results and navigates to the distillation archives page.

```ts
const saveResults = async (): Promise<void> => {
      try {
        await submitResultsForm();
        if (!isFormValid.value) {
          return;
        } else {
          await removeDistillation();
          router.push({
            name: "DistillationArchivesPage",
            params: { page: 1 },
          });
        }
      } catch (error) {
        Sentry.captureException(error);
        console.error("Error in saveResults:", error);
      }
    };
```
