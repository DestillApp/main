# EditPlantPage

[View source on GitHub](https://github.com/DestillApp/main/blob/main/frontend/src/pages/plant/EditPlantPage.vue)

This component renders a plant form and handles editing and saving plant data.
 *

## Exposed Methods

### `fetchPlantDetails()`
Fetches the plant details by plant ID from GraphQL API.

### `setValue()`
Dispatches Vuex action to set a specific plant form field value.

**Parameters:**
- `input` (`String`): The form field to be updated.
- `value` (`*`): The new value for the form field.

### `submitPlantForm()`
Handles the submission of the plant form, validates, and sends data to the backend.

### `editPlant()`
Edits an existing plant and navigates back to the plant list.

### `editPlantAndDistill()`
Edits an existing plant and navigates to the add distillation page.
