<template>
  <div class="results_data">
    <!-- Input field for entering the distillation result -->
    <base-text-input
      v-model="formData.oilAmount"
      type="text"
      classType="text"
      placeholder="ml"
      inputColor="results"
      :invalidInput="isFormValid === false && !formData.oilAmount"
      :storeName="storeName"
      @update:modelValue="setValue"
      label="Ilość olejku eterycznego"
      id="oilAmount"
    >
      <template v-slot:message>
        <span v-if="isFormValid === false && !formData.oilAmount">Wprowadź wynik destylacji</span>
      </template>
    </base-text-input>
  </div>
</template>

<script>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import BaseTextInput from "@/ui/BaseTextInput.vue";

/**
 * @component ResultsData
 * @description This component renders inputs and manages data related to distillation results.
 * @see setValue
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

    // Fetch initial data from local storage on component mount
    onMounted(() => {
        store.dispatch("results/fetchLocalStorageData", "oilAmount");
      console.log(formData.value.oilAmount);
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