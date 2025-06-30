# EditDistillationPage

## Exposed Methods

### `async()`
Fetches distillation details by ID from GraphQL API.

```ts
const fetchDistillationDetails = async (): Promise<void> => {
      try {
        isLoading.value = true;
        const { data } = await apolloClient.query({
          query: GET_DISTILLATION_BY_ID,
          variables: { id: distillationId.value, formatDates: false },
        });
        distillationDetails.value = data.getDistillationById;
      } catch (error: any) {
        await handleUserError(error);
        distillationDetails.value = null;
      } finally {
        isLoading.value = false;
      }
    };
```

### `async()`
Handles the submission of the distillation form for editing.

```ts
const editDistillationForm = async (): Promise<void> => {
      wasSubmitted.value = true;
      isFormValid.value = distillationFormValidation(distillationForm.value);
      if (isFormValid.value) {
        try {
          const distillationFormData = mapDistillationForm(
            distillationForm.value
          );
          await updateDistillation({
            id: distillationId.value,
            input: distillationFormData,
          });
        } catch (error: any) {
          await handleUserError(error);
          wasSubmitted.value = true;
        }
      } else {
        return;
      }
    };
```

### `async()`
Updates the available weight for the selected plant after editing distillation.

```ts
const changeAvailableWeight = async (): Promise<void> => {
      try {
        const availableWeight =
          distillationForm.value.choosedPlant.availableWeight ?? 0;
        const weightForDistillation =
          distillationForm.value.weightForDistillation ?? 0;
        const initialWeightForDistillation =
          distillationForm.value.initialWeightForDistillation ?? 0;

        let newWeight =
          availableWeight +
          initialWeightForDistillation -
          weightForDistillation;
        newWeight = parseFloat(newWeight.toFixed(1));

        await updateAvailableWeight({
          input: {
            id: route.params.id as string,
            availableWeight: newWeight,
          },
        });
      } catch (error: any) {
        await handleUserError(error);
      }
    };
```

### `async()`
Submits the edit form, updates available weight, and navigates to the in-progress distillations page.

```ts
const editDistillation = async (): Promise<void> => {
      try {
        await editDistillationForm();
        if (!isFormValid.value) {
          return;
        } else {
          await changeAvailableWeight();
          router.push({
            name: "InProgressDistillationsPage",
            params: { page: page.value },
          });
        }
      } catch (error) {
        Sentry.captureException(error);
        return;
      }
    };
```

### `async()`
Submits the edit form, updates available weight, and navigates to the add results page.

```ts
const editDistillationAddResults = async (): Promise<void> => {
      try {
        await editDistillationForm();
        if (!isFormValid.value) {
          return;
        } else {
          await changeAvailableWeight();
          router.push({ name: "AddResultsPage" });
        }
      } catch (error) {
        Sentry.captureException(error);
        return;
      }
    };
```
