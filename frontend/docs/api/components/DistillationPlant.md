# DistillationPlant

[View source on GitHub](https://github.com/DestillApp/main/blob/main/frontend/src/components/destillation/DistillationPlant.vue)

This component manages the selection of plant material for distillation, including details like plant part, weight, and optional soaking or shredding steps.
 * It also interacts with Vuex for data persistence and handles the fetching of plants from an Apollo GraphQL server.
 *

## Props

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `isFormValid` | `boolean` | yes | Indicates if the form is valid. |
| `wasSubmitted` | `boolean` | yes | Indicates if the form was submitted. |
| `isEditing` | `boolean` | no | Indicates if the form is in editing mode. |

## Exposed Methods

### `getPlantData()`
Gets plant data by ID from the GraphQL server.

### `fetchData()`
Fetches initial data from local storage via the Vuex store for a specified key.

**Parameters:**
- `key` (`string`): The key for the specific data to fetch.
- `value` (`boolean`): Indicates if the fetched data is related to plant information.

### `setPlantState()`
Updates the selected plant's state in Vuex by dispatching key-value pairs.

**Parameters:**
- `key` (`keyof FormChoosedPlant`): The key of the plant attribute.
- `value` (`string | number | null`): The value of the plant attribute.

### `setPlant()`
Sets the selected plant details in the form, including plant ID, name, part, and weight.
Clears the search input and list of plants after selection.

**Parameters:**
- `value` (`BasicPlant`): The selected plant object from the plant list.

### `fetchPlants()`
Fetch the list of plants from the GraphQL server by matching name.

**Parameters:**
- `name` (`string`): The plant name to search for.

### `onInput()`
Handles the input event for the search or autocomplete component.
Updates the search query and manages the timer to limit the frequency of fetch requests.

**Parameters:**
- `value` (`string`): The input value.
- `input` (`string`): The input field identifier.

### `onBlur()`
Handles the blur event when the input field loses focus.
Clears the plant list and resets the input value if no plant is selected.
