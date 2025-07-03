# AddResultsPage

[View source on GitHub](https://github.com/DestillApp/main/blob/main/frontend/src/pages/results/AddResultsPage.vue)

This component renders a form for adding distillation results, handles validation, saving, and navigation after submission.
 *

## Exposed Methods

### `setDistillationDetails()`
Helper function to set distillation details in Vuex state.

**Parameters:**
- `details` (`GetDistillationById`): The distillation details object.

### `setPlantDetails()`
Helper function to set plant details in Vuex state.

**Parameters:**
- `details` (`NormalizedPlantById`): The plant details object.

### `fetchPlantDetails()`
Fetches the plant details by plant ID from GraphQL API.

**Parameters:**
- `plantId` (`string`): The ID of the plant to fetch.

### `fetchDistillationDetails()`
Fetches the distillation details by distillation ID from GraphQL API.

### `submitResultsForm()`
Handles the submission of the results form, validates, and sends data to the backend.

### `removeDistillation()`
Deletes the distillation from the database by its ID.

### `saveResults()`
Saves the results and navigates to the distillation archives page.
