# ArchiveDistillationDetailsPage

[View source on GitHub](https://github.com/DestillApp/destill-app-fullstack/blob/main/frontend/src/pages/results/ArchiveDistillationDetailsPage.vue)

Displays details of a distillation archive, allows editing, deleting, and viewing plant details.
 *

## Exposed Methods

### `fetchDistillationDetails()`
Fetches the archive distillation details by ID from GraphQL API.

### `openClosePlant()`
Toggles the plant details open/close state.

### `openDeleteModal()`
Opens the delete modal for a specific distillation.

**Parameters:**
- `id` (`String`): The ID of the distillation to delete.
- `name` (`String`): The name of the plant.
- `part` (`String`): The part of the plant.
- `date` (`String`): Distillation date.

### `closeDeleteModal()`
Closes the delete modal.

### `deleteDistillation()`
Deletes the selected distillation archive and navigates to the archives page.
