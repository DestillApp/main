# DistillationDetailsPage

## Exposed Methods

### `async()`
Fetches the distillation details by ID from GraphQL API.

```ts
const fetchDistillationDetails = async (): Promise<void> => {
      try {
        isLoading.value = true;
        const { data } = await apolloClient.query({
          query: GET_DISTILLATION_BY_ID,
          fetchPolicy: "network-only",
          variables: { id: distillationId.value, formatDates: true },
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

### `function()`
Toggles the plant details section open/close.

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
      plantId: string,
      name: string,
      part: string,
      dWeight: number,
      date: string
    ): void => {
      selectedDistillationId.value = id;
      selectedPlantId.value = plantId;
      plantName.value = name;
      plantPart.value = part;
      distillationWeight.value = dWeight;
      distillationDate.value = date;
      isModalOpen.value = true;
    };
```

### `function()`
Closes the delete modal.

```ts
const closeDeleteModal = (): void => {
      distillationDate.value = "";
      isModalOpen.value = false;
    };
```

### `function()`
Opens the ask modal.

```ts
const openAskModal = (): void => {
      isAskModalOpen.value = true;
    };
```

### `function()`
Closes the ask modal and resets related state.

```ts
const closeAskModal = () => {
      isAskModalOpen.value = false;
      selectedDistillationId.value = null;
      selectedPlantId.value = null;
      distillationWeight.value = null;
      plantName.value = "";
      plantPart.value = "";
      router.push({
        name: "InProgressDistillationsPage",
        params: { page: 1 },
      });
    };
```

### `async()`
Deletes the selected distillation.

```ts
const deleteDistillation = async (): Promise<void> => {
      try {
        const { data } = await apolloClient.mutate({
          mutation: DELETE_DISTILLATION,
          variables: { id: selectedDistillationId.value },
        });
        if (data.deleteDistillation) {
          openAskModal();
        }
        closeDeleteModal();
      } catch (error) {
        Sentry.captureException(error);
        console.error("Failed to delete distillation:", error);
      }
    };
```

### `async()`
Adds the distillation weight back to the plant's available weight.

```ts
const addPlantWeight = async (): Promise<void> => {
      try {
        await apolloClient.mutate({
          mutation: CHANGE_AVAILABLE_WEIGHT,
          variables: {
            input: {
              id: selectedPlantId.value,
              availableWeight: distillationWeight.value,
            },
          },
        });
      } catch (error: any) {
        await handleUserError(error);
      }
    };
```

### `async()`
Handles confirmation of adding plant weight back after deletion.

```ts
const handleYes = async (): Promise<void> => {
      await addPlantWeight();
      closeAskModal();
    };
```
