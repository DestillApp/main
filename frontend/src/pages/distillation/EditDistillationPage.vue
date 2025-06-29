<template>
  <base-card>
    <!-- Loading spinner while data is being fetched -->
    <v-progress-circular
      v-if="isLoading"
      class="distillation__spinner"
      color="var(--secondary-color-distillation)"
      :size="60"
      :width="6"
      indeterminate
    ></v-progress-circular>
    <!-- Distillation form for editing -->
    <form
      v-if="!isLoading"
      @submit.prevent="editDistillation"
      class="distillation__form"
    >
      <!-- Title for the plant information form -->
      <h3 class="distillation__form-title">
        Edytuj informacje o procesie destylacji
      </h3>
      <!-- Distillation plan component -->
      <distillation-plant
        :isFormValid="isFormValid"
        :isEditing="isEditing"
        :wasSubmitted="wasSubmitted"
      ></distillation-plant>
      <!-- Distillation process component -->
      <distillation-process
        :isFormValid="isFormValid"
        :wasSubmitted="wasSubmitted"
      ></distillation-process>
      <!-- Distillation data component -->
      <distillation-data
        :isFormValid="isFormValid"
        :wasSubmitted="wasSubmitted"
      ></distillation-data>
      <!-- Button to submit the distilation form -->
      <base-button class="distillation__button" type="submit"
        >Edytuj</base-button
      >
      <!-- Button to submit and go to the distillation results form -->
      <base-button @click="editDistillationAddResults"
        >Edytuj i dodaj wyniki destylacji</base-button
      >
    </form>
  </base-card>
</template>

<script lang="ts">
import DistillationPlant from "../../components/destillation/DistillationPlant.vue";
import DistillationProcess from "../../components/destillation/DistillationProcess.vue";
import DistillationData from "../../components/destillation/DistillationData.vue";
import { distillationFormValidation } from "@/helpers/formsValidation";
import { initialDistillationForm } from "@/helpers/formsInitialState";
import { mapDistillationForm } from "@/helpers/formsMapping";
import { comingFromRouteGuard } from "@/helpers/routerGuards";
import { handleUserError } from "@/helpers/errorHandling";
import { GET_DISTILLATION_BY_ID } from "@/graphql/queries/distillation";
import { UPDATE_DISTILLATION } from "@/graphql/mutations/distillation";
import { UPDATE_AVAILABLE_WEIGHT } from "@/graphql/mutations/plant";
import {
  GetDistillationById,
  DistillationForm,
} from "@/types/forms/distillationForm";
import { useStore } from "@/store/useStore";
import { ref, computed, onMounted, nextTick } from "vue";
import { useMutation } from "@vue/apollo-composable";
import { onBeforeRouteLeave, useRouter, useRoute } from "vue-router";
import { useApolloClient } from "@vue/apollo-composable";
import * as Sentry from "@sentry/vue";

/**
 * @component EditDistillationPage
 * @description This component renders a distillation form for editing an existing distillation, handles fetching, updating, and saving distillation data, and manages available plant weight.
 * @see fetchDistillationDetails
 * @see editDistillationForm
 * @see changeAvailableWeight
 * @see editDistillation
 * @see editDistillationAddResults
 */

/**
 * Interface for distillation values used in form mapping.
 * @interface
 */
interface DistillationValues
  extends Omit<
    GetDistillationById,
    "_id" | "choosedPlant" | "distillationTime"
  > {}

