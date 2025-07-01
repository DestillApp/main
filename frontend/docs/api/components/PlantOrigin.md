# PlantOrigin

This component renders a form to input and manage data related to plant used in distillation, including origin, harvest date, harvest temperature, harvest range, buy date and producer details.
 *

## Props

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `isFormValid` | `boolean` | yes | Indicates if the form is valid. |
| `isResetting` | `boolean` | no | Indicates if the form is being reset. |
| `wasSubmitted` | `boolean` | yes | Indicates if the form was submitted. |

## Exposed Methods

### `setValue()`
Dispatches an action to the Vuex store to set a specific value.

**Parameters:**
- `currentValue` (`string`): The current value to be set.
- `input` (`string`): The input field name.

### `storeDate()`
Stores a date value in the Vuex store.

**Parameters:**
- `date` (`string`): The date value to be stored.
- `input` (`string`): The input field name.

### `setCountry()`
Sets the selected country for the country autocomplete input.

**Parameters:**
- `currentValue` (`string`): The selected country name.
- `input` (`string`): The input field name.

### `fetchCountries()`
Async function to fetch country names based on user input for the autocomplete component.

**Parameters:**
- `name` (`string`): The search query to fetch country names for.

**Returns:** Resolves when the country names are fetched and stored in the reactive variable.

### `onInput()`
Handles the input event for the search or autocomplete component.
Updates the search query and manages the timer to limit the frequency of fetch requests.

**Parameters:**
- `value` (`string`): The input value.
- `input` (`string`): The input field identifier.

### `onBlur()`
Handles the blur event for the country input field.
When the input field loses focus, it checks whether the user has selected a country.
If no country is selected, it clears the country list and resets the search query and country name.
