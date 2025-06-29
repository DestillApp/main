<template>
  <div class="results-descriptions">
    <!-- Text area for oil description -->
    <base-text-area
      v-model="formData.oilDescription"
      classType="results"
      placeholder="Opis olejku eterycznego"
      inputColor="results"
      :invalidInput="wasSubmitted && !isFormValid && !formData.oilDescription"
      :storeName="storeName"
      @change:modelValue="setValue"
      label="Właściwości organoleptyczne olejku eterycznego"
      id="oilDescription"
    >
      <!-- Validation message for oil description -->
      <template v-slot:message>
        <span v-if="wasSubmitted && !isFormValid && !formData.oilDescription"
          >Wpisz właściwości organoleptyczne olejku eterycznego</span
        >
      </template>
    </base-text-area>

    <!-- Text area for hydrosol description -->
    <base-text-area
      v-model="formData.hydrosolDescription"
      classType="results"
      placeholder="Opis hydrolatu"
      inputColor="results"
      :invalidInput="
        wasSubmitted && !isFormValid && !formData.hydrosolDescription
      "
      :storeName="storeName"
      @change:modelValue="setValue"
      label="Właściwości organoleptyczne hydrolatu"
      id="hydrosolDescription"
    >
      <!-- Validation message for hydrosol description -->
      <template v-slot:message>
        <span
          v-if="wasSubmitted && !isFormValid && !formData.hydrosolDescription"
          >Wpisz właściwości organoleptyczne hydrolatu</span
        >
      </template>
    </base-text-area>
  </div>
</template>

<script lang="ts">
import { computed, onMounted } from "vue";
import { useStore } from "@/store/useStore";
import BaseTextArea from "@/ui/BaseTextArea.vue";
import { ResultsForm } from "@/types/forms/resultsForm";

/**
 * @component ResultsDescriptions
 * @description This component renders text areas for entering descriptions related to distillation results, including oil and hydrosol descriptions.
 * @props {boolean} isFormValid
 * @props {boolean} wasSubmitted
 * @see setValue
 */

/**
 * Props for ResultsDescriptions component.
 * @interface
 * @property {boolean} isFormValid
 * @property {boolean} wasSubmitted
 */
interface Props {
  isFormValid: boolean;
  wasSubmitted: boolean;
}

export default {
  name: "ResultsDescriptions",
  components: { BaseTextArea },
  props: ["isFormValid", "wasSubmitted"],
  setup(props: Props) {
    // Vuex store instance
    const store = useStore();
    // Name of the vuex store module
    const storeName = "results";

    // Computed property to get form data from Vuex store
    const formData = computed<ResultsForm>(
      () => store.getters["results/resultsForm"]
    );

    /**
     * Sets a value in the Vuex store for a given input field.
     * @function setValue
     * @param {string} value - The value to set.
     * @param {string} id - The input field identifier.
     */
    const setValue = (value: string, id: string): void => {
      store.dispatch("results/setValue", { input: id, value });
    };

    // Fetch initial data from local storage on component mount
    onMounted(() => {
      store.dispatch("results/fetchLocalStorageData", "oilDescription");
      store.dispatch("results/fetchLocalStorageData", "hydrosolDescription");
    });

    return {
      formData,
      setValue,
      storeName,
    };
  },
};
</script>

<style scoped>
.results-descriptions {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
