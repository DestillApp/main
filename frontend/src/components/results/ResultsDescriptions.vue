<template>
  <div class="results_descriptions">
    <!-- Text area for oil description -->
    <base-text-area
      v-model="formData.oilDescription"
      classType="results"
      placeholder="Opis olejku eterycznego"
      inputColor="results"
      :invalidInput="isFormValid === false && !formData.oilDescription"
      :storeName="storeName"
      @change:modelValue="setValue"
      label="Właściwości organoleptyczne olejku eterycznego"
      id="oilDescription"
    >
      <template v-slot:message>
        <span v-if="isFormValid === false && !formData.oilDescription"
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
      :invalidInput="isFormValid === false && !formData.hydrosolDescription"
      :storeName="storeName"
      @change:modelValue="setValue"
      label="Właściwości organoleptyczne hydrolatu"
      id="hydrosolDescription"
    >
      <template v-slot:message>
        <span v-if="isFormValid === false && !formData.hydrosolDescription"
          >Wpisz właściwości organoleptyczne hydrolatu</span
        >
      </template>
    </base-text-area>
  </div>
</template>

<script>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import BaseTextArea from "@/ui/BaseTextArea.vue";

/**
 * @component ResultsDescriptions
 * @description This component renders text areas for entering descriptions related to distillation results.
 * @see setValue
 */
export default {
  name: "ResultsDescriptions",
  components: { BaseTextArea },
  props: ["isFormValid"],
  setup() {
    // Vuex store
    const store = useStore();
    // Name of the vuex store module
    const storeName = "results";

    // Computed properties to get form data from Vuex store
    const formData = computed(() => store.getters["results/resultsForm"]);

    // Function to set value in Vuex store
    const setValue = (value, id) => {
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
.results_descriptions {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>