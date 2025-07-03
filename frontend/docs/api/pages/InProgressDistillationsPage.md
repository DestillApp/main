# InProgressDistillationsPage

[View source on GitHub](https://github.com/DestillApp/main/blob/main/frontend/src/pages/my-account/InProgressDistillationsPage.vue)

Displays a paginated, searchable, and sortable list of in-progress distillations. Allows deletion of distillations and manages list settings.
 *

## Exposed Methods

### `fetchDistillationList()`
Fetch the list of distillations from the GraphQL server.

**Parameters:**
- `name` (`string`): Search query for plant name.
- `sorting` (`string`): Sorting key.

### `handleSearch()`
Handle the search query emitted from the BaseSearchItem component.

### `handleSelectLength()`
Handle the selection of list length.

**Parameters:**
- `length` (`number`): The selected length.

### `updateSorting()`
Update the sorting option and fetch the distillation list.

**Parameters:**
- `sortingKey` (`string`): The sorting key.
- `sortingValue` (`string`): The sorting value.

### `handleSorting()`
Handle the sorting of the items list.

**Parameters:**
- `option` (`string`): The sorting option.

### `openDeleteModal()`
Open the delete modal for a specific distillation.

**Parameters:**
- `id` (`string`): The ID of the distillation to delete.
- `plantId` (`string`): The ID of the plant.
- `name` (`string`): The name of the plant.
- `part` (`string`): The part of the plant.
- `dWeight` (`number`): The weight of the distillation.
- `date` (`string`): Distillation date.

### `closeDeleteModal()`
Close the delete modal.

### `deleteDistillationFromList()`
Remove the deleted distillation from the list.

**Parameters:**
- `id` (`string`): The ID of the deleted distillation.

### `deleteDistillation()`
Delete the selected distillation from the list.

### `addPlantWeight()`
Add the distillation weight back to the plant's available weight.

### `handleYes()`
Handles confirmation of adding plant weight back after deletion.
