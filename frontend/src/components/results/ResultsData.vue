<template>
  <div class="results_data">
    <!-- Input field for entering the distillation result -->
    <base-text-input
      v-model="formData.oilAmount"
      type="number"
      classType="results"
      placeholder="ml"
      inputColor="results"
      :invalidInput="isFormValid === false && !formData.oilAmount"
      :storeName="storeName"
      @change:modelValue="setNumber"
      label="Ilość olejku eterycznego"
      id="oilAmount"
      min="0.1"
      step="0.1"
    >
      <template v-slot:unit>
        <div v-if="formData.oilAmount !== null">ml</div>
      </template>
      <template v-slot:message>
        <span v-if="isFormValid === false && !formData.oilAmount">Wpisz ilość olejku eterycznego</span>
      </template>
    </base-text-input>
  </div>
</template>

<script>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import BaseTextInput from "@/ui/BaseTextInput.vue";
import { setNumberFormat } from "@/helpers/formatHelpers.js";

/**
 * @component ResultsData
 * @description This component renders inputs and manages data related to distillation results.
 * @see setNumberFormat
 */
export default {
  name: "ResultsData",
  components: { BaseTextInput },
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

    // Function to format number input and set value in Vuex store
    const setNumber = (value, id, storeName) => {
      setNumberFormat(store, value, id, storeName);
    };

    // Fetch initial data from local storage on component mount
    onMounted(() => {
      store.dispatch("results/fetchLocalStorageData", "oilAmount");
    });

    return {
      formData,
      setValue,
      setNumber,
      storeName,
    };
  },
};
</script>

<style scoped>
.results_data {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.message {
  color: var(--error-color);
  font-size: 12px;
  text-align: left;
}
</style>