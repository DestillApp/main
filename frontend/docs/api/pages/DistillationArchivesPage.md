# DistillationArchivesPage

[View source on GitHub](https://github.com/DestillApp/main/blob/main/frontend/src/pages/my-account/DistillationArchivesPage.vue)

Displays a paginated, searchable, and sortable list of distillation archives. Allows deletion of archives and manages list settings.
 *

## Exposed Methods

### `fetchDistillationArchivesList()`
Fetch the list of distillation archives from the GraphQL server.

**Parameters:**
- `name` (`string`): Search query for plant name.
- `sortingValue` (`string`): Sorting key.

### `handleSearch()`
Handle the search query emitted from the BaseSearchItem component.

### `handleSelectLength()`
Handle the selection of list length.

**Parameters:**
- `length` (`number`): The selected length.

### `updateSorting()`
Update the sorting option and fetch the distillation archives list.

**Parameters:**
- `sortingKey` (`string`): The sorting key.
- `sortingValue` (`string`): The sorting value.

### `handleSorting()`
Handle the sorting of the items list.

**Parameters:**
- `option` (`string`): The sorting option.

### `openDeleteModal()`
Open the delete modal for a specific distillation archive.

**Parameters:**
- `id` (`string`): The ID of the distillation archive to delete.
- `plantId` (`string`): The ID of the plant.
- `name` (`string`): The name of the plant.
- `part` (`string`): The part of the plant.
- `dWeight` (`number`): The weight of the distillation.
- `date` (`string`): Distillation date.

### `closeDeleteModal()`
Close the delete modal.

### `deleteDistillationFromList()`
Remove the deleted archive from the list.

**Parameters:**
- `id` (`string`): The ID of the deleted archive.

### `deleteDistillationArchive()`
Delete the selected distillation archive from the list.
