# ArchiveDistillationDetailsPage

## Exposed Methods

### `async()`
Fetches the archive distillation details by ID from GraphQL API.

```ts
const fetchDistillationDetails = async (): Promise<void> => {
      try {
        isLoading.value = true;
        const { data } = await apolloClient.query({
          query: GET_ARCHIVE_DISTILLATION_BY_ID,
          variables: { id: archiveId.value, formatDistillDate: true },
        });
        distillationDetails.value = data.getArchiveDistillationById;
      } catch (error: any) {
        await handleUserError(error);
        distillationDetails.value = null;
      } finally {
        isLoading.value = false;
      }
    };
```

### `function()`
Toggles the plant details open/close state.

```ts
const openClosePlant = (): void => {
      isPlantOpen.value = !isPlantOpen.value;
    };
```

### `function()`
Opens the delete modal for a specific distillation.

```ts
const openDeleteModal = (
      id: string,
      name: string,
      part: string,
      date: string
    ): void => {
      selectedDistillationId.value = id;
      plantName.value = name;
      plantPart.value = part;
      distillationDate.value = date;
      isModalOpen.value = true;
    };
```

### `function()`
Closes the delete modal.

```ts
const closeDeleteModal = (): void => {
      selectedDistillationId.value = null;
      plantName.value = "";
      plantPart.value = "";
      distillationDate.value = "";
      isModalOpen.value = false;
    };
```

### `async()`
Deletes the selected distillation archive and navigates to the archives page.

```ts
const deleteDistillation = async (): Promise<void> => {
      try {
        const { data } = await apolloClient.mutate({
          mutation: DELETE_DISTILLATION_ARCHIVE,
          variables: { id: selectedDistillationId.value },
        });
        closeDeleteModal();
        router.push({
          name: "DistillationArchivesPage",
          params: { page: page.value },
        });
      } catch (error: any) {
        await handleUserError(error);
      }
    };
```
