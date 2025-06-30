# ResultsPlant

Displays and manages the plant-related part of the distillation results, including plant selection, plant details, and soaking/shredding options.
 *

## Props

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `isFormValid` | `boolean` | yes |  |
| `isEditing` | `boolean` | no |  |

## Exposed Methods

### `fetchPlantData()`
Fetches plant data from local storage for a given key.

**Parameters:**
- `key` (`string`): The key for the specific data to fetch.

### `fetchDistillationData()`
Fetches distillation data from local storage for a given key.

**Parameters:**
- `key` (`string`): The key for the specific data to fetch.
