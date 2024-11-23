<template>
  <base-card>
    <!-- Results form -->
    <form @submit.prevent="saveResults" class="results_form">
      <!-- Title for the results form -->
      <h3 class="form_title">Wyniki destylacji</h3>
      <!-- Distillation results component -->
      <results-distillation></results-distillation>
      <!-- Results data component -->
      <results-data :isFormValid="isFormValid"></results-data>
      <!-- Results descriptions component -->
      <results-descriptions :isFormValid="isFormValid"></results-descriptions>
      <!-- Button to submit the results form -->
      <base-button class="button" type="submit"
        >Zapisz wyniki destylacji</base-button
      >
    </form>
  </base-card>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useApolloClient } from "@vue/apollo-composable";
import ResultsData from "@/components/results/ResultsData.vue";
import ResultsDescriptions from "@/components/results/ResultsDescriptions.vue";
import ResultsDistillation from "@/components/results/ResultsDistillation.vue";
import { GET_DISTILLATION_BY_ID } from "@/graphql/queries/distillation";
import { useStore } from "vuex";

export default {
  name: "AddResultsPage",
  components: {
    ResultsData,
    ResultsDescriptions,
    ResultsDistillation,
  },
  setup() {
    // Vuex store instance
    const store = useStore();

    // Reactive reference to track form validity
    const isFormValid = ref(null);

    // Apollo client instance
    const { resolveClient } = useApolloClient();
    const apolloClient = resolveClient();

    // Route object to access route params
    const route = useRoute();

    // Reactive references for distillation data
    const distillationId = ref(route.params.distillId);

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
        const distillationDetails = data.getDistillationById;
        console.log(distillationDetails);

        // Save distillation details in Vuex state
        store.dispatch("results/setValue", {
          input: "distillationDate",
          value: distillationDetails.distillationDate,
        });
        store.dispatch("results/setValue", {
          input: "distillationType",
          value: distillationDetails.distillationType,
        });
        store.dispatch("results/setValue", {
          input: "waterForDistillation",
          value: distillationDetails.waterForDistillation,
        });
        store.dispatch("results/setValue", {
          input: "choosedPlantName",
          value: distillationDetails.choosedPlant.name,
        });
        store.dispatch("results/setValue", {
          input: "choosedPlantPart",
          value: distillationDetails.choosedPlant.part,
        });
        store.dispatch("results/setValue", {
          input: "weightForDistillation",
          value: distillationDetails.weightForDistillation,
        });
      } catch (error) {
        console.error("Failed to get distillation details:", error);
      }
    };

    onMounted(() => {
      fetchDistillationDetails();
    });

    return { isFormValid };
  },
};
</script>

<style scoped>
.results_form {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.button {
  margin-bottom: 20px;
}
</style>