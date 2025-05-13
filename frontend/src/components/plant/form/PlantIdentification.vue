<template>
  <!-- Container for the plant identification form -->
  <div class="plant-identification">
    <!-- Input field for entering the plant name -->
    <base-text-input
      v-model="formData.plantName"
      type="text"
      label="Nazwa surowca"
      id="plantName"
      class="plant-identification__name"
      inputColor="plant"
      :invalidInput="wasSubmitted && !isFormValid && !formData.plantName"
      @update:modelValue="setValue"
    >
      <template v-slot:message>
        <span v-if="wasSubmitted && !isFormValid && !formData.plantName"
          >Nazwa surowca jest wymagana</span
        >
        <span v-else>&nbsp;</span>
      </template></base-text-input
    >
    <!-- Input field for entering the plant part -->
    <base-text-input
      v-model="formData.plantPart"
      type="text"
      label="Część surowca"
      id="plantPart"
      class="plant-identification__part"
      inputColor="plant"
      :invalidInput="wasSubmitted && !isFormValid && !formData.plantPart"
      @update:modelValue="setValue"
    >
      <template v-slot:message
        ><span v-if="wasSubmitted && !isFormValid && !formData.plantPart"
          >Część surowca jest wymagana</span
        >
        <span v-else>&nbsp;</span>
      </template></base-text-input
    >
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { PlantForm } from "@/types/forms/plantForm";
import BaseTextInput from "@/ui/BaseTextInput.vue";

/**
 * @component PlantIdentification
 * @description This component renders a form to input and manage data related to plant material used in distillation, including plant name and part.
 * @see setValue
 */

interface Props {
  isFormValid: boolean;
  wasSubmitted: boolean;
}

export default defineComponent({
  name: "PlantIdentification",
  components: { BaseTextInput },
  props: ["isFormValid", "wasSubmitted"],
  setup(props: Props) {
    // Vuex store
    const store = useStore();
    // Computed property to get form data from Vuex store
    const formData = computed<PlantForm>(
      () => store.getters["plant/plantForm"]
    );

    /**
     * Function to dispatch an action to the Vuex store to set a specific value.
     * @function setValue
     * @param {any} currentValue - The current value to be set.
     * @param {string} input - The input field name.
     */
    const setValue = (currentValue: string, input: string): void => {
      store.dispatch("plant/setValue", { input, value: currentValue });
    };

    // Fetch initial data from local storage on component mount
    onMounted(() => {
      store.dispatch("plant/fetchLocalStorageData", "plantName");
      store.dispatch("plant/fetchLocalStorageData", "plantPart");
    });

    return { formData, setValue };
  },
});
</script>

<style scoped>
.plant-identification {
  display: flex;
  flex-direction: row;
  gap: 50px;
  width: 100%;
}

.plant-identification__name {
  width: 60%;
}

.plant-identification__part {
  width: 40%;
}

@media (max-width: 600px) {
  .plant-identification {
    flex-direction: column;
    gap: 20px;
  }

  .plant-identification__name {
    width: 100%;
  }

  .plant-identification__part {
    width: 60%;
  }
}
</style>
