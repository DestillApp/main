# InProgressDistillationsPage

## Exposed Methods

### `async()`
Fetch the list of distillations from the GraphQL server.

```ts
const fetchDistillationList = async (
      name: string,
      sorting: string
    ): Promise<void> => {
      try {
        isLoading.value = true;
        const { data } = await apolloClient.query({
          query: GET_DISTILLATIONS,
          fetchPolicy: "network-only",
          variables: {
            fields: [
              "choosedPlant.id",
              "choosedPlant.name",
              "choosedPlant.part",
              "weightForDistillation",
              "distillationType",
              "distillationDate",
              "_id",
            ],
            name: name,
            sorting: sorting,
            page: page.value,
            limit: distillationsPerPage.value,
          },
        });
        distillationsAmount.value = data.getDistillations.length;

        const start = (page.value - 1) * distillationsPerPage.value;
        const end = page.value * distillationsPerPage.value;

        distillationsList.value = data.getDistillations.slice(start, end);
      } catch (error: any) {
        await handleUserError(error);
        distillationsAmount.value = null;
        distillationsList.value = [];
      } finally {
        isLoading.value = false;
      }
    };
```

### `function()`
Handle the search query emitted from the BaseSearchItem component.

```ts
const handleSearch = async (): Promise<void> => {
      await fetchDistillationList(searchQuery.value, sorting.value);
    };
```

### `function()`
Handle the selection of list length.

```ts
const handleSelectLength = async (
      length: number
    ): Promise<void | undefined> => {
      const isUpdating = await updateListSettings(
        apolloClient,
        "distillationListLength",
        length
      );
      if (isUpdating === "Unauthorized") {
        await store.dispatch("auth/logout");
        router.push("/login");
        return;
      }
      if (isUpdating === true) {
        store.dispatch("settings/setValue", {
          input: "distillationListLength",
          value: length,
        });
        page.value = 1;
      }
    };
```

### `function()`
Update the sorting option and fetch the distillation list.

```ts
const updateSorting = async (
      sortingKey: string,
      sortingValue: string
    ): Promise<void | undefined> => {
      const update = await updateListSorting(
        apolloClient,
        "distillationListSorting",
        sortingKey
      );
      if (update === "Unauthorized") {
        await store.dispatch("auth/logout");
        router.push("/login");
        return;
      } else {
        store.dispatch("settings/setValue", {
          input: "distillationListSorting",
          value: sortingKey,
        });
        await fetchDistillationList(searchQuery.value, sortingValue);
      }
    };
```

### `function()`
Handle the sorting of the items list.

```ts
const handleSorting = async (option: string): Promise<void> => {
      const sortingKey = Object.keys(options).find(
        (key) => options[key] === option
      );
      if (sortingKey) {
        await updateSorting(sortingKey, sortingKey);
        page.value = 1;
      }
    };
```

### `function()`
Open the delete modal for a specific distillation.

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
Close the delete modal.

```ts
const closeDeleteModal = (): void => {
      distillationDate.value = "";
      isModalOpen.value = false;
    };
```

### `function()`
Remove the deleted distillation from the list.

```ts
const deleteDistillationFromList = (id: string): void => {
      distillationsList.value = distillationsList.value.filter(
        (plant) => plant._id !== id
      );
    };
```

### `async()`
Delete the selected distillation from the list.

```ts
const deleteDistillation = async (): Promise<void> => {
      try {
        const { data } = await apolloClient.mutate({
          mutation: DELETE_DISTILLATION,
          variables: { id: selectedDistillationId.value },
        });
        if (data.deleteDistillation) {
          openAskModal();
          deleteDistillationFromList(selectedDistillationId.value);
          if (page.value > 1 && !distillationsList.value.length) {
            page.value = page.value - 1;
            router.push({
              name: "InProgressDistillationsPage",
              params: { page: page.value },
            });
          } else {
            await fetchDistillationList(searchQuery.value, sorting.value);
          }
        }
        closeDeleteModal();
      } catch (error: any) {
        await handleUserError(error);
      }
    };
```

### `async()`
Add the distillation weight back to the plant's available weight.

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
