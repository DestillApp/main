// plant api?????
// documentation without helpers and ui

<template>
  <base-card>
  <!-- Plant form -->
  <form @submit.prevent="submitPlantForm" class="plant_form">
    <!-- Title for the plant form -->
    <h3 class="form_title">Informacje o surowcu</h3>
    <!-- Plant identification component -->
    <plant-identification :isFormValid="isFormValid"></plant-identification>
    <!-- Plant origin component -->
    <plant-origin :isFormValid="isFormValid"></plant-origin>
    <!-- Plant data component -->
    <plant-data :isFormValid="isFormValid"></plant-data>
    <!-- Button to submit the plant form -->
    <base-button type="submit">Zapisz</base-button>
    <!-- Button to submit and go to the distillation form -->
    <base-button type="submit">Zapisz i przejdź do formularza procesu destylacji</base-button>
  </form>
</base-card>
</template>

<script>
import PlantIdentification from "@/components/plant/form/PlantIdentification.vue";
import PlantOrigin from "@/components/plant/form/PlantOrigin.vue";
import PlantData from "@/components/plant/form/PlantData.vue";

import { CREATE_PLANT } from "@/graphql/mutations/plant.js";

import { useStore } from "vuex";
import { computed, ref, onMounted } from "vue";
import { useMutation } from "@vue/apollo-composable";
import DOMPurify from "dompurify";

/**
 * @component AddPlantPage
 * @description This component renders a plant form and handles sending plant data.
 * @see plantFormValidation
 * @see submitPlantForm
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

    // Lifecycle hook to reset form validity on component mount
    onMounted(() => {
      isFormValid.value = null;
    });

    // Using GraphQL mutation for creating a new plant
    const { mutate: createPlant } = useMutation(CREATE_PLANT);

    /**
     * @async
     * @function plantFormValidation
     * @description Function to validate the plant form data
     */
    const plantFormValidation = async () => {
      const form = plantForm.value;
      console.log("form", form.plantOrigin);

      // Initial form validation for required fields
      if (
        form.plantName === "" ||
        form.plantPart === "" ||
        form.plantOrigin === "" ||
        form.plantWeight === null ||
        form.plantState === ""
      ) {
        isFormValid.value = false;
      } else {
        isFormValid.value = true;
      }

      // Additional validation for "kupno" origin
      if (form.plantOrigin === "kupno") {
        if (
          form.plantBuyDate === "" ||
          form.plantProducer === "" ||
          form.countryOfOrigin === ""
        ) {
          isFormValid.value = false;
        }
      }

      // Additional validation for "zbiór" origin
      if (form.plantOrigin === "zbiór") {
        if (
          form.harvestDate === "" ||
          form.harvestTemperature === null ||
          form.harvestStartTime === "" ||
          form.harvestEndTime === ""
        ) {
          isFormValid.value = false;
        }
      }

      // Additional validation for "podsuszony" state
      if (form.plantState === "podsuszony") {
        if (form.dryingTime === null) {
          isFormValid.value = false;
        }
      }

      // Additional validation for "suchy" state
      if (form.plantState === "suchy" && form.plantOrigin === "kupno") {
        if (form.plantAge === null) {
          isFormValid.value = false;
        }
      }
    };

    /**
     * @async
     * @function submitPlantForm
     * @description Function to handle the submission of the plant form.
     * @returns {Promise<void>} Resolves when the form submission process is complete.
     * @throws {Error} Throws an error if the form submission fails.
     */
    const submitPlantForm = async () => {
      // Validate the form
      await plantFormValidation();

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
            input: {
              plantName: plantFormData.plantName,
              plantPart: plantFormData.plantPart,
              plantOrigin: plantFormData.plantOrigin,
              plantBuyDate: plantFormData.plantBuyDate,
              plantProducer: plantFormData.plantProducer,
              countryOfOrigin: plantFormData.countryOfOrigin,
              harvestDate: plantFormData.harvestDate,
              harvestTemperature: plantFormData.harvestTemperature,
              harvestStartTime: plantFormData.harvestStartTime,
              harvestEndTime: plantFormData.harvestEndTime,
              plantWeight: plantFormData.plantWeight,
              plantState: plantFormData.plantState,
              dryingTime: plantFormData.dryingTime,
              plantAge: plantFormData.plantAge,
            },
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

    return { submitPlantForm, isFormValid };
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