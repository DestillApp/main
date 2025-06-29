<template>
  <div class="distillation">
    <!-- Input field for entering the amount of water used in distillation -->
    <base-text-input
      v-model="formData.waterForDistillation"
      type="number"
      classType="number"
      placeholder="l"
      inputColor="distillation"
      :invalidInput="
        wasSubmitted && !isFormValid && !formData.waterForDistillation
      "
      :storeName="storeName"
      @update:modelValue="
        (value, id) => setIntegerNumber(store, value, id, storeName)
      "
      @set:keyboard="handleKeyboard"
      label="Ilość wody użytej do destylacji"
      id="waterForDistillation"
      min="0"
      step="1"
    >
      <!-- Show unit 'l' if value is present -->
      <template v-slot:unit>
        <div v-if="formData.waterForDistillation">l</div>
      </template>
      <!-- Show validation message if input is invalid -->
      <template v-slot:message>
        <span
          v-if="wasSubmitted && !isFormValid && !formData.waterForDistillation"
        >
          Wprowadź ilość wody użytej do destylacji
        </span>
        <span v-else>&nbsp;</span>
      </template>
    </base-text-input>
    <div class="distillation__time">
      <!-- Input for distillation hours -->
      <base-text-input
        v-model="formData.distillationTime.distillationHours"
        type="number"
        classType="number"
        placeholder="h"
        inputColor="distillation"
        :invalidInput="
          wasSubmitted &&
          !isFormValid &&
          !formData.distillationTime.distillationHours &&
          !formData.distillationTime.distillationMinutes
        "
        :storeName="storeName"
        @set:keyboard="handleKeyboard"
        @update:modelValue="saveTime"
        label="Długość procesu destylacji"
        id="distillationHours"
        min="0"
        step="1"
      >
        <!-- Show unit 'h' if value is present -->
        <template v-slot:unit>
          <div v-if="formData.distillationTime.distillationHours">h</div>
        </template>
        <!-- Show validation messages for hours input -->
        <template v-slot:message>
          <span
            v-if="
              wasSubmitted &&
              !isFormValid &&
              !formData.distillationTime.distillationHours &&
              !formData.distillationTime.distillationMinutes
            "
          >
            Wpisz długość procesu destylacji
          </span>
          <span v-if="!isMinutesCorrect">
            Minuty powinny być w zakresie od 1 do 59
          </span>
          <span v-else>&nbsp;</span>
        </template>
      </base-text-input>
      <!-- Input for distillation minutes -->
      <base-text-input
        v-model="formData.distillationTime.distillationMinutes"
        type="number"
        classType="number"
        class="distillation__minutes"
        placeholder="min"
        inputColor="distillation"
        :invalidInput="
          (wasSubmitted &&
            !isFormValid &&
            !formData.distillationTime.distillationHours &&
            !formData.distillationTime.distillationMinutes) ||
          !isMinutesCorrect
        "
        :storeName="storeName"
        @set:keyboard="handleKeyboard"
        @update:modelValue="saveTime"
        id="distillationMinutes"
        min="0"
        max="59"
        step="1"
      >
        <!-- Show unit 'min' if value is present -->
        <template v-slot:unit>
          <div v-if="formData.distillationTime.distillationMinutes">min</div>
        </template>
      </base-text-input>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, onMounted } from "vue";
import BaseTextInput from "@/ui/BaseTextInput.vue";
import { useStore } from "@/store/useStore";
import { ResultsDistillation } from "@/types/forms/resultsForm";
import { DistillationForm } from "@/types/forms/distillationForm";
import {
  setIntegerNumber,
  setKeyboardIntegerNumber,
  preventMinusNumber,
} from "@/helpers/formatHelpers";

