<template>
  <base-card class="results">
    <!-- Results form -->
    <form @submit.prevent="saveResults" class="results-form">
      <!-- Title for the results form -->
      <h3>Wyniki destylacji</h3>
      <!-- Distillation results component -->
      <results-distillation></results-distillation>
      <!-- Results data component -->
      <results-data
        :isFormValid="isFormValid"
        :wasSubmitted="wasSubmitted"
      ></results-data>
      <!-- Results descriptions component -->
      <results-descriptions
        :isFormValid="isFormValid"
        :wasSubmitted="wasSubmitted"
      ></results-descriptions>
      <!-- Button to submit the results form -->
      <base-button class="results-form__button" type="submit"
        >Zapisz wyniki destylacji</base-button
      >
    </form>
  </base-card>
</template>

<script lang="ts">
import ResultsData from "@/components/results/ResultsData.vue";
import ResultsDescriptions from "@/components/results/ResultsDescriptions.vue";
import ResultsDistillation from "@/components/results/ResultsDistillation.vue";
import { ResultsForm } from "@/types/forms/resultsForm";
import {
  GetDistillationById,
  DistillationTime,
} from "@/types/forms/distillationForm";
import { GetPlantById, NormalizedPlantById } from "@/types/forms/plantForm";
import { resultsFormValidation } from "@/helpers/formsValidation";
import { initialResultsForm } from "@/helpers/formsInitialState";
import { handleUserError } from "@/helpers/errorHandling";
import { CREATE_DISTILLATION_ARCHIVE } from "@/graphql/mutations/results";
import { DELETE_DISTILLATION } from "@/graphql/mutations/distillation";
import { GET_DISTILLATION_BY_ID } from "@/graphql/queries/distillation";
import { GET_PLANT_BY_ID } from "@/graphql/queries/plant";
import { useStore } from "@/store/useStore";
import { defineComponent, ref, onMounted, computed, nextTick } from "vue";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import { useMutation, useApolloClient } from "@vue/apollo-composable";
import { normalizeSelectedFields } from "@/helpers/formsNormalize";
import { mapResultsForm } from "@/helpers/formsMapping";

export default defineComponent({
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
    const resultsForm = computed<ResultsForm>(
      () => store.getters["results/resultsForm"]
    );

    // Reactive reference to track form validity
    const isFormValid = ref<boolean>(false);
    const wasSubmitted = ref<boolean>(false);

    // Apollo client instance
    const { resolveClient } = useApolloClient();
    const apolloClient = resolveClient();

    // Route object to access route params
    const route = useRoute();
    const router = useRouter();

    // Reactive references for distillation data
    const distillationId = ref<string | string[]>(route.params.distillId);

    // Using GraphQL mutation for creating new results
    const { mutate: createDistillationArchive } = useMutation(
      CREATE_DISTILLATION_ARCHIVE
    );

    const fieldsToNormalize: (keyof GetPlantById)[] = [
      "harvestDate",
      "harvestStartTime",
      "harvestEndTime",
      "countryOfOrigin",
      "plantBuyDate",
      "plantProducer",
    ];

    /**
     * @function setDistillationDetails
     * @description Helper function to set distillation details in Vuex state.
     * @param {Object} details - The distillation details object.
     */
    const setDistillationDetails = (details: GetDistillationById): void => {
      const distillationKeys = Object.keys(details).filter(
        (key) =>
          key !== "_id" &&
          key !== "__typename" &&
          key !== "choosedPlant" &&
          key !== "distillationTime"
      ) as (keyof GetDistillationById)[];

      for (const key of distillationKeys) {
        store.dispatch("results/setDistillationDataValue", {
          input: key,
          value: details[key],
        });
      }

      const timeKeys = Object.keys(details.distillationTime).filter(
        (key) => key !== "__typename"
      ) as (keyof DistillationTime)[];

      for (const key of timeKeys) {
        store.dispatch("results/setDistillationTime", {
          input: key,
          value: details.distillationTime[key],
        });
      }
    };

    /**
     * @function setPlantDetails
     * @description Helper function to set plant details in Vuex state.
     * @param {Object} details - The plant details object.
     */
    const setPlantDetails = (details: NormalizedPlantById): void => {
      const keys = Object.keys(details).filter(
        (key) => key !== "_id" && key !== "__typename"
      ) as (keyof NormalizedPlantById)[];

      for (const key of keys) {
        store.dispatch("results/setPlantDataValue", {
          input: key,
          value: details[key],
        });
      }
    };

    /**
     * @async
     * @function fetchPlantDetails
     * @description Fetches the plant details by plant ID from GraphQL API.
     * @param {string} plantId - The ID of the plant to fetch.
     * @returns {Promise<void>}
     */
    const fetchPlantDetails = async (plantId: string): Promise<void> => {
      try {
        const { data } = await apolloClient.query({
          query: GET_PLANT_BY_ID,
          variables: { id: plantId, formatDates: true },
        });
        const plantDetails = normalizeSelectedFields(
          data.getPlantById,
          fieldsToNormalize
        );
        // Save plant details in Vuex state
        setPlantDetails(plantDetails);
      } catch (error: any) {
        await handleUserError(error);
      }
    };

    /**
     * @async
     * @function fetchDistillationDetails
     * @description Fetches the distillation details by distillation ID from GraphQL API.
     * @returns {Promise<void>}
     */
    const fetchDistillationDetails = async (): Promise<void> => {
      try {
        const { data } = await apolloClient.query({
          query: GET_DISTILLATION_BY_ID,
          variables: { id: distillationId.value, formatDates: true },
        });
        const distillationDetails = data.getDistillationById;

        // Save distillation details in Vuex state
        setDistillationDetails(distillationDetails);

        // Fetch plant details using the plant ID from distillation details
        await fetchPlantDetails(distillationDetails.choosedPlant.id);
      } catch (error: any) {
        await handleUserError(error);
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
    const submitResultsForm = async (): Promise<void> => {
      // Validate the form
      wasSubmitted.value = true;
      isFormValid.value = resultsFormValidation(resultsForm.value);
      if (isFormValid.value) {
        try {
          const resultsFormData = mapResultsForm(resultsForm.value);

          await createDistillationArchive({
            input: resultsFormData,
          });
        } catch (error: any) {
          await handleUserError(error);
          wasSubmitted.value = false;
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
    const removeDistillation = async (): Promise<void> => {
      try {
        const { data } = await apolloClient.mutate({
          mutation: DELETE_DISTILLATION,
          variables: { id: distillationId.value },
        });
      } catch (error: any) {
        await handleUserError(error);
        throw error;
      }
    };

    const saveResults = async (): Promise<void> => {
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

    return { saveResults, isFormValid, wasSubmitted };
  },
});
</script>

<style scoped>
.results {
  margin-top: 50px;
  margin-bottom: 100px;
}

.results-form {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.results-form__button {
  margin-bottom: 20px;
}
</style>
