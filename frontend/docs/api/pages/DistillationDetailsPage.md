# DistillationDetailsPage

[View source on GitHub](https://github.com/DestillApp/destill-app-fullstack/blob/main/frontend/src/pages/distillation/DistillationDetailsPage.vue)

Displays details of a distillation, allows editing, deleting, and restoring plant weight. Handles fetching, deletion, and restoration logic.
 *

## Exposed Methods

### `fetchDistillationDetails()`
Fetches the distillation details by ID from GraphQL API.

### `openClosePlant()`
Toggles the plant details section open/close.

### `openDeleteModal()`
Opens the delete modal for a specific distillation.

**Parameters:**
- `id` (`string`): The distillation ID.
- `plantId` (`string`): The plant ID.
- `name` (`string`): The plant name.
- `part` (`string`): The plant part.
- `dWeight` (`number`): The distillation weight.
- `date` (`string`): The distillation date.

### `closeDeleteModal()`
Closes the delete modal.

### `openAskModal()`
Opens the ask modal.

### `closeAskModal()`
Closes the ask modal and resets related state.

### `deleteDistillation()`
Deletes the selected distillation.

### `addPlantWeight()`
Adds the distillation weight back to the plant's available weight.

### `handleYes()`
Handles confirmation of adding plant weight back after deletion.
