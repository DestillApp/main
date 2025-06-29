<template>
  <!-- Show plant details only when loaded and available -->
  <div v-if="!isLoading && plantDetails" class="plant-details">
    <!-- Section for purchased plant details -->
    <div v-if="plantDetails.plantOrigin === 'kupno'">
      <div>data zakupu: {{ plantDetails.plantBuyDate }}</div>
      <div>producent: {{ plantDetails.plantProducer }}</div>
      <div>kraj pochodzenia: {{ plantDetails.countryOfOrigin }}</div>
    </div>
    <!-- Section for harvested plant details -->
    <div v-if="plantDetails.plantOrigin === 'zbiór'">
      <div>data zbioru: {{ plantDetails.harvestDate }}</div>
      <div>temperatura: {{ plantDetails.harvestTemperature }} °C</div>
      <div>
        godziny zbioru: {{ plantDetails.harvestStartTime }} -
        {{ plantDetails.harvestEndTime }}
      </div>
    </div>
    <!-- Plant state -->
    <div>stan: {{ plantDetails.plantState }}</div>
    <!-- Drying time if plant is 'podsuszony' -->
    <div v-if="plantDetails.plantState === 'podsuszony'">
      czas podsuszania: {{ plantDetails.dryingTime }} h
    </div>
    <!-- Plant age if available -->
    <div v-if="plantDetails.plantAge">
      wiek przy zakupie: {{ plantDetails.plantAge }}
      {{ plantAgeWithSuffix(plantDetails.plantAge) }}
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";
import { useStore } from "@/store/useStore";
import { useRouter } from "vue-router";
import { useApolloClient } from "@vue/apollo-composable";
import { GET_PLANT_BY_ID } from "@/graphql/queries/plant";
import { plantAgeWithSuffix } from "@/helpers/displayHelpers";
import { normalizeSelectedFields } from "@/helpers/formsNormalize";
import { handleUserError } from "@/helpers/errorHandling";
import { GetPlantById, NormalizedPlantById } from "@/types/forms/plantForm";
import { DistillationArchivePlant } from "@/types/forms/resultsForm";

/**
 * @component PlantDetails
 * @description Displays detailed information about a plant, including origin, harvest/buy details, state, and age.
 * Fetches plant details from the API or uses provided distilledPlant prop.
 * @props {string} [plantId] - The ID of the plant to fetch details for.
 * @props {DistillationArchivePlant} [distilledPlant] - Pre-fetched plant details (used for distillation archive).
 * @see fetchPlantDetails
 */

/**
 * Props for PlantDetails component.
 * @interface
 * @property {string} [plantId]
 * @property {DistillationArchivePlant} [distilledPlant]
 */
interface Props {
  plantId?: string;
  distilledPlant?: DistillationArchivePlant;
}

export default {
  name: "PlantDetails",
  props: ["plantId", "distilledPlant"],
  setup(props: Props) {
    const { resolveClient } = useApolloClient();
    const apolloClient = resolveClient();

    // Vuex store instance
    const store = useStore();

    // Router object for navigation
    const router = useRouter();

    // Loading state for plant details
    const isLoading = ref<boolean>(true);

    // Plant details data (fetched or from prop)
    const plantDetails = ref<
      DistillationArchivePlant | NormalizedPlantById | null
    >(null);

    // Fields to normalize from API response
    const fieldsToNormalize: (keyof GetPlantById)[] = [
      "harvestDate",
      "harvestStartTime",
      "harvestEndTime",
      "countryOfOrigin",
      "plantBuyDate",
      "plantProducer",
    ];

    /**
     * Fetches the plant details by plant ID from GraphQL API.
     * @async
     * @function fetchPlantDetails
     * @returns {Promise<void>}
     */
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

    // Fetch plant details on mount if plantId or distilledPlant is provided
    onMounted(() => {
      if (props.plantId) {
        fetchPlantDetails();
      }
      if (props.distilledPlant) {
        plantDetails.value = props.distilledPlant;
        isLoading.value = false;
      }
    });

    return { isLoading, plantDetails, plantAgeWithSuffix };
  },
};
</script>

<style scoped>
.plant-details {
  font-size: 13px;
}
</style>
