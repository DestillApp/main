
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
import { DELETE_DISTILLATION } from "@/graphql/mutations/distillation";
import { GET_DISTILLATION_BY_ID } from "@/graphql/queries/distillation";
import { GET_PLANT_BY_ID } from "@/graphql/queries/plant";
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
    const { mutate: createDistillationArchive } = useMutation(
      CREATE_DISTILLATION_ARCHIVE
    );

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
        {
          input: "distillationApparatus",
          value: details.distillationApparatus,
        },
        { input: "waterForDistillation", value: details.waterForDistillation },
      ];

      const distillationTimeFields = [
        {
          input: "distillationHours",
          value: details.distillationTime.distillationHours,
        },
        {
          input: "distillationMinutes",
          value: details.distillationTime.distillationMinutes,
        },
      ];

      distillationDataFields.forEach(({ input, value }) => {
        store.dispatch("results/setDistillationDataValue", { input, value });
      });

      distillationTimeFields.forEach(({ input, value }) => {
        store.dispatch("results/setDistillationTime", { input, value });
      });
    };

    /**
     * @function setPlantDetails
     * @description Helper function to set plant details in Vuex state.
     * @param {Object} details - The plant details object.
     */
    const setPlantDetails = (details) => {
      const plantDataFields = [
        { input: "plantName", value: details.plantName },
        { input: "plantPart", value: details.plantPart },
        { input: "plantOrigin", value: details.plantOrigin },
        { input: "plantBuyDate", value: details.plantBuyDate },
        { input: "plantProducer", value: details.plantProducer },
        { input: "countryOfOrigin", value: details.countryOfOrigin },
        { input: "harvestDate", value: details.harvestDate },
        { input: "harvestTemperature", value: details.harvestTemperature },
        { input: "harvestStartTime", value: details.harvestStartTime },
        { input: "harvestEndTime", value: details.harvestEndTime },
        { input: "plantState", value: details.plantState },
        { input: "dryingTime", value: details.dryingTime },
        { input: "plantAge", value: details.plantAge },
      ];

      plantDataFields.forEach(({ input, value }) => {
        store.dispatch("results/setPlantDataValue", { input, value });
      });
    };

    /**
     * @async
     * @function fetchPlantDetails
     * @description Fetches the plant details by plant ID from GraphQL API.
     * @param {string} plantId - The ID of the plant to fetch.
     * @returns {Promise<void>}
     */
    const fetchPlantDetails = async (plantId) => {
      try {
        const { data } = await apolloClient.query({
          query: GET_PLANT_BY_ID,
          variables: { id: plantId, formatDates: true },
        });
        const plantDetails = data.getPlantById;
        console.log(plantDetails);

        // Save plant details in Vuex state
        setPlantDetails(plantDetails);
      } catch (error) {
        if (error.message === "Unauthorized") {
          await store.dispatch("auth/logout");
          router.push("/login");
        }
        console.error("Failed to get plant details:", error);
      }
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

        // Fetch plant details using the plant ID from distillation details
        await fetchPlantDetails(distillationDetails.choosedPlant.id);
      } catch (error) {
        console.error("Failed to get distillation details:", error);
        if (error.message === "Unauthorized") {
          await store.dispatch("auth/logout");
          router.push("/login");
        }
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
            distillationData: {
              weightForDistillation: form.distillationData.weightForDistillation
                ? Number(
                    DOMPurify.sanitize(
                      form.distillationData.weightForDistillation
                    )
                  )
                : null,
              isPlantSoaked: form.distillationData.isPlantSoaked,
              soakingTime: form.distillationData.soakingTime
                ? Number(DOMPurify.sanitize(form.distillationData.soakingTime))
                : null,
              weightAfterSoaking: form.distillationData.weightAfterSoaking
                ? Number(
                    DOMPurify.sanitize(form.distillationData.weightAfterSoaking)
                  )
                : null,
              isPlantShredded: form.distillationData.isPlantShredded,
              distillationType: DOMPurify.sanitize(
                form.distillationData.distillationType
              ),
              distillationDate: DOMPurify.sanitize(
                form.distillationData.distillationDate
              ),
              distillationApparatus: DOMPurify.sanitize(
                form.distillationData.distillationApparatus
              ),
              waterForDistillation: form.distillationData.waterForDistillation
                ? Number(
                    DOMPurify.sanitize(
                      form.distillationData.waterForDistillation
                    )
                  )
                : null,
              distillationTime: {
                distillationHours: form.distillationData.distillationTime
                  .distillationHours
                  ? Number(
                      DOMPurify.sanitize(
                        form.distillationData.distillationTime.distillationHours
                      )
                    )
                  : null,
                distillationMinutes: form.distillationData.distillationTime
                  .distillationMinutes
                  ? Number(
                      DOMPurify.sanitize(
                        form.distillationData.distillationTime
                          .distillationMinutes
                      )
                    )
                  : null,
              },
            },
            distilledPlant: {
              plantName: DOMPurify.sanitize(form.distilledPlant.plantName),
              plantPart: DOMPurify.sanitize(form.distilledPlant.plantPart),
              plantOrigin: DOMPurify.sanitize(form.distilledPlant.plantOrigin),
              plantBuyDate: DOMPurify.sanitize(
                form.distilledPlant.plantBuyDate
              ),
              plantProducer: DOMPurify.sanitize(
                form.distilledPlant.plantProducer
              ),
              countryOfOrigin: DOMPurify.sanitize(
                form.distilledPlant.countryOfOrigin
              ),
              harvestDate: DOMPurify.sanitize(form.distilledPlant.harvestDate),
              harvestTemperature: form.distilledPlant.harvestTemperature
                ? Number(
                    DOMPurify.sanitize(form.distilledPlant.harvestTemperature)
                  )
                : null,
              harvestStartTime: DOMPurify.sanitize(
                form.distilledPlant.harvestStartTime
              ),
              harvestEndTime: DOMPurify.sanitize(
                form.distilledPlant.harvestEndTime
              ),
              plantState: DOMPurify.sanitize(form.distilledPlant.plantState),
              dryingTime: form.distilledPlant.dryingTime
                ? Number(DOMPurify.sanitize(form.distilledPlant.dryingTime))
                : null,
              plantAge: form.distilledPlant.plantAge
                ? Number(DOMPurify.sanitize(form.distilledPlant.plantAge))
                : null,
            },
          };

          const { data } = await createDistillationArchive({
            input: resultsFormData,
          });
          console.log("Created results:", data.createDistillationArchive);
        } catch (error) {
          if (error.message === "Unauthorized") {
          await store.dispatch("auth/logout");
          router.push("/login");
        }
          console.error("Error submitting form", error);
          throw error;
        }
      } else {
        console.log("invalid form!");
        return;
      }
    };

    /**
     * @async
     * @function removeDistillation
     * @description Function to delete the distillation from the database by its ID.
     * @returns {Promise<void>} Resolves when the distillation is deleted.
     * @throws {Error} Throws an error if the deletion fails.
     */
    const removeDistillation = async () => {
      try {
        const { data } = await apolloClient.mutate({
          mutation: DELETE_DISTILLATION,
          variables: { id: distillationId.value },
        });
        console.log("Deleted distillation:", data.deleteDistillation);
      } catch (error) {
        if (error.message === "Unauthorized") {
          await store.dispatch("auth/logout");
          router.push("/login");
        }
        console.error("Error deleting distillation:", error);
        throw error;
      }
    };

    const saveResults = async () => {
      try {
        await submitResultsForm();
        if (!isFormValid.value) {
          return;
        } else {
          await removeDistillation();
          router.push({
            name: "DistillationArchivesPage",
            params: { page: 1 },
          });
        }
      } catch (error) {
        console.error("Error in saveResults:", error);
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
        for (const key in initialResultsForm.distillationData) {
          localStorage.removeItem(key);
        }
        for (const key in initialResultsForm.distillationData
          .distillationTime) {
          localStorage.removeItem(key);
        }
        for (const key in initialResultsForm.distilledPlant) {
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
