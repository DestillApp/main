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
 * @module EditArchiveDistillationPage
 * @description This component renders a distillation form and handles sending distillation data.
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

    // Reactive reference to store the distillation ID and page number from the route
    const archiveId = ref<string | string[]>(route.params.archiveId);
    // const page = ref(Number(route.params.page));

    // Computed property to get distillation form data from Vuex store
    const distillationForm = computed<ResultsForm>(
      () => store.getters["results/resultsForm"]
    );

    // Reactive reference to store fetched distillation details
    const distillationDetails = ref<DistillationArchive | null>(null);

    // Reactive reference to track form validity
    const isFormValid = ref<boolean>(false);
    // Reactive reference for loading state
    const isLoading = ref<boolean>(true);
    // Reactive reference to pass that this is an edit form
    const isEditing = ref<boolean>(true);

    const isResultsForm = ref<boolean>(true);

    const wasSubmitted = ref<boolean>(false);

    // Computed property to get the value from Vuex store
    const comingFromRoute = computed<boolean>(
      () => store.getters.comingFromRoute
    );

    const fieldsToNormalize: (keyof GetPlantById)[] = [
      "harvestDate",
      "harvestStartTime",
      "harvestEndTime",
      "countryOfOrigin",
      "plantBuyDate",
      "plantProducer",
    ];

    const fetchDistillationDetails = async (): Promise<void> => {
      try {
        isLoading.value = true;
        // Make a query to fetch distillation details by distillation ID from archive
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

        console.log("distillation details", distillationDetails.value);
      } catch (error: any) {
        await handleUserError(error);
        distillationDetails.value = null;
      } finally {
        // Once the process is complete, set loading to false
        isLoading.value = false;
      }
    };

    // Lifecycle hook to reset form validity on component mount
    onMounted(async () => {
      isFormValid.value = false;
      if (comingFromRoute.value) {
        await fetchDistillationDetails();
        if (distillationDetails.value) {
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

    // Using GraphQL mutation for updating the distillation archive
    const { mutate: updateDistillationArchive } = useMutation(
      UPDATE_DISTILLATION_ARCHIVE
    );

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
