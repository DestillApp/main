// change docs
// problem with displaying countryOfOrigin after mounting the component!
<template>
  <base-card>
    <!-- Loading spinner while data is being fetched -->
    <v-progress-circular
      v-if="isLoading"
      class="spinner"
      color="var(--secondary-color)"
      :size="60"
      :width="6"
      indeterminate
    ></v-progress-circular>
    <!-- Plant form -->
    <form v-if="!isLoading" @submit.prevent="editPlant" class="plant_form">
      <!-- Title for the plant form -->
      <h3 class="form_title">Edytuj informacje o surowcu</h3>
      <!-- Plant identification component -->
      <plant-identification :isFormValid="isFormValid"></plant-identification>
      <!-- Plant origin component -->
      <plant-origin
        :isFormValid="isFormValid"
        :isResetting="isResetting"
      ></plant-origin>
      <!-- Plant data component -->
      <plant-data
        :isFormValid="isFormValid"
        :isResetting="isResetting"
        :isEditing="isEditing"
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

<script>
import PlantIdentification from "@/components/plant/form/PlantIdentification.vue";
import PlantOrigin from "@/components/plant/form/PlantOrigin.vue";
import PlantData from "@/components/plant/form/PlantData.vue";
import { initialPlantForm } from "@/helpers/formsInitialState";
import { plantFormValidation } from "@/helpers/formsValidation";

import { UPDATE_PLANT } from "@/graphql/mutations/plant.js";
import { GET_PLANT_BY_ID } from "@/graphql/queries/plant";

import { useStore } from "vuex";
import store from "@/store/index";
import { computed, ref, onMounted, nextTick } from "vue";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import { useApolloClient } from "@vue/apollo-composable";
import { useMutation } from "@vue/apollo-composable";
import DOMPurify from "dompurify";

/**
 * @component EditPlantPage
 * @description This component renders a plant form and handles sending plant data.
 * @see plantFormValidation
 * @see submitPlantForm
 * @see editPlant
 * @see editPlantAndDistill
 */

export default {
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
    const comingFromRoute = computed(() => store.getters.comingFromRoute);

    // Router object for navigation
    const router = useRouter();
    // Route object to access route params
    const route = useRoute();

    // Reactive reference to store the plant ID and page number from the route
    const plantId = ref(route.params.id);
    const page = ref(Number(route.params.page));

    // Computed property to get plant form data from Vuex store
    const plantForm = computed(() => store.getters["plant/plantForm"]);

    // Reactive reference to store fetched plant details
    const plantDetails = ref(null);
    // Reactive reference to track form validity
    const isFormValid = ref(null);
    // Reactive reference for loading state
    const isLoading = ref(true);
    //Reactive reference to track when component is resetting
    const isResetting = ref(false);
    //Reactive reference to pass that this is a edit form
    const isEditing = ref(true);

    // Using GraphQL mutation for creating a new plant
    const { mutate: updatePlant } = useMutation(UPDATE_PLANT);

    /**
     * @async
     * @function fetchPlantDetails
     * @description Fetches the plant details by plant ID from GraphQL API.
     * @returns {Promise<void>}
     */
    const fetchPlantDetails = async () => {
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
        plantDetails.value = data.getPlantById;
        console.log("edit plant", plantDetails.value);
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
    const setValue = (input, value) => {
      store.dispatch("plant/setValue", { input: input, value: value });
    };

    // Lifecycle hook to reset form validity, fetch Plant details by id and set plant details in vuex store and local storage on component mount
    onMounted(async () => {
      // Reset form validity on mount
      isFormValid.value = null;
      // If user comes from another route, fetch plant details and set plant form fields in vuex state basen on the fetched plant details
      if (comingFromRoute.value) {
        await fetchPlantDetails();
        setValue("plantName", plantDetails.value.plantName);
        setValue("plantPart", plantDetails.value.plantPart);
        setValue("plantOrigin", plantDetails.value.plantOrigin);
        setValue("plantBuyDate", plantDetails.value.plantBuyDate);
        setValue("plantProducer", plantDetails.value.plantProducer);
        setValue("countryOfOrigin", plantDetails.value.countryOfOrigin);
        setValue("harvestDate", plantDetails.value.harvestDate);
        setValue("harvestTemperature", plantDetails.value.harvestTemperature);
        setValue("harvestStartTime", plantDetails.value.harvestStartTime);
        setValue("harvestEndTime", plantDetails.value.harvestEndTime);
        setValue("plantWeight", plantDetails.value.plantWeight);
        setValue("availableWeight", plantDetails.value.availableWeight);
        setValue("plantState", plantDetails.value.plantState);
        setValue("dryingTime", plantDetails.value.dryingTime);
        setValue("plantAge", plantDetails.value.plantAge);
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
    const submitPlantForm = async () => {
      // Validate the form
      isFormValid.value = plantFormValidation(plantForm.value);

      if (isFormValid.value) {
        try {
          console.log("try", isFormValid.value);
          const form = plantForm.value;

          // Create an object with sanitized form data
          const plantFormData = {
            plantName: DOMPurify.sanitize(form.plantName),
            plantPart: DOMPurify.sanitize(form.plantPart),
            plantOrigin: DOMPurify.sanitize(form.plantOrigin),
            plantBuyDate: DOMPurify.sanitize(form.plantBuyDate),
            plantProducer: DOMPurify.sanitize(form.plantProducer),
            countryOfOrigin: DOMPurify.sanitize(form.countryOfOrigin),
            harvestDate: DOMPurify.sanitize(form.harvestDate),
            harvestTemperature: form.harvestTemperature
              ? Number(DOMPurify.sanitize(form.harvestTemperature))
              : null,
            harvestStartTime: DOMPurify.sanitize(form.harvestStartTime),
            harvestEndTime: DOMPurify.sanitize(form.harvestEndTime),
            plantWeight: form.plantWeight
              ? Number(DOMPurify.sanitize(form.plantWeight))
              : null,
            availableWeight: form.availableWeight
              ? Number(DOMPurify.sanitize(form.availableWeight))
              : null,
            plantState: DOMPurify.sanitize(form.plantState),
            dryingTime: form.dryingTime
              ? Number(DOMPurify.sanitize(form.dryingTime))
              : null,
            plantAge: form.plantAge
              ? Number(DOMPurify.sanitize(form.plantAge))
              : null,
          };

          // Send the GraphQL mutation to edit the exsisting plant
          const { data } = await updatePlant({
            id: plantId.value,
            plantInput: plantFormData,
          });
          console.log("Updated plant:", data.updatePlant);
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
    const editPlant = async () => {
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
    const editPlantAndDistill = async () => {
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
    };
  },
};
</script>

<style scoped>
.spinner {
  margin-bottom: 40vh;
  margin-top: 10vh;
}

.form_title {
  margin-bottom: 30px;
}

.plant_form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
