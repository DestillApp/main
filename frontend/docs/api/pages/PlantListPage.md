# PlantListPage

## Exposed Methods

### `async()`
Fetch the list of plants from the GraphQL server.

```ts
const fetchPlantList = async (
      name: string,
      sorting: string
    ): Promise<void> => {
      try {
        isLoading.value = true;
        const { data } = await apolloClient.query({
          query: GET_PLANTS,
          fetchPolicy: "network-only",
          variables: {
            fields: [
              "plantName",
              "plantPart",
              "availableWeight",
              "harvestDate",
              "plantBuyDate",
              "_id",
            ],
            formatDates: true,
            name: name,
            sorting: sorting,
          },
        });
        plantsAmount.value = data.getPlants.length;

        const start = (page.value - 1) * plantsPerPage.value;
        const end = page.value * plantsPerPage.value;

        plantList.value = data.getPlants.slice(start, end);
      } catch (error: any) {
        await handleUserError(error);
        plantsAmount.value = null;
        plantList.value = [];
      } finally {
        isLoading.value = false;
      }
    };
```

### `function()`
Handle the search query emitted from the BaseSearchItem component.

```ts
const handleSearch = async (): Promise<void> => {
      await fetchPlantList(searchQuery.value, sorting.value);
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
        "plantListLength",
        length
      );
      if (isUpdating === "Unauthorized") {
        await store.dispatch("auth/logout");
        router.push("/login");
        return;
      }
      if (isUpdating === true) {
        store.dispatch("settings/setValue", {
          input: "plantListLength",
          value: length,
        });
        page.value = 1;
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
Update the sorting option and fetch the plant list.

```ts
const updateSorting = async (
      sortingKey: string,
      sortingValue: string
    ): Promise<void | undefined> => {
      const update = await updateListSorting(
        apolloClient,
        "plantListSorting",
        sortingKey
      );
      if (update === "Unauthorized") {
        await store.dispatch("auth/logout");
        router.push("/login");
        return;
      } else {
        store.dispatch("settings/setValue", {
          input: "plantListSorting",
          value: sortingKey,
        });
        await fetchPlantList(searchQuery.value, sortingValue);
      }
    };
```

### `function()`
Open the delete modal for a specific plant.

```ts
const openDeleteModal = (id: string, name: string, part: string): void => {
      selectedPlantId.value = id;
      plantName.value = name;
      plantPart.value = part;
      isModalOpen.value = true;
    };
```

### `function()`
Close the delete modal.

```ts
const closeDeleteModal = (): void => {
      selectedPlantId.value = "";
      plantName.value = "";
      plantPart.value = "";
      isModalOpen.value = false;
    };
```

### `async()`
Delete the selected plant from the list.

```ts
const deletePlant = async (): Promise<void> => {
      try {
        const { data } = await apolloClient.mutate({
          mutation: DELETE_PLANT,
          variables: { id: selectedPlantId.value },
        });
        if (data.deletePlant) {
          deletePlantFromList(selectedPlantId.value);
          if (page.value > 1 && !plantList.value.length) {
            page.value = page.value - 1;
            router.push({
              name: "PlantListPage",
              params: { page: page.value },
            });
          } else {
            await fetchPlantList(searchQuery.value, sorting.value);
          }
        }
        closeDeleteModal();
      } catch (error: any) {
        await handleUserError(error);
      }
    };
```

### `function()`
Remove the deleted plant from the plant list.

```ts
const deletePlantFromList = (id: string): void => {
      plantList.value = plantList.value.filter((plant) => plant._id !== id);
    };
```
