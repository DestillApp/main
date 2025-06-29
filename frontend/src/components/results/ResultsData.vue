<template>
  <div class="results-data">
    <!-- Title for results section, shown only in edit mode -->
    <h5 v-if="isEditing" class="results-data__title">wyniki</h5>
    <div class="results-data__content">
      <!-- Input field for entering the distillation result (oil amount) -->
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
        @set:keyboard="preventMinusNumber"
        label="Ilość olejku eterycznego"
        id="oilAmount"
        min="0.1"
        step="0.1"
      >
        <!-- Show unit 'ml' if value is present -->
        <template v-slot:unit>
          <div v-if="formData.oilAmount">ml</div>
        </template>
        <!-- Validation message for oil amount -->
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
          @set:keyboard="preventMinusNumber"
          label="Ilość hydrolatu"
          id="hydrosolAmount"
          min="0.1"
          step="0.1"
        >
          <!-- Show unit 'l' if value is present -->
          <template v-slot:unit>
            <div v-if="formData.hydrosolAmount">l</div>
          </template>
          <!-- Validation message for hydrosol amount -->
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
          :invalidInput="
            (wasSubmitted && !isFormValid && !formData.hydrosolpH) ||
            !isPhCorrect
          "
          :storeName="storeName"
          @change:modelValue="
            (value, id) => setNumberFormat(store, value, id, storeName, 2)
          "
          @set:keyboard="preventMinusNumber"
          label="pH hydrolatu"
          id="hydrosolpH"
          min="0"
          max="14"
          step="0.01"
        >
          <!-- Validation messages for hydrosol pH -->
          <template v-slot:message>
            <span v-if="wasSubmitted && !isFormValid && !formData.hydrosolpH"
              >Wpisz pH hydrolatu</span
            >
            <span v-if="!isPhCorrect">pH musi być w zakresie 0-14</span>
            <span v-else>&nbsp;</span>
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
import { setNumberFormat, preventMinusNumber } from "@/helpers/formatHelpers";
import { ResultsForm } from "@/types/forms/resultsForm";

/**
 * @component ResultsData
 * @description This component renders inputs and manages data related to distillation results, including oil amount, hydrosol amount, and hydrosol pH.
 * @props {boolean} isFormValid
 * @props {boolean} [isEditing]
 * @props {boolean} wasSubmitted
 * @see setNumberFormat
 * @see preventMinusNumber
 */

/**
 * Props for ResultsData component.
 * @interface
 * @property {boolean} isFormValid
 * @property {boolean} [isEditing]
 * @property {boolean} wasSubmitted
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
    // Vuex store instance
    const store = useStore();
    // Name of the vuex store module
    const storeName = "results";

    // Computed property to get form data from Vuex store
    const formData = computed<ResultsForm>(
      () => store.getters["results/resultsForm"]
    );

    // Computed property to validate hydrosol pH range
    const isPhCorrect = computed<boolean>(() => {
      const ph = formData.value.hydrosolpH;
      if ((ph && ph < 0) || (ph && ph > 14)) {
        return false;
      } else {
        return true;
      }
    });

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
      isPhCorrect,
      setNumberFormat,
      preventMinusNumber,
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
