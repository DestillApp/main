<template>
  <div class="results-data">
    <h5 v-if="isEditing" class="results-data__title">wyniki</h5>
    <div class="results-data__content">
      <!-- Input field for entering the distillation result -->
      <base-text-input
        v-model="formData.oilAmount"
        type="number"
        classType="results"
        placeholder="ml"
        inputColor="results"
        :invalidInput="wasSubmitted && !isFormValid && !formData.oilAmount"
        :storeName="storeName"
        @change:modelValue="
          (value, id) => setNumberFormat(store, value, id, storeName, 1)
        "
        label="Ilość olejku eterycznego"
        id="oilAmount"
        min="0.1"
        step="0.1"
      >
        <template v-slot:unit>
          <div v-if="formData.oilAmount">ml</div>
        </template>
        <template v-slot:message>
          <span v-if="wasSubmitted && !isFormValid && !formData.oilAmount"
            >Wpisz ilość olejku eterycznego</span
          >
        </template>
      </base-text-input>
      <div class="results-data__hydrosol">
        <!-- Input field for entering the hydrosol amount -->
        <base-text-input
          v-model="formData.hydrosolAmount"
          type="number"
          classType="results"
          placeholder="l"
          inputColor="results"
          :invalidInput="
            wasSubmitted && !isFormValid && !formData.hydrosolAmount
          "
          :storeName="storeName"
          @change:modelValue="
            (value, id) => setNumberFormat(store, value, id, storeName, 1)
          "
          label="Ilość hydrolatu"
          id="hydrosolAmount"
          min="0.1"
          step="0.1"
        >
          <template v-slot:unit>
            <div v-if="formData.hydrosolAmount">l</div>
          </template>
          <template v-slot:message>
            <span
              v-if="wasSubmitted && !isFormValid && !formData.hydrosolAmount"
              >Wpisz ilość hydrolatu</span
            >
          </template>
        </base-text-input>

        <!-- Input field for entering the hydrosol pH -->
        <base-text-input
          v-model="formData.hydrosolpH"
          type="number"
          classType="number"
          placeholder="pH"
          inputColor="results"
          :invalidInput="wasSubmitted && !isFormValid && !formData.hydrosolpH"
          :storeName="storeName"
          @change:modelValue="
            (value, id) => setNumberFormat(store, value, id, storeName, 2)
          "
          label="pH hydrolatu"
          id="hydrosolpH"
          min="0"
          max="14"
          step="0.01"
        >
          <template v-slot:message>
            <span v-if="wasSubmitted && !isFormValid && !formData.hydrosolpH"
              >Wpisz pH hydrolatu</span
            >
          </template>
        </base-text-input>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, onMounted } from "vue";
import { useStore } from "@/store/useStore";
import BaseTextInput from "@/ui/BaseTextInput.vue";
import { setNumberFormat } from "@/helpers/formatHelpers";
import { ResultsForm } from "@/types/forms/resultsForm";

/**
 * @component ResultsData
 * @description This component renders inputs and manages data related to distillation results.
 * @see setNumberFormat
 */

interface Props {
  isFormValid: boolean;
  isEditing?: boolean;
  wasSubmitted: boolean;
}

export default {
  name: "ResultsData",
  components: { BaseTextInput },
  props: ["isFormValid", "isEditing", "wasSubmitted"],
  setup(props: Props) {
    // Vuex store
    const store = useStore();
    // Name of the vuex store module
    const storeName = "results";

    // Computed properties to get form data from Vuex store
    const formData = computed<ResultsForm>(
      () => store.getters["results/resultsForm"]
    );

    // Fetch initial data from local storage on component mount
    onMounted(() => {
      const keys = ["oilAmount", "hydrosolAmount", "hydrosolpH"];
      keys.forEach((key) => {
        store.dispatch("results/fetchLocalStorageData", key);
      });
    });

    return {
      store,
      formData,
      setNumberFormat,
      storeName,
    };
  },
};
</script>

<style scoped>
.results-data {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.results-data__title {
  font-size: 16px;
}

.results-data__content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.results-data__hydrosol {
  display: flex;
  flex-direction: row;
  gap: 50px;
}

@media (max-width: 600px) {
  .results-data__hydrosol {
    flex-direction: column;
    gap: 30px;
  }
}
</style>
