// plant api?????
// documentation without helpers and ui
// change docs
<template>
  <base-card>
    <!-- Plant form -->
    <form @submit.prevent="savePlant" class="plant_form">
      <!-- Title for the plant form -->
      <h3 class="form_title">Informacje o surowcu</h3>
      <!-- Plant identification component -->
      <plant-identification :isFormValid="isFormValid"></plant-identification>
      <!-- Plant origin component -->
      <plant-origin :isFormValid="isFormValid" :isResetting="isResetting"></plant-origin>
      <!-- Plant data component -->
      <plant-data :isFormValid="isFormValid" :isResetting="isResetting"></plant-data>
      <!-- Button to submit the plant form -->
      <base-button type="submit">Zapisz</base-button>
      <!-- Button to submit and go to the distillation form -->
      <base-button @click="savePlantAndDistill">Zapisz i dodaj destylację</base-button>
    </form>
  </base-card>
</template>

<script>
import PlantIdentification from "@/components/plant/form/PlantIdentification.vue";
import PlantOrigin from "@/components/plant/form/PlantOrigin.vue";
import PlantData from "@/components/plant/form/PlantData.vue";
import { initialPlantForm } from "@/helpers/formsInitialState";
import { plantFormValidation } from "@/helpers/formsValidation";

import { CREATE_PLANT } from "@/graphql/mutations/plant.js";

import { useStore } from "vuex";
import { computed, ref, onMounted, nextTick } from "vue";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import { useMutation } from "@vue/apollo-composable";
import DOMPurify from "dompurify";

/**
 * @component AddPlantPage
 * @description This component renders a plant form and handles sending plant data.
 * @see plantFormValidation
 * @see submitPlantForm
 * @see savePlant
 * @see savePlantAndDistill
 */

export default {
  name: "AddPlantPage",
  components: { PlantIdentification, PlantOrigin, PlantData },
  setup() {
    // Vuex store instance
    const store = useStore();

    // Computed property to get plant form data from Vuex store
    const plantForm = computed(() => store.getters["plant/plantForm"]);

    // Reactive reference to track form validity
    const isFormValid = ref(null);

    //Reactive reference to track when component is resetting
    const isResetting = ref(false);

    // Router object for navigation
    const router = useRouter();

    // Lifecycle hook to reset form validity on component mount
    onMounted(() => {
      isFormValid.value = null;
    });

    // Using GraphQL mutation for creating a new plant
    const { mutate: createPlant } = useMutation(CREATE_PLANT);


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
            plantState: DOMPurify.sanitize(form.plantState),
            dryingTime: form.dryingTime
              ? Number(DOMPurify.sanitize(form.dryingTime))
              : null,
            plantAge: form.plantAge
              ? Number(DOMPurify.sanitize(form.plantAge))
              : null,
          };

          // Send the GraphQL mutation to create a new plant
          const { data } = await createPlant({
            input: plantFormData,
          });
          console.log("Created plant:", data.createPlant);
        } catch (error) {
          console.log("error", isFormValid.value);
          console.error("Error submitting form", error);
        }
      } else {
        console.log(isFormValid.value);
        console.log("invalid form!");
        return;
      }
    };

    /**
 * @function savePlant
 * @description Function to save creating plant and navigate to the plant list.
 */
    const savePlant = async () => {
      try {
        // Submit the plant form
        await submitPlantForm();
        if (!isFormValid.value) {
          return;
        } else {
          // If valid, navigate to the plant list page
          router.push({ name: "PlantListPage", params: { page: 1 } });
        }
      } catch (error) {
        return;
      }
    };

    /**
* @function savePlantAndDistill
* @description Function to save creating plant and navigate to the add distillation page.
*/
    const savePlantAndDistill = async () => {
      try {
        // Submit the plant form
        await submitPlantForm();
        if (!isFormValid.value) {
          return;
        } else {
          // If valid, navigate to the add distillation page
          router.push({ name: "AddDistillationPage" });
        }
      } catch (error) {
        return;
      }
    };

    //Navigation guard that reset the form data in vuex state and local storage before navigating away from the route.
    onBeforeRouteLeave(async(to, from, next) => {
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

    return { savePlant, savePlantAndDistill, isFormValid, isResetting };
  },
};
</script>

<style scoped>
.form_title {
  margin-bottom: 30px;
}

.plant_form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>