/**
 * @component DistillationData
 * @description Handles the distillation data inputs, such as water used and distillation time.
 * Integrates with Vuex to store form data and manage state updates.
 * @props {boolean} isFormValid - Indicates if the form is valid.
 * @props {boolean} wasSubmitted - Indicates if the form was submitted.
 * @props {boolean} [isEditing] - Indicates if the form is in editing mode.
 * @see setIntegerNumber
 * @see setKeyboardIntegerNumber
 * @see saveTime
 */

/**
 * Props for DistillationData component.
 * @interface
 * @property {boolean} isFormValid - Indicates if the form is valid.
 * @property {boolean} wasSubmitted - Indicates if the form was submitted.
 * @property {boolean} [isEditing] - Indicates if the form is in editing mode.
 */
interface Props {
  isFormValid: boolean;
  wasSubmitted: boolean;
  isEditing?: boolean;
}

export default {
  name: "DistillationData",
  components: { BaseTextInput },
  props: ["isFormValid", "wasSubmitted", "isEditing"],

  setup(props: Props) {
    // Vuex store
    const store = useStore();

    // Computed properties to get form data from Vuex store
    const formData = computed<ResultsDistillation | DistillationForm>(() =>
      props.isEditing
        ? store.getters["results/distillationData"]
        : store.getters["distillation/distillationForm"]
    );

    // Name of the vuex store module
    const storeName = computed<string>(() =>
      props.isEditing ? "results" : "distillation"
    );

    // Checks if the minutes value is in the correct range (0-59)
    const isMinutesCorrect = computed<boolean>(() => {
      const minutes = formData.value.distillationTime.distillationMinutes;
      if (minutes && (minutes < 0 || minutes > 59)) {
        return false;
      }
      return true;
    });

    /**
     * Handles keyboard events for integer-only input and prevents minus sign.
     * @param {KeyboardEvent} e - The keyboard event.
     */
    const handleKeyboard = (e: KeyboardEvent) => {
      setKeyboardIntegerNumber(e);
      preventMinusNumber(e);
    };

    // Fetch initial form data from local storage on component mount
    onMounted(() => {
      const fieldsToFetch = [
        {
          key: "waterForDistillation",
          isPlant: false,
        },
        { key: "distillationHours" },
        { key: "distillationMinutes" },
      ];

      fieldsToFetch.forEach(({ key, isPlant }) => {
        const module = props.isEditing ? "results" : "distillation";
        if (module === "distillation") {
          if (key === "waterForDistillation") {
            store.dispatch(`${module}/fetchLocalStorageData`, { key, isPlant });
          } else {
            store.dispatch(`${module}/fetchTimeFromLocalStorageData`, key);
          }
        }
        if (module === "results") {
          if (key === "waterForDistillation") {
            store.dispatch(
              `${module}/fetchDistillationDataFromLocalStorage`,
              key
            );
          } else {
            store.dispatch(
              `${module}/fetchDistillationTimeFromLocalStorage`,
              key
            );
          }
        }
      });
    });

    /**
     * Saves the distillation time (hours or minutes) to the store.
     * @param {string | number} value - The value to save.
     * @param {string} key - The key for the time field.
     */
    const saveTime = (value: string | number, key: string): void => {
      const numericValue = typeof value === "string" ? Number(value) : value;
      const isValid = !isNaN(numericValue) && numericValue >= 0;
      const module = storeName.value;

      store.dispatch(`${module}/setDistillationTime`, {
        [module === "distillation" ? "key" : "input"]: key,
        value: isValid ? numericValue : null,
      });
    };

    return {
      store,
      storeName,
      formData,
      isMinutesCorrect,
      setIntegerNumber,
      handleKeyboard,
      saveTime,
    };
  },
};
</script>

<style scoped>
.distillation {
  display: flex;
  flex-direction: row;
  gap: 100px;
}

.distillation__time {
  position: relative;
}

.distillation__minutes {
  position: absolute;
  top: 23px;
  left: 100px;
}

@media (max-width: 1024px) {
  .distillation {
    flex-direction: column;
    gap: 20px;
  }
}
</style>
