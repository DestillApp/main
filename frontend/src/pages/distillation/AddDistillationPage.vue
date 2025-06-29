<template>
  <base-card class="add-distillation">
    <!-- Distillation form -->
    <form @submit.prevent="saveDistillation" class="add-distillation__form">
      <!-- Title for the plant information form -->
      <h3 class="add-distillation__form-title">
        Informacje o procesie destylacji
      </h3>
      <!-- Distillation plan component -->
      <distillation-plant
        :isFormValid="isFormValid"
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
      <base-button class="add-distillation__form-button" type="submit"
        >Zapisz</base-button
      >
      <!-- Button to submit and go to the distillation results form -->
      <base-button @click="saveDistillationAddResults"
        >Zapisz i dodaj wyniki</base-button
      >
    </form>
  </base-card>
</template>

<script lang="ts">
import DistillationPlant from "../../components/destillation/DistillationPlant.vue";
import DistillationProcess from "../../components/destillation/DistillationProcess.vue";
import DistillationData from "../../components/destillation/DistillationData.vue";
import { DistillationForm } from "@/types/forms/distillationForm";
import { distillationFormValidation } from "@/helpers/formsValidation";
import { initialDistillationForm } from "@/helpers/formsInitialState";
import { mapDistillationForm } from "@/helpers/formsMapping";
import { handleUserError } from "@/helpers/errorHandling";
import { comingFromRouteGuard } from "@/helpers/routerGuards";
import { CREATE_DISTILLATION } from "@/graphql/mutations/distillation";
import { UPDATE_AVAILABLE_WEIGHT } from "@/graphql/mutations/plant";
import { useStore } from "@/store/useStore";
import { ref, computed, onMounted, nextTick } from "vue";
import { useMutation } from "@vue/apollo-composable";
import {
  onBeforeRouteLeave,
  useRouter,
  useRoute,
  RouteLocationNormalizedLoaded,
} from "vue-router";
import * as Sentry from "@sentry/vue";

/**
 * @component AddDistillationPage
 * @description This component renders a distillation form and handles sending distillation data, updating available plant weight, and navigation after submission.
 * @see saveDistillation
 * @see saveDistillationAddResults
 * @see submitDistillationForm
 * @see changeAvailableWeight
 */

export default {
  name: "AddDistillationPage",
  components: { DistillationPlant, DistillationProcess, DistillationData },
  beforeRouteEnter: comingFromRouteGuard,
  setup() {
    // Vuex store instance
    const store = useStore();

    // Computed property to get plant form data from Vuex store
    const distillationForm = computed<DistillationForm>(
      () => store.getters["distillation/distillationForm"]
    );

    // Reference for the created distillation id
    const distillId = ref<string | null>(null);

    // Reactive reference to track form validity
    const isFormValid = ref<boolean>(false);
    // Reactive reference to track if the form was submitted
    const wasSubmitted = ref<boolean>(false);

    // Router object for navigation
    const router = useRouter();
    const route = useRoute();

    // Lifecycle hook to reset form validity on component mount
    onMounted(() => {
      isFormValid.value = false;
      wasSubmitted.value = false;
    });

    // Using GraphQL mutation for creating a new distillation
    const { mutate: createDistillation } = useMutation(CREATE_DISTILLATION);

    // Using GraphQL mutation for updating the available weight
    const { mutate: updateAvailableWeight } = useMutation(
      UPDATE_AVAILABLE_WEIGHT
    );

    /**
     * Handles the submission of the distillation form, validates, and sends data to the backend.
     * @async
     * @function submitDistillationForm
     * @returns {Promise<void>}
     * @throws {Error} Throws an error if the form submission fails.
     */
    const submitDistillationForm = async (): Promise<void> => {
      wasSubmitted.value = true;
      isFormValid.value = distillationFormValidation(distillationForm.value);
      if (isFormValid.value) {
        try {
          const distillationFormData = mapDistillationForm(
            distillationForm.value
          );
          const result = await createDistillation({
            input: distillationFormData,
          });
          if (result?.data) {
            distillId.value = result.data.createDistillation._id;
          }
        } catch (error: any) {
          await handleUserError(error);
          wasSubmitted.value = false;
        }
      } else {
        return;
      }
    };

    /**
     * Updates the available weight for the selected plant after distillation.
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
        let newWeight = availableWeight - weightForDistillation;
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
     * Saves the distillation, updates available weight, and navigates to the in-progress distillations page.
     * @async
     * @function saveDistillation
     * @returns {Promise<void>}
     */
    const saveDistillation = async (): Promise<void> => {
      try {
        await submitDistillationForm();
        if (!isFormValid.value) {
          return;
        } else {
          await changeAvailableWeight();
          router.push({
            name: "InProgressDistillationsPage",
            params: { page: 1 },
          });
        }
      } catch (error) {
        Sentry.captureException(error);
        return;
      }
    };

    /**
     * Saves the distillation, updates available weight, and navigates to the add results page.
     * @async
     * @function saveDistillationAddResults
     * @returns {Promise<void>}
     */
    const saveDistillationAddResults = async (): Promise<void> => {
      try {
        await submitDistillationForm();
        if (!isFormValid.value) {
          return;
        } else {
          await changeAvailableWeight();
          router.push({
            name: "AddResultsPage",
            params: { distillId: distillId.value },
          });
        }
      } catch (error) {
        Sentry.captureException(error);
        return;
      }
    };

    // Navigation guard that resets the form data in vuex state and local storage before navigating away from the route.
    onBeforeRouteLeave(async (to, from, next) => {
      if (to.path !== from.path) {
        // Dispatch Vuex action to reset the form in store
        store.dispatch("distillation/setDistillationForm");
        // Wait for the next tick to ensure state updates are complete
        await nextTick();
        // Removing distillation form value from local storage by its key
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
      saveDistillation,
      saveDistillationAddResults,
      isFormValid,
      wasSubmitted,
    };
  },
};
</script>

<style scoped>
.add-distillation {
  margin-top: 50px;
  margin-bottom: 100px;
}

.add-distillation__form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.add-distillation__form-title {
  margin-bottom: 30px;
}

.add-distillation__form-button {
  margin-top: 20px;
}
</style>
