# PlantDetails

[View source on GitHub](https://github.com/DestillApp/destill-app-fullstack/blob/main/frontend/src/components/plant/PlantDetails.vue)

Displays detailed information about a plant, including origin, harvest/buy details, state, and age. Fetches plant details from the API or uses provided distilledPlant prop.
 *

## Props

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `plantId` | `string` | no | The ID of the plant to fetch details for. |
| `distilledPlant` | `DistillationArchivePlant` | no | Pre-fetched plant details (used for distillation archive). |

## Exposed Methods

### `fetchPlantDetails()`
Fetches the plant details by plant ID from GraphQL API.
