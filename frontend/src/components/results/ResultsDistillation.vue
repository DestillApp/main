<template>
  <div class="results_distillation">
    <!-- Display distillation details -->
    <div v-if="distillationDetails" class="distillation_details">
      <div class="distillation_details--process">
        <p>
          <strong class="distillation_color">data destylacji:</strong>
          {{ distillationDetails.distillationDate }}
        </p>
        <p>
          <strong class="distillation_color">typ destylacji:</strong>
          {{ distillationDetails.distillationType }}
        </p>
        <p>
          <strong class="distillation_color"
            >ilość wody użyta do destylacji:</strong
          >
          {{ distillationDetails.waterForDistillation }} l
        </p>
      </div>
      <div class="distillation_details--plant">
        <p>
          <strong class="plant_color">destylowany surowiec:</strong>
          {{ distillationDetails.choosedPlant.name }}
        </p>
        <p>
          <strong class="plant_color">część surowca:</strong>
          {{ distillationDetails.choosedPlant.part }}
        </p>
        <p>
          <strong class="plant_color"
            >ilość surowca użyta do destylacji:</strong
          >
          {{ distillationDetails.weightForDistillation }} kg
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useApolloClient } from "@vue/apollo-composable";
import { GET_DISTILLATION_BY_ID } from "@/graphql/queries/distillation";

export default {
  name: "ResultsDistillation",
  setup() {
    const { resolveClient } = useApolloClient();
    const apolloClient = resolveClient();

    // Route object to access route params
    const route = useRoute();

    // Reactive references for distillation data
    const distillationId = ref(route.params.distillId);
    const distillationDetails = ref(null);

    /**
     * @async
     * @function fetchDistillationDetails
     * @description Fetches the distillation details by distillation ID from GraphQL API.
     * @returns {Promise<void>}
     */
    const fetchDistillationDetails = async () => {
      try {
        const { data } = await apolloClient.query({
          query: GET_DISTILLATION_BY_ID,
          variables: { id: distillationId.value, formatDates: true },
        });
        distillationDetails.value = data.getDistillationById;
        console.log(distillationDetails.value);
      } catch (error) {
        console.error("Failed to get distillation details:", error);
        distillationDetails.value = null;
      }
    };

    onMounted(() => {
      fetchDistillationDetails();
    });

    return {
      distillationDetails,
    };
  },
};
</script>

<style scoped>
.distillation_details {
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.distillation_details--process,
.distillation_details--plant {
  width: 50%;
}

.plant_color {
  color: var(--primary-color);
}

.distillation_color {
  color: var(--primary-color-distillation);
}
</style>