export default {
  name: "EditDistillationPage",
  components: { DistillationPlant, DistillationProcess, DistillationData },
  beforeRouteEnter: comingFromRouteGuard,
  setup() {
    const { resolveClient } = useApolloClient();
    const apolloClient = resolveClient();

    // Vuex store instance
    const store = useStore();

    // Computed property for navigation state
    const comingFromRoute = computed<boolean>(
      () => store.getters.comingFromRoute
    );

    // Router and route objects
    const router = useRouter();
    const route = useRoute();

    // Reactive reference for distillation ID and page number from route
    const distillationId = ref<string | string[]>(route.params.distillId);
    const page = ref<number>(Number(route.params.page));

    // Computed property for distillation form data from Vuex store
    const distillationForm = computed<DistillationForm>(
      () => store.getters["distillation/distillationForm"]
    );

    // Reactive reference for fetched distillation details
    const distillationDetails = ref<GetDistillationById | null>(null);

    // Reactive reference for form validity
    const isFormValid = ref<boolean>(false);
    // Reactive reference for submission state
    const wasSubmitted = ref<boolean>(false);
    // Reactive reference for loading state
    const isLoading = ref<boolean>(true);
    // Reactive reference to indicate edit mode
    const isEditing = ref<boolean>(true);

    /**
     * Fetches distillation details by ID from GraphQL API.
     * @async
     * @function fetchDistillationDetails
     * @returns {Promise<void>}
     */
    const fetchDistillationDetails = async (): Promise<void> => {
      try {
        isLoading.value = true;
        const { data } = await apolloClient.query({
          query: GET_DISTILLATION_BY_ID,
          variables: { id: distillationId.value, formatDates: false },
        });
        distillationDetails.value = data.getDistillationById;
      } catch (error: any) {
        await handleUserError(error);
        distillationDetails.value = null;
      } finally {
        isLoading.value = false;
      }
    };

    // Lifecycle hook to reset form validity and fetch details on mount
    onMounted(async () => {
      isFormValid.value = false;
      if (comingFromRoute.value) {
        await fetchDistillationDetails();
        if (distillationDetails.value) {
          const keys = Object.keys(distillationDetails.value).filter(
            (key) =>
              key !== "_id" &&
              key !== "choosedPlant" &&
              key !== "distillationTime"
          ) as (keyof DistillationValues)[];
          for (const key of keys) {
            store.dispatch("distillation/setValue", {
              input: key,
              value: distillationDetails.value[key],
            });
          }
          store.dispatch("distillation/setDistillationTime", {
            key: "distillationHours",
            value: distillationDetails.value.distillationTime.distillationHours,
          });
          store.dispatch("distillation/setDistillationTime", {
            key: "distillationMinutes",
            value:
              distillationDetails.value.distillationTime.distillationMinutes,
          });
        }
      } else {
        isLoading.value = false;
      }
    });

    // GraphQL mutation for updating distillation
    const { mutate: updateDistillation } = useMutation(UPDATE_DISTILLATION);

    /**
     * Handles the submission of the distillation form for editing.
     * @async
     * @function editDistillationForm
     * @returns {Promise<void>}
     * @throws {Error} Throws an error if the form submission fails.
     */
    const editDistillationForm = async (): Promise<void> => {
      wasSubmitted.value = true;
      isFormValid.value = distillationFormValidation(distillationForm.value);
      if (isFormValid.value) {
        try {
          const distillationFormData = mapDistillationForm(
            distillationForm.value
          );
          await updateDistillation({
            id: distillationId.value,
            input: distillationFormData,
          });
        } catch (error: any) {
          await handleUserError(error);
          wasSubmitted.value = true;
        }
      } else {
        return;
      }
    };

    // GraphQL mutation for updating available plant weight
    const { mutate: updateAvailableWeight } = useMutation(
      UPDATE_AVAILABLE_WEIGHT
    );

    /**
     * Updates the available weight for the selected plant after editing distillation.
     * @async
     * @function changeAvailableWeight
     * @returns {Promise<void>}
     */
    const changeAvailableWeight = async (): Promise<void> => {
      try {
        const availableWeight =
          distillationForm.value.choosedPlant.availableWeight ?? 0;
        const weightForDistillation =
          distillationForm.value.weightForDistillation ?? 0;
        const initialWeightForDistillation =
          distillationForm.value.initialWeightForDistillation ?? 0;

        let newWeight =
          availableWeight +
          initialWeightForDistillation -
          weightForDistillation;
        newWeight = parseFloat(newWeight.toFixed(1));

        await updateAvailableWeight({
          input: {
            id: route.params.id as string,
            availableWeight: newWeight,
          },
        });
      } catch (error: any) {
        await handleUserError(error);
      }
    };

    /**
     * Submits the edit form, updates available weight, and navigates to the in-progress distillations page.
     * @async
     * @function editDistillation
     * @returns {Promise<void>}
     */
    const editDistillation = async (): Promise<void> => {
      try {
        await editDistillationForm();
        if (!isFormValid.value) {
          return;
        } else {
          await changeAvailableWeight();
          router.push({
            name: "InProgressDistillationsPage",
            params: { page: page.value },
          });
        }
      } catch (error) {
        Sentry.captureException(error);
        return;
      }
    };

    /**
     * Submits the edit form, updates available weight, and navigates to the add results page.
     * @async
     * @function editDistillationAddResults
     * @returns {Promise<void>}
     */
    const editDistillationAddResults = async (): Promise<void> => {
      try {
        await editDistillationForm();
        if (!isFormValid.value) {
          return;
        } else {
          await changeAvailableWeight();
          router.push({ name: "AddResultsPage" });
        }
      } catch (error) {
        Sentry.captureException(error);
        return;
      }
    };

    // Navigation guard to reset form data in Vuex and local storage before leaving the route
    onBeforeRouteLeave(async (to, from, next) => {
      if (to.path !== from.path) {
        store.dispatch("distillation/setDistillationForm");
        await nextTick();
        for (const key in initialDistillationForm) {
          localStorage.removeItem(key);
        }
        for (const key in initialDistillationForm.choosedPlant) {
          localStorage.removeItem(key);
        }
        for (const key in initialDistillationForm.distillationTime) {
          localStorage.removeItem(key);
        }
      }
      next();
    });

    return {
      editDistillation,
      editDistillationAddResults,
      distillationDetails,
      isFormValid,
      wasSubmitted,
      isLoading,
      isEditing,
    };
  },
};
</script>

<style scoped>
.distillation__form-title {
  margin-bottom: 30px;
}

.distillation__form {
  display: flex;
  flex-direction: column;
}

.distillation__button {
  margin-bottom: 20px;
}
</style>
