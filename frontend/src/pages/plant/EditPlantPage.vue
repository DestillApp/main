<template>
  <base-card>
    <!-- Loading spinner while data is being fetched -->
    <v-progress-circular
      v-if="isLoading"
      class="edit-plant__spinner"
      color="var(--secondary-color)"
      :size="60"
      :width="6"
      indeterminate
    ></v-progress-circular>
    <!-- Plant form -->
    <form
      v-if="!isLoading"
      @submit.prevent="editPlant"
      class="edit-plant__form"
    >
      <!-- Title for the plant form -->
      <h3 class="edit-plant__form-title">Edytuj informacje o surowcu</h3>
      <!-- Plant identification component -->
      <plant-identification
        :isFormValid="isFormValid"
        :wasSubmitted="wasSubmitted"
      ></plant-identification>
      <!-- Plant origin component -->
      <plant-origin
        :isFormValid="isFormValid"
        :isResetting="isResetting"
        :wasSubmitted="wasSubmitted"
      ></plant-origin>
      <!-- Plant data component -->
      <plant-data
        :isFormValid="isFormValid"
        :isResetting="isResetting"
        :isEditing="isEditing"
        :wasSubmitted="wasSubmitted"
      ></plant-data>
      <!-- Button to submit the plant form -->
      <base-button type="submit">Edytuj</base-button>
      <!-- Button to submit and go to the distillation form -->
      <base-button @click="editPlantAndDistill"
        >Edytuj i dodaj destylację</base-button
      >
    </form>
  </base-card>
</template>

<script lang="ts">
import PlantIdentification from "@/components/plant/form/PlantIdentification.vue";
import PlantOrigin from "@/components/plant/form/PlantOrigin.vue";
import PlantData from "@/components/plant/form/PlantData.vue";

import {
  PlantForm,
  GetPlantById,
  NormalizedPlantById,
} from "@/types/forms/plantForm";

import { initialPlantForm } from "@/helpers/formsInitialState";
import { plantFormValidation } from "@/helpers/formsValidation";
import { mapPlantForm } from "@/helpers/formsMapping";
import { normalizeSelectedFields } from "@/helpers/formsNormalize";

import { UPDATE_PLANT } from "@/graphql/mutations/plant.js";
import { GET_PLANT_BY_ID } from "@/graphql/queries/plant";

import { useStore } from "@/store/useStore";
import store from "@/store/index";
import { defineComponent, computed, ref, onMounted, nextTick } from "vue";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import { useApolloClient } from "@vue/apollo-composable";
import { useMutation } from "@vue/apollo-composable";

/**
 * @component EditPlantPage
 * @description This component renders a plant form and handles sending plant data.
 * @see plantFormValidation
 * @see submitPlantForm
 * @see editPlant
 * @see editPlantAndDistill
 */

