<template>
  <base-card>
    <!-- Loading spinner while data is being fetched -->
    <v-progress-circular
      v-if="isLoading"
      class="edit-archive-distillation__spinner"
      color="var(--secondary-color-results)"
      :size="60"
      :width="6"
      indeterminate
    ></v-progress-circular>
    <!-- Distillation form -->
    <form
      v-if="!isLoading"
      @submit.prevent="editDistillationArchive"
      class="edit-archive-distillation__form"
    >
      <!-- Title for the plant information form -->
      <h3 class="edit-archive-distillation__form-title">
        Edytuj informacje o procesie destylacji i wynikach
      </h3>
      <!-- Distillation plan component -->
      <results-plant
        :isFormValid="isFormValid"
        :isEditing="isEditing"
      ></results-plant>
      <!-- Distillation process component -->
      <distillation-process
        :isFormValid="isFormValid"
        :isEditing="isEditing"
        :wasSubmitted="wasSubmitted"
      ></distillation-process>
      <!-- Distillation data component -->
      <distillation-data
        :isFormValid="isFormValid"
        :isEditing="isEditing"
        :wasSubmitted="wasSubmitted"
      ></distillation-data>
      <div class="edit-archive-distillation__results-components">
        <!-- Results data component -->
        <results-data
          :isFormValid="isFormValid"
          :isEditing="isEditing"
          :wasSubmitted="wasSubmitted"
        ></results-data>
        <!-- Results descriptions component -->
        <results-descriptions
          :isFormValid="isFormValid"
          :wasSubmitted="wasSubmitted"
        ></results-descriptions>
      </div>
      <!-- Button to submit the distilation form -->
      <base-button class="edit-archive-distillation__button" type="submit"
        >Edytuj</base-button
      >
    </form>
  </base-card>
</template>

<script lang="ts">
import ResultsPlant from "../../components/results/ResultsPlant.vue";
import DistillationProcess from "../../components/destillation/DistillationProcess.vue";
import DistillationData from "../../components/destillation/DistillationData.vue";
import {
  ResultsForm,
  DistillationArchive,
  ResultsDistillation,
  DistillationArchivePlant,
} from "@/types/forms/resultsForm";
import { GetPlantById } from "@/types/forms/plantForm";
import { DistillationTime } from "@/types/forms/distillationForm";
import ResultsData from "@/components/results/ResultsData.vue";
import ResultsDescriptions from "@/components/results/ResultsDescriptions.vue";
import { editArchiveDistillationFormValidation } from "@/helpers/formsValidation";
import { initialResultsForm } from "@/helpers/formsInitialState";
import { GET_ARCHIVE_DISTILLATION_BY_ID } from "@/graphql/queries/results";
import { UPDATE_DISTILLATION_ARCHIVE } from "@/graphql/mutations/results";
import { normalizeSelectedFields } from "@/helpers/formsNormalize";
import { handleUserError } from "@/helpers/errorHandling";
import { comingFromRouteGuard } from "@/helpers/routerGuards";

import { useStore } from "@/store/useStore";
import { ref, computed, onMounted, nextTick } from "vue";
import { useApolloClient, useMutation } from "@vue/apollo-composable";
import { useRoute, onBeforeRouteLeave, useRouter } from "vue-router";
import { mapResultsForm } from "@/helpers/formsMapping";
import * as Sentry from "@sentry/vue";

/**
 * @component EditArchiveDistillationPage
 * @description This component renders a distillation archive edit form and handles updating distillation data and results.
 * @see fetchDistillationDetails
 * @see editDistillationArchiveForm
 * @see editDistillationArchive
 */

/**
 * Interface for results values excluding certain fields from DistillationArchive.
 * @interface
 */
interface ResultsValues
  extends Omit<
    DistillationArchive,
    "_id" | "distilledPlant" | "distillationData"
  > {}

