// distillation types and distillation apparatous doesn't display in the autocomplete input
<template>
    <base-card>
        <!-- Loading spinner while data is being fetched -->
        <v-progress-circular v-if="isLoading" class="spinner" color="var(--secondary-color-distillation)" :size="60"
            :width="6" indeterminate></v-progress-circular>
        <!-- Distillation form -->
        <form v-if="!isLoading" @submit.prevent="editDistillation" class="distillation_form">
            <!-- Title for the plant information form -->
            <h3 class="form_title">Informacje o procesie destylacji</h3>
            <!-- Distillation plan component -->
            <distillation-plant :isFormValid="isFormValid" :isEditing="isEditing"></distillation-plant>
            <!-- Distillation process component -->
            <distillation-process :isFormValid="isFormValid"></distillation-process>
            <!-- Distillation data component -->
            <distillation-data :isFormValid="isFormValid"></distillation-data>
            <!-- Button to submit the distilation form -->
            <base-button class="button" type="submit">Edytuj</base-button>
            <!-- Button to submit and go to the distillation results form -->
            <base-button @click="editDistillationAddResults">Edytuj i dodaj wyniki destylacji</base-button>
        </form>
    </base-card>
</template>

<script>
import DistillationPlant from "../../components/destillation/DistillationPlant.vue";
import DistillationProcess from "../../components/destillation/DistillationProcess.vue";
import DistillationData from "../../components/destillation/DistillationData.vue";
import { distillationFormValidation } from "@/helpers/formsValidation";
import { initialDistillationForm } from "@/helpers/formsInitialState";
import store from "@/store/index";

import { GET_DISTILLATION_BY_ID } from "@/graphql/queries/distillation";
import { UPDATE_DISTILLATION } from "@/graphql/mutations/distillation.js";
import { UPDATE_AVAILABLE_WEIGHT } from "@/graphql/mutations/plant.js";

import { useStore } from "vuex";
import { ref, computed, onMounted, nextTick } from "vue";
import { useMutation } from "@vue/apollo-composable";
import { onBeforeRouteLeave, useRouter, useRoute } from "vue-router";
import { useApolloClient } from "@vue/apollo-composable";
import DOMPurify from "dompurify";

/**
 * @module AddDistillationPage
 * @description This component renders a destillation form and handles sending destillation data.
 */
