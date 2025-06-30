# PlantDetailsPage

## Exposed Methods

### `async()`
Fetches the plant details by plant ID from GraphQL API.

```ts
const fetchPlantDetails = async (): Promise<void> => {
      try {
        isLoading.value = true;
        const { data } = await apolloClient.query({
          query: GET_PLANT_BY_ID,
          variables: { id: plantId.value, formatDates: true },
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
Opens the delete confirmation modal.

```ts
const openDeleteModal = (): void => {
      isModalOpen.value = true;
    };
```

### `function()`
Closes the delete confirmation modal.

```ts
const closeDeleteModal = (): void => {
      isModalOpen.value = false;
    };
```

### `async()`
Deletes the plant by ID and navigates back to the plant list.

```ts
const deletePlant = async (): Promise<void> => {
      try {
        const { data } = await apolloClient.mutate({
          mutation: DELETE_PLANT,
          variables: { id: plantId.value },
        });

        if (data.deletePlant) {
          await apolloClient.resetStore();
          router.push({ name: "PlantListPage", params: { page: 1 } });
        }
        closeDeleteModal();
      } catch (error: any) {
        await handleUserError(error);
      }
    };
```
