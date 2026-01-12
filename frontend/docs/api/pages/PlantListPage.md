# PlantListPage

[View source on GitHub](https://github.com/DestillApp/destill-app-fullstack/blob/main/frontend/src/pages/my-account/PlantListPage.vue)

This component displays a paginated, searchable, and sortable list of plants. Allows deletion of plants and manages list settings.
 *

## Exposed Methods

### `fetchPlantList()`
Fetch the list of plants from the GraphQL server.

**Parameters:**
- `name` (`string`): Search query for plant name.
- `sorting` (`string`): Sorting key.

### `handleSearch()`
Handle the search query emitted from the BaseSearchItem component.

### `handleSelectLength()`
Handle the selection of list length.

**Parameters:**
- `length` (`number`): The selected length.

### `handleSorting()`
Handle the sorting of the items list.

**Parameters:**
- `option` (`string`): The sorting option.

### `updateSorting()`
Update the sorting option and fetch the plant list.

**Parameters:**
- `sortingKey` (`string`): The sorting key.
- `sortingValue` (`string`): The sorting value.

### `openDeleteModal()`
Open the delete modal for a specific plant.

**Parameters:**
- `id` (`string`): The ID of the plant to delete.
- `name` (`string`): The name of the plant.
- `part` (`string`): The part of the plant.

### `closeDeleteModal()`
Close the delete modal.

### `deletePlant()`
Delete the selected plant from the list.

### `deletePlantFromList()`
Remove the deleted plant from the plant list.

**Parameters:**
- `id` (`string`): The ID of the deleted plant.
