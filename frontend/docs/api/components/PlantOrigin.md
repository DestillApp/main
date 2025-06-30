# PlantOrigin

## Exposed Methods

### `function()`
Dispatches an action to the Vuex store to set a specific value.

```ts
const setValue = (currentValue: string, input: string): void => {
      store.dispatch("plant/setValue", { input, value: currentValue });
    };
```

### `function()`
Stores a date value in the Vuex store.

```ts
const storeDate = (date: string, input: string): void => {
      store.dispatch("plant/setValue", { input, value: date });
    };
```

### `function()`
Sets the selected country for the country autocomplete input.

```ts
const setCountry = (currentValue: string, input: string): void => {
      setValue(currentValue, input);
      searchQuery.value = "";
      countryName.value = currentValue;
      countryNames.value = [];
    };
```

### `async()`
Async function to fetch country names based on user input for the autocomplete component.

```ts
const fetchCountries = async (name: string): Promise<void> => {
      try {
        const { data } = await apolloClient.query({
          query: GET_COUNTRY_NAMES,
          variables: { name },
        });
        countryNames.value = data.getCountryNames.slice(0, 10);
      } catch (error) {
        Sentry.captureException(error);
        console.error("Failed to get country names:", error);
        countryNames.value = [];
      }
    };
```

### `function()`
Handles the input event for the search or autocomplete component.
Updates the search query and manages the timer to limit the frequency of fetch requests.

```ts
const onInput = (value: string, input: string): void => {
      setValue("", input);
      searchQuery.value = value;
      countryName.value = searchQuery.value;
      if (timeout.value) {
        clearTimeout(timeout.value);
      }

      timeout.value = setTimeout(() => {
        if (searchQuery.value.length > 0) {
          fetchCountries(searchQuery.value);
        } else {
          countryNames.value = [];
        }
      }, 500);
    };
```

### `function()`
Handles the blur event for the country input field.
When the input field loses focus, it checks whether the user has selected a country.
If no country is selected, it clears the country list and resets the search query and country name.

```ts
const onBlur = (): void => {
      if (formData.value.countryOfOrigin === "") {
        countryNames.value = [];
        searchQuery.value = "";
        countryName.value = "";
      }
    };
```
