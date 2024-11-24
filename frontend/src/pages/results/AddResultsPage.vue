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
import ResultsData from "@/components/results/ResultsData.vue";
import ResultsDescriptions from "@/components/results/ResultsDescriptions.vue";
import ResultsDistillation from "@/components/results/ResultsDistillation.vue";
import { resultsFormValidation } from "@/helpers/formsValidation";
import { initialResultsForm } from "@/helpers/formsInitialState";
import { CREATE_DISTILLATION_ARCHIVE } from "@/graphql/mutations/results.js";
import { GET_DISTILLATION_BY_ID } from "@/graphql/queries/distillation";
import { useStore } from "vuex";
import { ref, onMounted, computed, nextTick } from "vue";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import { useMutation, useApolloClient } from "@vue/apollo-composable";
import DOMPurify from "dompurify";

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

    // Computed properties to get results form data from Vuex store
    const resultsForm = computed(() => store.getters["results/resultsForm"]);

    // Reactive reference to track form validity
    const isFormValid = ref(null);

    // Apollo client instance
    const { resolveClient } = useApolloClient();
    const apolloClient = resolveClient();

    // Route object to access route params
    const route = useRoute();
    const router = useRouter();

    // Reactive references for distillation data
    const distillationId = ref(route.params.distillId);

    // Using GraphQL mutation for creating new results
    const { mutate: createResults } = useMutation(CREATE_DISTILLATION_ARCHIVE);

    /**
     * @function setDistillationDetails
     * @description Helper function to set distillation details in Vuex state.
     * @param {Object} details - The distillation details object.
     */
    const setDistillationDetails = (details) => {
      const distillationDataFields = [
        {
          input: "weightForDistillation",
          value: details.weightForDistillation,
        },
        { input: "isPlantSoaked", value: details.isPlantSoaked },
        { input: "soakingTime", value: details.soakingTime },
        { input: "weightAfterSoaking", value: details.weightAfterSoaking },
        { input: "isPlantShredded", value: details.isPlantShredded },
        { input: "distillationType", value: details.distillationType },
        { input: "distillationDate", value: details.distillationDate },
        { input: "waterForDistillation", value: details.waterForDistillation },
        {
          input: "distillationTime.distillationHours",
          value: details.distillationTime.distillationHours,
        },
        {
          input: "distillationTime.distillationMinutes",
          value: details.distillationTime.distillationMinutes,
        },
      ];

      const valueFields = [
        { input: "choosedPlantName", value: details.choosedPlant.name },
        { input: "choosedPlantPart", value: details.choosedPlant.part },
      ];

      distillationDataFields.forEach(({ input, value }) => {
        store.dispatch("results/setDistillationDataValue", { input, value });
      });

      valueFields.forEach(({ input, value }) => {
        store.dispatch("results/setValue", { input, value });
      });
    };

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
        setDistillationDetails(distillationDetails);
      } catch (error) {
        console.error("Failed to get distillation details:", error);
      }
    };

    onMounted(() => {
      fetchDistillationDetails();
    });

    /**
     * @async
     * @function submitResultsForm
     * @description Function to handle the submission of the results form.
     * @returns {Promise<void>} Resolves when the form submission process is complete.
     * @throws {Error} Throws an error if the form submission fails.
     */
    const submitResultsForm = async () => {
      // Validate the form
      isFormValid.value = resultsFormValidation(resultsForm.value);
      if (isFormValid.value) {
        try {
          const form = resultsForm.value;

          const resultsFormData = {
            oilAmount: form.oilAmount
              ? Number(DOMPurify.sanitize(form.oilAmount))
              : null,
            hydrosolAmount: form.hydrosolAmount
              ? Number(DOMPurify.sanitize(form.hydrosolAmount))
              : null,
            hydrosolpH: form.hydrosolpH
              ? Number(DOMPurify.sanitize(form.hydrosolpH))
              : null,
            oilDescription: DOMPurify.sanitize(form.oilDescription),
            hydrosolDescription: DOMPurify.sanitize(form.hydrosolDescription),
            distillationDate: form.distillationDate,
            distillationType: form.distillationType,
            waterForDistillation: form.waterForDistillation,
            choosedPlantName: form.choosedPlantName,
            choosedPlantPart: form.choosedPlantPart,
            weightForDistillation: form.weightForDistillation,
          };

          const { data } = await createResults({
            input: resultsFormData,
          });
          console.log("Created results:", data.createResults);
        } catch (error) {
          console.log("error", isFormValid.value);
          console.error("Error submitting form", error);
        }
      } else {
        console.log(isFormValid.value);
        console.log("invalid form!");
        return;
      }
    };

    const saveResults = async () => {
      try {
        await submitResultsForm();
        if (!isFormValid.value) {
          return;
        } else {
          router.push({
            name: "InProgressDistillationsPage",
            params: { page: 1 },
          });
        }
      } catch (error) {
        return;
      }
    };

    // Navigation guard that resets the form data in Vuex state and local storage before navigating away from the route.
    onBeforeRouteLeave(async (to, from, next) => {
      if (to.path !== from.path) {
        // Dispatch Vuex action to reset the form in store
        store.dispatch("results/setResultsForm");
        // Wait for the next tick to ensure state updates are complete
        await nextTick();
        // Removing results form value from local storage by its key
        for (const key in initialResultsForm) {
          localStorage.removeItem(key);
        }
      }
      next();
    });

    return { saveResults, isFormValid };
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