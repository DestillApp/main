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
import { defineComponent } from "vue";
import DistillationPlant from "../../components/destillation/DistillationPlant.vue";
import DistillationProcess from "../../components/destillation/DistillationProcess.vue";
import DistillationData from "../../components/destillation/DistillationData.vue";

import { DistillationForm } from "@/types/forms/distillationForm";

import { distillationFormValidation } from "@/helpers/formsValidation";
import { initialDistillationForm } from "@/helpers/formsInitialState";
import { mapDistillationForm } from "@/helpers/formsMapping";
import store from "@/store/index";

import { CREATE_DISTILLATION } from "@/graphql/mutations/distillation.js";
import { UPDATE_AVAILABLE_WEIGHT } from "@/graphql/mutations/plant.js";

import { useStore } from "@/store/useStore";
import { ref, computed, onMounted, nextTick } from "vue";
import { useMutation } from "@vue/apollo-composable";
import { onBeforeRouteLeave, useRouter, useRoute } from "vue-router";

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
    const distillationForm = computed<DistillationForm>(
      () => store.getters["distillation/distillationForm"]
    );

    const distillId = ref<string | null>(null);

    // Reactive reference to track form validity
    const isFormValid = ref<boolean>(false);
    const wasSubmitted = ref<boolean>(false);

    // Router object for navigation
    const router = useRouter();
    const route = useRoute();

    // Lifecycle hook to reset form validity on component mount
    onMounted(() => {
      isFormValid.value = false;
      wasSubmitted.value = false;
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
    const submitDistillationForm = async (): Promise<void> => {
      // Validate the form
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
        } catch (error) {
          if (error instanceof Error) {
            if (error.message === "Unauthorized") {
              await store.dispatch("auth/logout");
              router.push("/login");
            }
            console.error("Error submitting form", error);
          } else {
            console.error("An unknown error occured", error);
          }
          wasSubmitted.value = false;
        }
      } else {
        console.log("invalid form!");
        return;
      }
    };

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
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === "Unauthorized") {
            await store.dispatch("auth/logout");
            router.push("/login");
          }
          console.error("Error changing form available weight:", error.message);
        } else {
          console.error("An unknown error occurred:", error);
        }
      }
    };

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
    const saveDistillationAddResults = async (): Promise<void> => {
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

    return {
      saveDistillation,
      saveDistillationAddResults,
      isFormValid,
      wasSubmitted,
    };
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