export default defineComponent({
  name: "EditPlantPage",
  components: { PlantIdentification, PlantOrigin, PlantData },

  //Navigation guard that handles the logic before navigating to this route
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
    // Route object to access route params
    const route = useRoute();

    // Reactive reference to store the plant ID and page number from the route
    const plantId = ref<string | string[]>(route.params.id);
    const page = ref<number>(Number(route.params.page));

    // Computed property to get plant form data from Vuex store
    const plantForm = computed<PlantForm>(
      () => store.getters["plant/plantForm"]
    );

    // Reactive reference to store fetched plant details
    const plantDetails = ref<NormalizedPlantById | null>(null);
    // Reactive reference to track form validity
    const isFormValid = ref<boolean>(false);
    // Reactive reference for loading state
    const isLoading = ref<boolean>(true);
    //Reactive reference to track when component is resetting
    const isResetting = ref<boolean>(false);
    //Reactive reference to pass that this is a edit form
    const isEditing = ref<boolean>(true);
    const wasSubmitted = ref<boolean>(false);

    // Using GraphQL mutation for creating a new plant
    const { mutate: updatePlant } = useMutation(UPDATE_PLANT);

    const fieldsToNormalize: (keyof GetPlantById)[] = [
      "harvestDate",
      "harvestStartTime",
      "harvestEndTime",
      "countryOfOrigin",
      "plantBuyDate",
      "plantProducer",
    ];

    /**
     * @async
     * @function fetchPlantDetails
     * @description Fetches the plant details by plant ID from GraphQL API.
     * @returns {Promise<void>}
     */
    const fetchPlantDetails = async (): Promise<void> => {
      try {
        // Set loading to true while fetching the data
        isLoading.value = true;
        // Make a query to fetch plant details by plant ID
        const { data } = await apolloClient.query({
          query: GET_PLANT_BY_ID,
          variables: { id: plantId.value, formatDates: false },
          fetchPolicy: "network-only",
        });
        // Store the fetched plant details in the plantDetails reference
        plantDetails.value = normalizeSelectedFields(
          data.getPlantById,
          fieldsToNormalize
        );
      } catch (error) {
        if (error.message === "Unauthorized") {
          await store.dispatch("auth/logout");
          router.push("/login");
        }
        console.error("Failed to get plant details:", error);
        plantDetails.value = null;
      } finally {
        // Once the process is complete, set loading to false
        isLoading.value = false;
      }
    };

    /**
     * @function setValue
     * @description Dispatches Vuex action to set a specific plant form field value.
     * @param {String} input - The form field to be updated.
     * @param {*} value - The new value for the form field.
     */
    const setValue = (
      input: keyof NormalizedPlantById,
      value: string | null | number
    ): void => {
      store.dispatch("plant/setValue", { input: input, value: value });
    };

    // Lifecycle hook to reset form validity, fetch Plant details by id and set plant details in vuex store and local storage on component mount
    onMounted(async () => {
      // Reset form validity on mount
      isFormValid.value = false;
      // If user comes from another route, fetch plant details and set plant form fields in vuex state basen on the fetched plant details
      if (comingFromRoute.value) {
        await fetchPlantDetails();
        if (plantDetails.value) {
          Object.entries(plantDetails.value).forEach(([key, value]) => {
            setValue(key as keyof typeof plantDetails.value, value);
          });
        }
        store.dispatch("plant/setHarvestRange");
      } else {
        // If not coming from another route, set loading to false
        isLoading.value = false;
      }
    });

    /**
     * @async
     * @function submitPlantForm
     * @description Function to handle the submission of the plant form.
     * @returns {Promise<void>} Resolves when the form submission process is complete.
     * @throws {Error} Throws an error if the form submission fails.
     */
    const submitPlantForm = async (): Promise<void> => {
      // Validate the form
      isFormValid.value = plantFormValidation(plantForm.value);

      if (isFormValid.value) {
        try {
          const plantFormData = mapPlantForm(plantForm.value);

          // Send the GraphQL mutation to edit the exsisting plant
          await updatePlant({
            id: plantId.value,
            plantInput: plantFormData,
          });
        } catch (error) {
          if (error.message === "Unauthorized") {
            await store.dispatch("auth/logout");
            router.push("/login");
          }
          console.error("Error submitting form", error);
        }
      } else {
        console.log(isFormValid.value);
        console.log("invalid form!");
        return;
      }
    };

    /**
     * @function editPlant
     * @description Function to edit an existing plant and navigate back to the plant list.
     */
    const editPlant = async (): Promise<void> => {
      try {
        // Submit the plant form
        await submitPlantForm();
        if (!isFormValid.value) {
          return;
        } else {
          // If valid, navigate back to the plant list page
          router.push({ name: "PlantListPage", params: { page: page.value } });
        }
      } catch (error) {
        return;
      }
    };

    /**
     * @function editPlantAndDistill
     * @description Function to edit an existing plant and navigate to the add distillation page.
     */
    const editPlantAndDistill = async (): Promise<void> => {
      try {
        // Submit the plant form
        await submitPlantForm();
        if (!isFormValid.value) {
          return;
        } else {
          // If valid, navigate back to the add distillation page
          router.push({
            name: "AddDistillationPage",
            params: { id: plantId.value },
          });
        }
      } catch (error) {
        return;
      }
    };

    //Navigation guard that reset the form data in vuex state and local storage before navigating away from the route.
    onBeforeRouteLeave(async (to, from, next) => {
      if (to.path !== from.path) {
        isResetting.value = true;
        // Dispatch Vuex action to reset the form in store
        store.dispatch("plant/setPlantForm");
        // Wait for the next tick to ensure state updates are complete
        await nextTick();
        // Removing plant form value from local storage by its key
        for (const key in initialPlantForm) {
          localStorage.removeItem(key);
        }
        isResetting.value = false;
      }
      next();
    });

    return {
      editPlant,
      editPlantAndDistill,
      isFormValid,
      isLoading,
      isResetting,
      isEditing,
      wasSubmitted,
    };
  },
});
</script>

<style scoped>
.edit-plant__spinner {
  margin-bottom: 40vh;
  margin-top: 10vh;
}

.edit-plant__form-title {
  margin-bottom: 30px;
}

.edit-plant__form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
