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
    <!-- Distillation form -->
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
import store from "@/store/index";

import { GET_DISTILLATION_BY_ID } from "@/graphql/queries/distillation";
import { UPDATE_DISTILLATION } from "@/graphql/mutations/distillation.js";
import { UPDATE_AVAILABLE_WEIGHT } from "@/graphql/mutations/plant.js";

import {
  GetDistillationById,
  DistillationForm,
} from "@/types/forms/distillationForm";

import { useStore } from "vuex";
import { defineComponent, ref, computed, onMounted, nextTick } from "vue";
import { useMutation } from "@vue/apollo-composable";
import { onBeforeRouteLeave, useRouter, useRoute } from "vue-router";
import { useApolloClient } from "@vue/apollo-composable";

interface DistillationValues
  extends Omit<
    GetDistillationById,
    "_id" | "choosedPlant" | "distillationTime"
  > {}

/**
 * @module AddDistillationPage
 * @description This component renders a destillation form and handles sending destillation data.
 */
export default defineComponent({
  name: "EditDistillationPage",
  components: { DistillationPlant, DistillationProcess, DistillationData },

  // Navigation guard that handles the logic before navigating to this route
  beforeRouteEnter(to, from, next) {
    //check if the route comes from another named route, then update the store
    if (from && from.name) {
      store.dispatch("setComingFromRoute", true);
    } else {
      store.dispatch("setComingFromRoute", false);
    }
    next();
  },

  setup() {
    const { resolveClient } = useApolloClient();
    const apolloClient = resolveClient();
    // Vuex store instance
    const store = useStore();
    //Computed property to get the value from Vuex store
    const comingFromRoute = computed<boolean>(
      () => store.getters.comingFromRoute
    );

    // Router object for navigation
    const router = useRouter();
    const route = useRoute();

    // Reactive reference to store the plant ID and page number from the route
    const distillationId = ref<string | string[]>(route.params.distillId);
    const page = ref<number>(Number(route.params.page));

    // Computed property to get plant form data from Vuex store
    const distillationForm = computed<DistillationForm>(
      () => store.getters["distillation/distillationForm"]
    );

    // Reactive reference to store fetched distillation details
    const distillationDetails = ref<GetDistillationById | null>(null);

    // Reactive reference to track form validity
    const isFormValid = ref<boolean>(false);
    const wasSubmitted = ref<boolean>(false);
    // Reactive reference for loading state
    const isLoading = ref<boolean>(true);
    //Reactive reference to pass that this is a edit form
    const isEditing = ref<boolean>(true);

    const fetchDistillationDetails = async (): Promise<void> => {
      try {
        isLoading.value = true;
        // Make a query to fetch plant details by plant ID
        const { data } = await apolloClient.query({
          query: GET_DISTILLATION_BY_ID,
          variables: { id: distillationId.value, formatDates: false },
        });
        // Store the fetched plant details in the plantDetails reference
        distillationDetails.value = data.getDistillationById;
      } catch (error) {
        if (error.message === "Unauthorized") {
          await store.dispatch("auth/logout");
          router.push("/login");
        }
        console.error("Failed to get distillation details:", error);
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
        // If not coming from another route, set loading to false
        isLoading.value = false;
      }
    });

    // Using GraphQL mutation for creating a new plant
    const { mutate: updateDistillation } = useMutation(UPDATE_DISTILLATION);

    /**
     * @async
     * @function edittDistillationForm
     * @description Function to handle the submission of the distillation form.
     * @returns {Promise<void>} Resolves when the form submission process is complete.
     * @throws {Error} Throws an error if the form submission fails.
     */
    const editDistillationForm = async (): Promise<void> => {
      // Validate the form
      wasSubmitted.value = true;
      isFormValid.value = distillationFormValidation(distillationForm.value);
      if (isFormValid.value) {
        try {
          const distillationFormData = mapDistillationForm(
            distillationForm.value
          );

          // Send the GraphQL mutation to edit the exsisting distillation
          await updateDistillation({
            id: distillationId.value,
            input: distillationFormData,
          });
        } catch (error) {
          if (error.message === "Unauthorized") {
            await store.dispatch("auth/logout");
            router.push("/login");
          }
          console.error("Error editing form", error);
          wasSubmitted.value = true;
        }
      } else {
        console.log("invalid form!");
        return;
      }
    };

    // Using GraphQL mutation for updating the available weight
    const { mutate: updateAvailableWeight } = useMutation(
      UPDATE_AVAILABLE_WEIGHT
    );

    const changeAvailableWeight = async (): Promise<void> => {
      try {
        const availableWeight =
          distillationForm.value.choosedPlant.availableWeight ?? 0;
        const sanitizedWeightForDistillation =
          distillationForm.value.weightForDistillation ?? 0;
        const initialWeightForDistillation =
          distillationForm.value.initialWeightForDistillation ?? 0;

        let newWeight =
          availableWeight +
          initialWeightForDistillation -
          sanitizedWeightForDistillation;
        newWeight = parseFloat(newWeight.toFixed(1));

        await updateAvailableWeight({
          input: {
            id: route.params.id as string,
            availableWeight: newWeight,
          },
        });
      } catch (error) {
        if (error.message === "Unauthorized") {
          await store.dispatch("auth/logout");
          router.push("/login");
        }
        console.error("Error changing form available weight", error);
      }
    };

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
        return;
      }
    };

    const editDistillationAddResults = async (): Promise<void> => {
      try {
        // Submit the distillation form
        await editDistillationForm();
        if (!isFormValid.value) {
          return;
        } else {
          //change amount of available weight for distilled plant
          await changeAvailableWeight();
          // If valid, navigate to the add distillation page
          router.push({ name: "AddResultsPage" });
        }
      } catch (error) {
        return;
      }
    };

    //Navigation guard that reset the form data in vuex state and local storage before navigating away from the route.
    onBeforeRouteLeave(async (to, from, next) => {
      if (to.path !== from.path) {
        // Dispatch Vuex action to reset the form in store
        store.dispatch("distillation/setDistillationForm");
        // Wait for the next tick to ensure state updates are complete
        await nextTick();
        // // Removing distillation form value from local storage by its key
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
});
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
