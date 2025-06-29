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
import { ref, onMounted, computed, nextTick } from "vue";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import { useMutation, useApolloClient } from "@vue/apollo-composable";
import { normalizeSelectedFields } from "@/helpers/formsNormalize";
import { mapResultsForm } from "@/helpers/formsMapping";
import * as Sentry from "@sentry/vue";

/**
 * @component AddResultsPage
 * @description This component renders a form for adding distillation results, handles validation, saving, and navigation after submission.
 * @see fetchDistillationDetails
 * @see fetchPlantDetails
 * @see setDistillationDetails
 * @see setPlantDetails
 * @see submitResultsForm
 * @see removeDistillation
 * @see saveResults
 */
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

    // Computed property for results form from Vuex store
    const resultsForm = computed<ResultsForm>(
      () => store.getters["results/resultsForm"]
    );

    // Ref for form validity
    const isFormValid = ref<boolean>(false);
    // Ref for submission state
    const wasSubmitted = ref<boolean>(false);

    // Apollo client instance
    const { resolveClient } = useApolloClient();
    const apolloClient = resolveClient();

    // Route and router objects
    const route = useRoute();
    const router = useRouter();

    // Ref for distillation ID from route params
    const distillationId = ref<string | string[]>(route.params.distillId);

    // GraphQL mutation for creating distillation archive
    const { mutate: createDistillationArchive } = useMutation(
      CREATE_DISTILLATION_ARCHIVE
    );

    // List of fields to normalize from the fetched plant details
    const fieldsToNormalize: (keyof GetPlantById)[] = [
      "harvestDate",
      "harvestStartTime",
      "harvestEndTime",
      "countryOfOrigin",
      "plantBuyDate",
      "plantProducer",
    ];

    /**
     * Helper function to set distillation details in Vuex state.
     * @function setDistillationDetails
     * @param {GetDistillationById} details - The distillation details object.
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
     * Helper function to set plant details in Vuex state.
     * @function setPlantDetails
     * @param {NormalizedPlantById} details - The plant details object.
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
     * Fetches the plant details by plant ID from GraphQL API.
     * @async
     * @function fetchPlantDetails
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
        setPlantDetails(plantDetails);
      } catch (error: any) {
        await handleUserError(error);
      }
    };

    /**
     * Fetches the distillation details by distillation ID from GraphQL API.
     * @async
     * @function fetchDistillationDetails
     * @returns {Promise<void>}
     */
    const fetchDistillationDetails = async (): Promise<void> => {
      try {
        const { data } = await apolloClient.query({
          query: GET_DISTILLATION_BY_ID,
          variables: { id: distillationId.value, formatDates: true },
        });
        const distillationDetails = data.getDistillationById;
        setDistillationDetails(distillationDetails);
        await fetchPlantDetails(distillationDetails.choosedPlant.id);
      } catch (error: any) {
        await handleUserError(error);
      }
    };

    // Fetch distillation details when the component is mounted
    onMounted(() => {
      fetchDistillationDetails();
    });

    /**
     * Handles the submission of the results form, validates, and sends data to the backend.
     * @async
     * @function submitResultsForm
     * @returns {Promise<void>}
     * @throws {Error} Throws an error if the form submission fails.
     */
    const submitResultsForm = async (): Promise<void> => {
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
        return;
      }
    };

    /**
     * Deletes the distillation from the database by its ID.
     * @async
     * @function removeDistillation
     * @returns {Promise<void>}
     * @throws {Error} Throws an error if the deletion fails.
     */
    const removeDistillation = async (): Promise<void> => {
      try {
        await apolloClient.mutate({
          mutation: DELETE_DISTILLATION,
          variables: { id: distillationId.value },
        });
      } catch (error: any) {
        await handleUserError(error);
        throw error;
      }
    };

    /**
     * Saves the results and navigates to the distillation archives page.
     * @async
     * @function saveResults
     * @returns {Promise<void>}
     */
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
        Sentry.captureException(error);
        console.error("Error in saveResults:", error);
      }
    };

    // Navigation guard that resets the form data in Vuex state and local storage before navigating away from the route.
    onBeforeRouteLeave(async (to, from, next) => {
      if (to.path !== from.path) {
        store.dispatch("results/setResultsForm");
        await nextTick();
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
};
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
