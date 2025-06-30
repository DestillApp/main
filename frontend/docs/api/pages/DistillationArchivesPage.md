# DistillationArchivesPage

## Exposed Methods

### `async()`
Fetch the list of distillation archives from the GraphQL server.

```ts
const fetchDistillationArchivesList = async (
      name: string,
      sortingValue: string
    ): Promise<void> => {
      try {
        isLoading.value = true;
        const { data } = await apolloClient.query({
          query: GET_DISTILLATION_ARCHIVES,
          fetchPolicy: "network-only",
          variables: {
            fields: [
              "_id",
              "oilAmount",
              "hydrosolAmount",
              "distillationData.distillationType",
              "distillationData.distillationDate",
              "distilledPlant.plantName",
              "distilledPlant.plantPart",
            ],
            name: name,
            sorting: sorting.value,
            formatDates: true,
            page: page.value,
            limit: archivesPerPage.value,
          },
        });
        archivesAmount.value = data.getDistillationArchives.length;

        const start = (page.value - 1) * archivesPerPage.value;
        const end = page.value * archivesPerPage.value;

        distillationArchivesList.value = data.getDistillationArchives.slice(
          start,
          end
        );
      } catch (error: any) {
        await handleUserError(error);
        archivesAmount.value = null;
        distillationArchivesList.value = [];
      } finally {
        isLoading.value = false;
      }
    };
```

### `function()`
Handle the search query emitted from the BaseSearchItem component.

```ts
const handleSearch = async (): Promise<void> => {
      await fetchDistillationArchivesList(searchQuery.value, sorting.value);
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
        "distillationArchivesListLength",
        length
      );
      if (isUpdating === "Unauthorized") {
        await store.dispatch("auth/logout");
        router.push("/login");
        return;
      }
      if (isUpdating === true) {
        store.dispatch("settings/setValue", {
          input: "distillationArchivesListLength",
          value: length,
        });
        page.value = 1;
      }
    };
```

### `function()`
Update the sorting option and fetch the distillation archives list.

```ts
const updateSorting = async (
      sortingKey: string,
      sortingValue: string
    ): Promise<void | undefined> => {
      const update = await updateListSorting(
        apolloClient,
        "archiveDistillationListSorting",
        sortingKey
      );
      if (update === "Unauthorized") {
        await store.dispatch("auth/logout");
        router.push("/login");
        return;
      } else {
        store.dispatch("settings/setValue", {
          input: "archiveDistillationListSorting",
          value: sortingKey,
        });
        await fetchDistillationArchivesList(searchQuery.value, sortingValue);
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
Open the delete modal for a specific distillation archive.

```ts
const openDeleteModal = (
      id: string,
      plantId: string,
      name: string,
      part: string,
      dWeight: number,
      date: string
    ): void => {
      selectedArchiveId.value = id;
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
Remove the deleted archive from the list.

```ts
const deleteDistillationFromList = (id: string): void => {
      distillationArchivesList.value = distillationArchivesList.value.filter(
        (archive) => archive._id !== id
      );
    };
```

### `async()`
Delete the selected distillation archive from the list.

```ts
const deleteDistillationArchive = async (): Promise<void> => {
      try {
        const { data } = await apolloClient.mutate({
          mutation: DELETE_DISTILLATION_ARCHIVE,
          variables: { id: selectedArchiveId.value },
        });
        if (data.deleteDistillationArchive) {
          deleteDistillationFromList(selectedArchiveId.value);
          if (page.value > 1 && !distillationArchivesList.value.length) {
            page.value = page.value - 1;
            router.push({
              name: "DistillationArchivesPage",
              params: { page: page.value },
            });
          } else {
            await fetchDistillationArchivesList(
              searchQuery.value,
              sorting.value
            );
          }
        }
        closeDeleteModal();
      } catch (error: any) {
        await handleUserError(error);
      }
    };
```
