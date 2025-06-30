# AddDistillationPage

## Exposed Methods

### `async()`
Handles the submission of the distillation form, validates, and sends data to the backend.

```ts
const submitDistillationForm = async (): Promise<void> => {
      wasSubmitted.value = true;
      isFormValid.value = distillationFormValidation(distillationForm.value);
      if (isFormValid.value) {
        try {
          const distillationFormData = mapDistillationForm(
            distillationForm.value
          );
          const result = await createDistillation({
            input: distillationFormData,
          });
          if (result?.data) {
            distillId.value = result.data.createDistillation._id;
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
Updates the available weight for the selected plant after distillation.

```ts
const changeAvailableWeight = async (): Promise<void> => {
      try {
        const availableWeight =
          distillationForm.value.choosedPlant.availableWeight ?? 0;
        const weightForDistillation =
          distillationForm.value.weightForDistillation ?? 0;
        let newWeight = availableWeight - weightForDistillation;
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
Saves the distillation, updates available weight, and navigates to the in-progress distillations page.

```ts
const saveDistillation = async (): Promise<void> => {
      try {
        await submitDistillationForm();
        if (!isFormValid.value) {
          return;
        } else {
          await changeAvailableWeight();
          router.push({
            name: "InProgressDistillationsPage",
            params: { page: 1 },
          });
        }
      } catch (error) {
        Sentry.captureException(error);
        return;
      }
    };
```

### `async()`
Saves the distillation, updates available weight, and navigates to the add results page.

```ts
const saveDistillationAddResults = async (): Promise<void> => {
      try {
        await submitDistillationForm();
        if (!isFormValid.value) {
          return;
        } else {
          await changeAvailableWeight();
          router.push({
            name: "AddResultsPage",
            params: { distillId: distillId.value },
          });
        }
      } catch (error) {
        Sentry.captureException(error);
        return;
      }
    };
```
