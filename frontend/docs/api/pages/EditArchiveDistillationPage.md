# EditArchiveDistillationPage

## Exposed Methods

### `async()`
Fetches the archive distillation details by ID from GraphQL API.

```ts
const fetchDistillationDetails = async (): Promise<void> => {
      try {
        isLoading.value = true;
        const { data } = await apolloClient.query({
          query: GET_ARCHIVE_DISTILLATION_BY_ID,
          variables: { id: archiveId.value, formatDistillDate: false },
        });
        const archive = data.getArchiveDistillationById;

        distillationDetails.value = {
          ...archive,
          distilledPlant: normalizeSelectedFields(
            archive.distilledPlant,
            fieldsToNormalize
          ),
        };
      } catch (error: any) {
        await handleUserError(error);
        distillationDetails.value = null;
      } finally {
        // Once the process is complete, set loading to false
        isLoading.value = false;
      }
    };
```

### `async()`
Handles the submission of the edit archive distillation form, validates, and sends data to the backend.

```ts
const editDistillationArchiveForm = async (): Promise<void> => {
      wasSubmitted.value = true;
      isFormValid.value = editArchiveDistillationFormValidation(
        distillationForm.value
      );
      if (isFormValid.value) {
        try {
          const distillationArchiveFormData = mapResultsForm(
            distillationForm.value
          );
          await updateDistillationArchive({
            id: archiveId.value,
            input: distillationArchiveFormData,
          });
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
Edits the distillation archive and navigates to the distillation archives page.

```ts
const editDistillationArchive = async (): Promise<void> => {
      try {
        await editDistillationArchiveForm();
        if (!isFormValid.value) {
          return;
        } else {
          router.push({
            name: "DistillationArchivesPage",
            params: { page: 1 },
          });
        }
      } catch (error) {
        Sentry.captureException(error);
        console.error("Error editing distillation archive:", error);
      }
    };
```
