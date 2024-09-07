// no docs
// wrong validation
<template>
  <base-card>
    <!-- Title for the plant information form -->
    <h3 class="plant_title">Informacje o procesie destylacji</h3>
    <!-- Distillation form -->
    <form @submit.prevent="submitDistillationForm">
      <!-- Distillation plan component -->
      <distillation-plant :isFormValid="isFormValid"></distillation-plant>
      <!-- Button to submit the distilation form -->
      <base-button type="submit">Zapisz</base-button>
      <!-- Button to submit and go to the distillation results form -->
      <base-button type="submit">Zapisz i przejdź do formularza wyników destylacji</base-button>
    </form>
  </base-card>
</template>

<script>
import DistillationPlant from "./DistillationPlant.vue";

import {CREATE_DISTILLATION} from "@/graphql/mutations/distillation.js"

import { useStore } from "vuex";
import { ref, computed, onMounted } from "vue";
import { useMutation } from "@vue/apollo-composable";
import DOMPurify from "dompurify";

/**
 * @module DistillationForm
 * @description This component renders a destillation form and handles sending destillation data.
 */
export default {
  name: "DistillationForm",
  components: { DistillationPlant },
  setup() {
    // Vuex store instance
    const store = useStore();

    // Computed property to get plant form data from Vuex store
    const distillationForm = computed(() => store.getters["distillation/distillationForm"]);

    // Reactive reference to track form validity
    const isFormValid = ref(null);

    // Lifecycle hook to reset form validity on component mount
    onMounted(() => {
      isFormValid.value = null;
    });

    /**
     * @async
     * @function distillationFormValidation
     * @description Function to validate the plant form data
     */
    const distillationFormValidation = async () => {
      const form = distillationForm.value;
      console.log("form", form);

      // Additional validation for soaked plants
      if (form.isPlantSoaked) {
        if (form.soakingTime === null || form.weightAfterSoaking === null) {
          isFormValid.value = false;
        } else {
          isFormValid.value = true
        }
      }
    };

    // Using GraphQL mutation for creating a new plant
    const { mutate: createDistillation } = useMutation(CREATE_DISTILLATION);

    /**
     * @async
     * @function submitDistillationForm
     * @description Function to handle the submission of the distillation form.
     * @returns {Promise<void>} Resolves when the form submission process is complete.
     * @throws {Error} Throws an error if the form submission fails.
     */
    const submitDistillationForm = async () => {
      // Validate the form
      await distillationFormValidation();
      if (isFormValid.value) {
        try {
          const form = distillationForm.value;

          const distillationFormData = {
            isPlantSoaked: Boolean(DOMPurify.sanitize(form.isPlantSoaked)),
            soakingTime: form.soakingTime
              ? Number(DOMPurify.sanitize(form.soakingTime))
              : null,
            weightAfterSoaking: form.weightAfterSoaking
              ? Number(DOMPurify.sanitize(form.weightAfterSoaking))
              : null,
          }

          const { data } = await createDistillation({
            input: {
              isPlantSoaked: distillationFormData.isPlantSoaked,
              soakingTime: distillationFormData.soakingTime,
              weightAfterSoaking: distillationFormData.weightAfterSoaking,
            }
          });
          console.log("Created distillation:", data.createDistillation);
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

    return { submitDistillationForm, isFormValid };
  },
};
</script>