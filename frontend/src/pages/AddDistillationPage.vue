// no arch docs and code comments
<template>
  <base-card>
    <!-- Distillation form -->
    <form @submit.prevent="submitDistillationForm" class="distillation_form">
      <!-- Title for the plant information form -->
      <h3 class="form_title">Informacje o procesie destylacji</h3>
      <!-- Distillation plan component -->
      <distillation-plant :isFormValid="isFormValid"></distillation-plant>
      <!-- Distillation process component -->
      <distillation-process :isFormValid="isFormValid"></distillation-process>
      <!-- Distillation data component -->
      <distillation-data :isFormValid="isFormValid"></distillation-data>
      <!-- Button to submit the distilation form -->
      <base-button type="submit">Zapisz</base-button>
      <!-- Button to submit and go to the distillation results form -->
      <base-button type="submit"
        >Zapisz i przejdź do formularza wyników destylacji</base-button
      >
    </form>
  </base-card>
</template>

<script>
import DistillationPlant from "../components/destillation/DistillationPlant.vue";
import DistillationProcess from "../components/destillation/DistillationProcess.vue";
import DistillationData from "../components/destillation/DistillationData.vue";
import { distillationFormValidation } from "@/helpers/formsValidation";

import { CREATE_DISTILLATION } from "@/graphql/mutations/distillation.js";

import { useStore } from "vuex";
import { ref, computed, onMounted } from "vue";
import { useMutation } from "@vue/apollo-composable";
import DOMPurify from "dompurify";

/**
 * @module AddDistillationPage
 * @description This component renders a destillation form and handles sending destillation data.
 */
export default {
  name: "AddDistillationPage",
  components: { DistillationPlant, DistillationProcess, DistillationData },
  setup() {
    // Vuex store instance
    const store = useStore();

    // Computed property to get plant form data from Vuex store
    const distillationForm = computed(
      () => store.getters["distillation/distillationForm"]
    );

    // Reactive reference to track form validity
    const isFormValid = ref(null);

    // Lifecycle hook to reset form validity on component mount
    onMounted(() => {
      isFormValid.value = null;
      console.log(distillationForm.value);
    });

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
      isFormValid.value = distillationFormValidation(distillationForm.value);
      console.log("valid?", isFormValid.value);
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
              distillationHours: form.distillationTime.distillationHours ? Number(DOMPurify.sanitize(form.distillationTime.distillationHours)) : null,
              distillationMinutes: form.distillationTime.distillationMinutes ? Number(DOMPurify.sanitize(form.distillationTime.distillationMinutes)) : null,
            },
          };

          console.log(distillationFormData);

          const { data } = await createDistillation({
            input: {
              choosedPlant: distillationFormData.choosedPlant,
              weightForDistillation: distillationFormData.weightForDistillation,
              isPlantSoaked: distillationFormData.isPlantSoaked,
              soakingTime: distillationFormData.soakingTime,
              weightAfterSoaking: distillationFormData.weightAfterSoaking,
              isPlantShredded: distillationFormData.isPlantShredded,
              distillationType: distillationFormData.distillationType,
              distillationDate: distillationFormData.distillationDate,
              distillationApparatus: distillationFormData.distillationApparatus,
              waterForDistillation: distillationFormData.waterForDistillation,
              distillationTime: distillationFormData.distillationTime,
            },
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

<style scoped>
.form_title {
  margin-bottom: 30px;
}

.distillation_form {
  display: flex;
  flex-direction: column;
}
</style>