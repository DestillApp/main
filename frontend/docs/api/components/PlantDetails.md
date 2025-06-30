# PlantDetails

Displays detailed information about a plant, including origin, harvest/buy details, state, and age.
 * Fetches plant details from the API or uses provided distilledPlant prop.
 *

## Props

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `plantId` | `string` | no |  |
| `distilledPlant` | `DistillationArchivePlant` | no |  |

## Exposed Methods

### `fetchPlantDetails()`
Fetches the plant details by plant ID from GraphQL API.
