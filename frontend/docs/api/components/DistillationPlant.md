# DistillationPlant

## Exposed Methods

### `returns()`
Gets plant data by ID from the GraphQL server.

```ts
const getPlantData = async (): Promise<BasicPlant | undefined> => {
      try {
        const { data } = await apolloClient.query({
          query: GET_BASIC_PLANT_BY_ID,
          variables: { id: route.params.id, formatDates: false },
        });

        return data.getPlantById;
      } catch (error) {
        Sentry.captureException(error);
        console.error("Failed to get plant details:", error);
      }
    };
```

### `param()`
Fetches initial data from local storage via the Vuex store for a specified key.

```ts
const fetchData = (key: string, value: boolean): void => {
      store.dispatch("distillation/fetchLocalStorageData", {
        key: key,
        isPlant: value,
      });
    };
```

### `param()`
Updates the selected plant's state in Vuex by dispatching key-value pairs.

```ts
const setPlantState = (
      key: keyof FormChoosedPlant,
      value: string | number | null
    ): void => {
      store.dispatch("distillation/setChoosedPlant", {
        key: key,
        value: value,
      });
    };
```

### `param()`
Sets the selected plant details in the form, including plant ID, name, part, and weight.
Clears the search input and list of plants after selection.

```ts
const setPlant = (value: BasicPlant): void => {
      plantFields.forEach(({ key, valueKey }) => {
        setPlantState(key, value[valueKey] ?? null);
      });
      searchQuery.value = "";
      plant.value = value.plantName;
      plants.value = [];

      const targetRoute = props.isEditing
        ? "EditDistillationPage"
        : "AddDistillationPage";
      router.replace({ name: targetRoute, params: { id: value._id } });
    };
```

### `async()`
Fetch the list of plants from the GraphQL server by matching name.

```ts
const fetchPlants = async (name: string): Promise<void> => {
      try {
        const { data } = await apolloClient.query({
          query: GET_PLANTS,
          fetchPolicy: "network-only",
          variables: {
            fields: plantFields.map(({ valueKey }) => valueKey),
            formatDates: true,
            name: name,
          },
        });
        plants.value = data.getPlants;
      } catch (error: any) {
        await handleUserError(error);
        plants.value = [];
      }
    };
```

### `param()`
Handles the input event for the search or autocomplete component.
Updates the search query and manages the timer to limit the frequency of fetch requests.

```ts
const onInput = (value: string, input: string): void => {
      if (input === "choosedPlant") {
        plantFields.forEach(({ key }) => {
          key === "id" || key === "availableWeight"
            ? setPlantState(key, null)
            : setPlantState(key, "");
        });
      }

      const routeName = props.isEditing
        ? "EditDistillationPage"
        : "AddDistillationPage";
      router.replace({ name: routeName, params: { id: null } });

      searchQuery.value = value;
      plant.value = searchQuery.value;
      if (timeout.value) {
        clearTimeout(timeout.value);
      }

      timeout.value = setTimeout(() => {
        if (searchQuery.value !== "") {
          fetchPlants(searchQuery.value);
        } else {
          plants.value = [];
        }
      }, 500);
    };
```

### `onBlur()`
Handles the blur event when the input field loses focus.
Clears the plant list and resets the input value if no plant is selected.

```ts
const onBlur = () => {
      if (formData.value.choosedPlant.name === "") {
        plants.value = [];
        searchQuery.value = "";
        plant.value = "";
      }
    };
```
