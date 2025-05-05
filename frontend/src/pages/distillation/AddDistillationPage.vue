/
<template>
  <base-card class="add-distillation">
    <!-- Distillation form -->
    <form @submit.prevent="saveDistillation" class="add-distillation__form">
      <!-- Title for the plant information form -->
      <h3 class="add-distillation__form-title">
        Informacje o procesie destylacji
      </h3>
      <!-- Distillation plan component -->
      <distillation-plant :isFormValid="isFormValid"></distillation-plant>
      <!-- Distillation process component -->
      <distillation-process :isFormValid="isFormValid"></distillation-process>
      <!-- Distillation data component -->
      <distillation-data :isFormValid="isFormValid"></distillation-data>
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
import { defineComponent } from "vue";
import DistillationPlant from "../../components/destillation/DistillationPlant.vue";
import DistillationProcess from "../../components/destillation/DistillationProcess.vue";
import DistillationData from "../../components/destillation/DistillationData.vue";
import { distillationFormValidation } from "@/helpers/formsValidation";
import { initialDistillationForm } from "@/helpers/formsInitialState";
import store from "@/store/index";

import { CREATE_DISTILLATION } from "@/graphql/mutations/distillation.js";
import { UPDATE_AVAILABLE_WEIGHT } from "@/graphql/mutations/plant.js";

import { useStore } from "vuex";
import { ref, computed, onMounted, nextTick } from "vue";
import { useMutation } from "@vue/apollo-composable";
import { onBeforeRouteLeave, useRouter, useRoute } from "vue-router";
import DOMPurify from "dompurify";

/**
 * @module AddDistillationPage
 * @description This component renders a destillation form and handles sending destillation data.
 */
export default defineComponent({
  name: "AddDistillationPage",
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
    // Vuex store instance
    const store = useStore();

    // Computed property to get plant form data from Vuex store
    const distillationForm = computed(
      () => store.getters["distillation/distillationForm"]
    );

    const distillId = ref(null);

    // Reactive reference to track form validity
    const isFormValid = ref(null);

    // Router object for navigation
    const router = useRouter();
    const route = useRoute();

    // Lifecycle hook to reset form validity on component mount
    onMounted(() => {
      isFormValid.value = null;
    });

    // Using GraphQL mutation for creating a new plant
    const { mutate: createDistillation } = useMutation(CREATE_DISTILLATION);

    // Using GraphQL mutation for updating the available weight
    const { mutate: updateAvailableWeight } = useMutation(
      UPDATE_AVAILABLE_WEIGHT
    );

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

          const { data } = await createDistillation({
            input: distillationFormData,
          });
          distillId.value = data.createDistillation._id;
          console.log("Created distillation:", data.createDistillation);
          console.log("Created distillation ID:", data.createDistillation._id);
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

    const changeAvailableWeight = async () => {
      try {
        const sanitizedAvailableWeight = Number(
          DOMPurify.sanitize(
            distillationForm.value.choosedPlant.availableWeight
          )
        );
        const sanitizedWeightForDistillation = Number(
          DOMPurify.sanitize(distillationForm.value.weightForDistillation)
        );
        let newWeight =
          sanitizedAvailableWeight - sanitizedWeightForDistillation;
        newWeight = parseFloat(newWeight.toFixed(1));

        await updateAvailableWeight({
          input: {
            id: route.params.id,
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

    const saveDistillation = async () => {
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
        return;
      }
    };
    /**
     * Asynchronously saves the distillation add results.
     *
     * This function attempts to submit the distillation form and, if the form is valid,
     * it updates the available weight for the distilled plant and navigates to the add
     * distillation results page. If the form is not valid, it simply returns without
     * performing any further actions.
     *
     * @async
     * @function saveDistillationAddResults
     * @returns {Promise<void>} - A promise that resolves when the operation is complete.
     * @throws {Error} - Throws an error if the submission or weight change fails.
     */
    const saveDistillationAddResults = async () => {
      try {
        // Submit the distillation form
        await submitDistillationForm();
        if (!isFormValid.value) {
          return;
        } else {
          //change amount of available weight for distilled plant
          await changeAvailableWeight();
          // If valid, navigate to the add distillation page
          router.push({
            name: "AddResultsPage",
            params: { distillId: distillId.value },
          });
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
        // // Wait for the next tick to ensure state updates are complete
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

    return { saveDistillation, saveDistillationAddResults, isFormValid };
  },
});
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
