# PlantDetails

## Exposed Methods

### `async()`
Fetches the plant details by plant ID from GraphQL API.

```ts
const fetchPlantDetails = async (): Promise<void> => {
      try {
        isLoading.value = true;
        const { data } = await apolloClient.query({
          query: GET_PLANT_BY_ID,
          variables: { id: props.plantId, formatDates: true },
        });
        plantDetails.value = normalizeSelectedFields(
          data.getPlantById,
          fieldsToNormalize
        );
      } catch (error: any) {
        await handleUserError(error);
        plantDetails.value = null;
      } finally {
        isLoading.value = false;
      }
    };
```
