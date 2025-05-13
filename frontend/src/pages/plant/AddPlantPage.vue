<template>
  <base-card class="plant">
    <!-- Plant form -->
    <form @submit.prevent="savePlant" class="plant-form">
      <!-- Title for the plant form -->
      <h3 class="plant-form__title">Informacje o surowcu</h3>
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
        :wasSubmitted="wasSubmitted"
      ></plant-data>
      <!-- Button to submit the plant form -->
      <base-button class="plant-form__button" type="submit">Zapisz</base-button>
      <!-- Button to submit and go to the distillation form -->
      <base-button @click="savePlantAndDistill"
        >Zapisz i dodaj destylację</base-button
      >
    </form>
  </base-card>
</template>

<script lang="ts">
import PlantIdentification from "@/components/plant/form/PlantIdentification.vue";
import PlantOrigin from "@/components/plant/form/PlantOrigin.vue";
import PlantData from "@/components/plant/form/PlantData.vue";

import { PlantForm } from "@/types/forms/plantForm";

import { initialPlantForm } from "@/helpers/formsInitialState";
import { plantFormValidation } from "@/helpers/formsValidation";
import { mapPlantForm } from "@/helpers/formsMapping";

import { CREATE_PLANT } from "@/graphql/mutations/plant.js";

import { useStore } from "vuex";
import { defineComponent, computed, ref, onMounted, nextTick } from "vue";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import { useMutation } from "@vue/apollo-composable";

/**
 * @component AddPlantPage
 * @description This component renders a plant form and handles sending plant data.
 * @see plantFormValidation
 * @see submitPlantForm
 * @see savePlant
 * @see savePlantAndDistill
 */

export default defineComponent({
  name: "AddPlantPage",
  components: { PlantIdentification, PlantOrigin, PlantData },
  setup() {
    // Vuex store instance
    const store = useStore();

    // Computed property to get plant form data from Vuex store
    const plantForm = computed<PlantForm>(
      () => store.getters["plant/plantForm"]
    );

    const plantId = ref<string>("");

    // Reactive reference to track form validity
    const isFormValid = ref<boolean>(false);

    //Reactive reference to track when component is resetting
    const isResetting = ref<boolean>(false);

    const wasSubmitted = ref<boolean>(false);

    // Router object for navigation
    const router = useRouter();

    // Lifecycle hook to reset form validity on component mount
    onMounted(() => {
      isFormValid.value = false;
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
    const submitPlantForm = async (): Promise<void> => {
      // Validate the form
      wasSubmitted.value = true;
      isFormValid.value = plantFormValidation(plantForm.value);

      if (isFormValid.value) {
        try {
          const plantFormData = mapPlantForm(plantForm.value);

          // Send the GraphQL mutation to create a new plant
          const result = await createPlant({
            input: plantFormData,
          });

          if (result?.data) {
            plantId.value = result.data.createPlant._id;
          }
        } catch (error) {
          if (error.message === "Unauthorized") {
            await store.dispatch("auth/logout");
            router.push("/login");
          }
          console.error("Error submitting form", error);
          wasSubmitted.value = false;
        }
      } else {
        console.log("invalid form!");
        return;
      }
    };

    /**
     * @function savePlant
     * @description Function to save creating plant and navigate to the plant list.
     */
    const savePlant = async (): Promise<void> => {
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
    const savePlantAndDistill = async (): Promise<void> => {
      try {
        // Submit the plant form
        await submitPlantForm();
        if (!isFormValid.value) {
          return;
        } else {
          // If valid, navigate to the add distillation page
          router.push({
            name: "AddDistillationPage",
            params: {
              id: plantId.value,
            },
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
      savePlant,
      savePlantAndDistill,
      isFormValid,
      isResetting,
      wasSubmitted,
    };
  },
});
</script>

<style scoped>
.plant {
  margin-top: 50px;
  margin-bottom: 100px;
}

.plant-form__title {
  margin-bottom: 30px;
}

.plant-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.plant-form__button {
  margin-top: 20px;
}
</style>