export default {
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
    const comingFromRoute = computed(() => store.getters.comingFromRoute);

    // Router object for navigation
    const router = useRouter();
    const route = useRoute();

    // Reactive reference to store the plant ID and page number from the route
    const distillationId = ref(route.params.distillId);
    const page = ref(Number(route.params.page));

    // Computed property to get plant form data from Vuex store
    const distillationForm = computed(
      () => store.getters["distillation/distillationForm"]
    );

    // Reactive reference to store fetched distillation details
    const distillationDetails = ref(null);

    // Reactive reference to track form validity
    const isFormValid = ref(null);
    // Reactive reference for loading state
    const isLoading = ref(true);
    //Reactive reference to pass that this is a edit form
    const isEditing = ref(true);

    const fetchDistillationDetails = async () => {
      try {
        isLoading.value = true;
        // Make a query to fetch plant details by plant ID
        const { data } = await apolloClient.query({
          query: GET_DISTILLATION_BY_ID,
          variables: { id: distillationId.value, formatDates: false },
        });
        // Store the fetched plant details in the plantDetails reference
        distillationDetails.value = data.getDistillationById;
        console.log("edit distillation", distillationDetails.value);
      } catch (error) {
        console.error("Failed to get distillation details:", error);
        distillationDetails.value = null;
      } finally {
        // Once the process is complete, set loading to false
        isLoading.value = false;
      }
      };

    // Lifecycle hook to reset form validity on component mount
    onMounted(async () => {
      isFormValid.value = null;
        if (comingFromRoute.value) {
            await fetchDistillationDetails();
            store.dispatch("distillation/setValue", { input: "isPlantShredded", value: distillationDetails.value.isPlantShredded });
            store.dispatch("distillation/setValue", { input: "isPlantSoaked", value: distillationDetails.value.isPlantSoaked });
            store.dispatch("distillation/setValue", { input: "soakingTime", value: distillationDetails.value.soakingTime });
            store.dispatch("distillation/setValue", { input: "weightAfterSoaking", value: distillationDetails.value.weightAfterSoaking });
            store.dispatch("distillation/setValue", { input: "weightForDistillation", value: distillationDetails.value.weightForDistillation });
            store.dispatch("distillation/setValue", { input: "distillationApparatus", value: distillationDetails.value.distillationApparatus });
            store.dispatch("distillation/setValue", { input: "distillationDate", value: distillationDetails.value.distillationDate });
            store.dispatch("distillation/setValue", { input: "distillationType", value: distillationDetails.value.distillationType });
            store.dispatch("distillation/setValue", { input: "waterForDistillation", value: distillationDetails.value.waterForDistillation });
            store.dispatch("distillation/setDistillationTime", { key: "distillationHours", value: distillationDetails.value.distillationTime.distillationHours });
            store.dispatch("distillation/setDistillationTime", { key: "distillationMinutes", value: distillationDetails.value.distillationTime.distillationMinutess });
            console.log("form", distillationForm.value);
        } else {
          // If not coming from another route, set loading to false
          isLoading.value = false;
        }
    });

    // Using GraphQL mutation for creating a new plant
    const { mutate: updateDistillation } = useMutation(UPDATE_DISTILLATION);

    /**
     * @async
     * @function submitDistillationForm
     * @description Function to handle the submission of the distillation form.
     * @returns {Promise<void>} Resolves when the form submission process is complete.
     * @throws {Error} Throws an error if the form submission fails.
     */
    const editDistillationForm = async () => {
      // Validate the form
      isFormValid.value = distillationFormValidation(distillationForm.value);
      if (isFormValid.value) {
        try {
          const form = distillationForm.value;

          const distillationFormData = {
            choosedPlant: {
              id: DOMPurify.sanitize(form.choosedPlant.id),
              name: DOMPurify.sanitize(form.choosedPlant.name),
              part: DOMPurify.sanitize(form.choosedPlant.part),
              availableWeight: form.choosedPlant.availableWeight
                ? Number(DOMPurify.sanitize(form.choosedPlant.availableWeight))
                : null,
              harvestDate: DOMPurify.sanitize(form.choosedPlant.harvestDate),
              buyDate: DOMPurify.sanitize(form.choosedPlant.buyDate),
            },
            weightForDistillation: form.weightForDistillation
              ? Number(DOMPurify.sanitize(form.weightForDistillation))
              : null,
            isPlantSoaked: Boolean(DOMPurify.sanitize(form.isPlantSoaked)),
            soakingTime: form.soakingTime
              ? Number(DOMPurify.sanitize(form.soakingTime))
              : null,
            weightAfterSoaking: form.weightAfterSoaking
              ? Number(DOMPurify.sanitize(form.weightAfterSoaking))
              : null,
            isPlantShredded: Boolean(DOMPurify.sanitize(form.isPlantShredded)),
            distillationType: DOMPurify.sanitize(form.distillationType),
            distillationDate: DOMPurify.sanitize(form.distillationDate),
            distillationApparatus: DOMPurify.sanitize(
              form.distillationApparatus
            ),
            waterForDistillation: form.waterForDistillation
              ? Number(DOMPurify.sanitize(form.waterForDistillation))
              : null,
            distillationTime: {
              distillationHours: form.distillationTime.distillationHours
                ? Number(
                    DOMPurify.sanitize(form.distillationTime.distillationHours)
                  )
                : null,
              distillationMinutes: form.distillationTime.distillationMinutes
                ? Number(
                    DOMPurify.sanitize(
                      form.distillationTime.distillationMinutes
                    )
                  )
                : null,
            },
          };
          // Send the GraphQL mutation to edit the exsisting distillation
          const { data } = await updateDistillation({
            id: distillationId.value,
            input: distillationFormData,
          });
          console.log("Edited distillation:", data.updateDistillation);
        } catch (error) {
          console.log("error", isFormValid.value);
          console.error("Error editing form", error);
        }
      } else {
        console.log(isFormValid.value);
        console.log("invalid form!");
        return;
      }
    };

    // Using GraphQL mutation for updating the available weight
    const { mutate: updateAvailableWeight } = useMutation(
      UPDATE_AVAILABLE_WEIGHT
    );

    const changeAvailableWeight = async () => {
      try {
        console.log("ID", route.params.id);
        const newWeight =
          distillationForm.value.choosedPlant.availableWeight -
          distillationForm.value.weightForDistillation;
        const { data } = await updateAvailableWeight({
          input: {
            id: route.params.id,
            availableWeight: newWeight,
          },
        });
        console.log("Changed available weight:", data.updateAvailableWeight);
      } catch (error) {
        console.error("Error changing form available weight", error);
      }
    };

    const editDistillation = async () => {
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

    const editDistillationAddResults = async () => {
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
      isLoading,
      isEditing,
    };
  },
};
</script>

<style scoped>
.form_title {
  margin-bottom: 30px;
}

.distillation_form {
  display: flex;
  flex-direction: column;
}

.button {
  margin-bottom: 20px;
}
</style>