export default {
  name: "EditArchiveDistillationPage",
  components: {
    ResultsPlant,
    DistillationProcess,
    DistillationData,
    ResultsData,
    ResultsDescriptions,
  },
  beforeRouteEnter: comingFromRouteGuard,
  setup() {
    const { resolveClient } = useApolloClient();
    const apolloClient = resolveClient();
    // Vuex store instance
    const store = useStore();

    // Router object for navigation
    const router = useRouter();
    const route = useRoute();

    // Archive distillation id from route
    const archiveId = ref<string | string[]>(route.params.archiveId);

    // Computed property for distillation form from Vuex store
    const distillationForm = computed<ResultsForm>(
      () => store.getters["results/resultsForm"]
    );

    // Distillation details object
    const distillationDetails = ref<DistillationArchive | null>(null);

    // Ref for form validity
    const isFormValid = ref<boolean>(false);
    // Ref for loading state
    const isLoading = ref<boolean>(true);
    // Ref to indicate edit mode
    const isEditing = ref<boolean>(true);
    // Ref to indicate results form
    const isResultsForm = ref<boolean>(true);
    // Ref for submission state
    const wasSubmitted = ref<boolean>(false);

    // Computed property for route guard state
    const comingFromRoute = computed<boolean>(
      () => store.getters.comingFromRoute
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
     * Fetches the archive distillation details by ID from GraphQL API.
     * @async
     * @function fetchDistillationDetails
     * @returns {Promise<void>}
     */
    const fetchDistillationDetails = async (): Promise<void> => {
      try {
        isLoading.value = true;
        const { data } = await apolloClient.query({
          query: GET_ARCHIVE_DISTILLATION_BY_ID,
          variables: { id: archiveId.value, formatDistillDate: false },
        });
        const archive = data.getArchiveDistillationById;

        distillationDetails.value = {
          ...archive,
          distilledPlant: normalizeSelectedFields(
            archive.distilledPlant,
            fieldsToNormalize
          ),
        };
      } catch (error: any) {
        await handleUserError(error);
        distillationDetails.value = null;
      } finally {
        // Once the process is complete, set loading to false
        isLoading.value = false;
      }
    };

    // Lifecycle hook to reset form validity and fetch details on mount
    onMounted(async () => {
      isFormValid.value = false;
      if (comingFromRoute.value) {
        await fetchDistillationDetails();
        if (distillationDetails.value) {
          // Set results values in store
          const resultsKeys = Object.keys(distillationDetails.value).filter(
            (key) =>
              key !== "_id" &&
              key !== "distilledPlant" &&
              key !== "distillationData" &&
              key !== "__typename"
          ) as (keyof ResultsValues)[];
          for (const key of resultsKeys) {
            store.dispatch("results/setValue", {
              input: key,
              value: distillationDetails.value[key],
            });
          }
          // Set distillation data in store
          const distilationKeys = Object.keys(
            distillationDetails.value.distillationData
          ).filter(
            (key) => key !== "distillationTime" && key !== "__typename"
          ) as (keyof ResultsDistillation)[];
          for (const key of distilationKeys) {
            store.dispatch("results/setDistillationDataValue", {
              input: key,
              value: distillationDetails.value.distillationData[key],
            });
          }
          // Set plant data in store
          const plantKeys = Object.keys(
            distillationDetails.value.distilledPlant
          ).filter(
            (key) => key !== "__typename"
          ) as (keyof DistillationArchivePlant)[];
          for (const key of plantKeys) {
            store.dispatch("results/setPlantDataValue", {
              input: key,
              value: distillationDetails.value.distilledPlant[key],
            });
          }
          // Set distillation time in store
          const timeKeys: (keyof DistillationTime)[] = [
            "distillationHours",
            "distillationMinutes",
          ];
          for (const key of timeKeys) {
            store.dispatch("results/setDistillationTime", {
              input: key,
              value:
                distillationDetails.value.distillationData.distillationTime[
                  key
                ],
            });
          }
        }
      } else {
        isLoading.value = false;
      }
    });

    // GraphQL mutation for updating the distillation archive
    const { mutate: updateDistillationArchive } = useMutation(
      UPDATE_DISTILLATION_ARCHIVE
    );

    /**
     * Handles the submission of the edit archive distillation form, validates, and sends data to the backend.
     * @async
     * @function editDistillationArchiveForm
     * @returns {Promise<void>}
     */
    const editDistillationArchiveForm = async (): Promise<void> => {
      wasSubmitted.value = true;
      isFormValid.value = editArchiveDistillationFormValidation(
        distillationForm.value
      );
      if (isFormValid.value) {
        try {
          const distillationArchiveFormData = mapResultsForm(
            distillationForm.value
          );
          await updateDistillationArchive({
            id: archiveId.value,
            input: distillationArchiveFormData,
          });
        } catch (error: any) {
          await handleUserError(error);
          wasSubmitted.value = false;
        }
      } else {
        return;
      }
    };

    /**
     * Edits the distillation archive and navigates to the distillation archives page.
     * @async
     * @function editDistillationArchive
     * @returns {Promise<void>}
     */
    const editDistillationArchive = async (): Promise<void> => {
      try {
        await editDistillationArchiveForm();
        if (!isFormValid.value) {
          return;
        } else {
          router.push({
            name: "DistillationArchivesPage",
            params: { page: 1 },
          });
        }
      } catch (error) {
        Sentry.captureException(error);
        console.error("Error editing distillation archive:", error);
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

    return {
      editDistillationArchive,
      distillationDetails,
      isFormValid,
      isLoading,
      isEditing,
      wasSubmitted,
      isResultsForm,
      comingFromRoute,
    };
  },
};
</script>

<style scoped>
.edit-archive-distillation__spinner {
  margin-block: 20px;
}

.edit-archive-distillation__form-title {
  margin-bottom: 30px;
}

.edit-archive-distillation__form {
  display: flex;
  flex-direction: column;
}

.edit-archive-distillation__results-components {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.edit-archive-distillation__button {
  margin-top: 30px;
  margin-bottom: 20px;
}
</style>
