<template>
  <!-- Container for the plant data form -->
  <div class="plant-data">
    <!-- Input fields for plant weight and available weight (if editing) -->
    <div class="plant-data__weights">
      <!-- Input for plant weight -->
      <base-text-input
        v-model="formData.plantWeight"
        type="number"
        classType="number"
        inputColor="plant"
        :invalidInput="wasSubmitted && !isFormValid && !formData.plantWeight"
        :storeName="storeName"
        @change:modelValue="
          (value, id) => setNumberFormat(store, value, id, storeName)
        "
        @set:keyboard="preventMinusNumber"
        label="Waga surowca"
        id="plantWeight"
        placeholder="kg"
        min="0.1"
        step="0.1"
      >
        <!-- Show unit 'kg' if value is present -->
        <template v-slot:unit>
          <div v-if="formData.plantWeight">kg</div>
        </template>
        <!-- Validation message for plant weight -->
        <template v-slot:message>
          <span v-if="wasSubmitted && !isFormValid && !formData.plantWeight"
            >Wpisz wagę surowca</span
          >
          <span v-else>&nbsp;</span>
        </template>
      </base-text-input>
      <!-- Input for available weight, only in edit mode -->
      <base-text-input
        v-if="isEditing"
        v-model="formData.availableWeight"
        type="number"
        classType="number"
        inputColor="plant"
        :invalidInput="
          wasSubmitted && !isFormValid && !formData.availableWeight
        "
        :storeName="storeName"
        @change:modelValue="
          (value, id) => setNumberFormat(store, value, id, storeName)
        "
        @set:keyboard="preventMinusNumber"
        label="Waga surowca na stanie"
        id="availableWeight"
        placeholder="kg"
        min="0.1"
        step="0.1"
      >
        <!-- Show unit 'kg' if value is present -->
        <template v-slot:unit>
          <div v-if="formData.availableWeight">kg</div>
        </template>
        <!-- Validation message for available weight -->
        <template v-slot:message>
          <span v-if="wasSubmitted && !isFormValid && !formData.availableWeight"
            >Wpisz wagę surowca na stanie</span
          >
          <span v-else>&nbsp;</span>
        </template>
      </base-text-input>
    </div>
    <!-- Section for plant state selection and related fields -->
    <div class="plant-data__state">
      <!-- Radio input for plant state selection -->
      <base-radio-input
        v-model="formData.plantState"
        :options="states"
        :title="title"
        color="var(--secondary-color)"
        name="plantState"
        class="plant-data__state-radioinput"
      >
        <!-- Validation message for plant state -->
        <template v-slot:message>
          <span v-if="wasSubmitted && !isFormValid && !formData.plantState"
            >Wybierz stan surowca</span
          >
          <span v-else>&nbsp;</span>
        </template>
      </base-radio-input>
      <!-- Input for drying time, shown if state is 'podsuszony' -->
      <base-text-input
        v-if="formData.plantState === 'podsuszony'"
        v-model="formData.dryingTime"
        type="number"
        classType="number"
        inputColor="plant"
        :invalidInput="wasSubmitted && !isFormValid && !formData.dryingTime"
        :storeName="storeName"
        @update:modelValue="
          (value, id) => setIntegerNumber(store, value, id, storeName)
        "
        @set:keyboard="handleKeyboard"
        label="Czas podsuszania"
        id="dryingTime"
        placeholder="h"
        min="1"
        step="1"
      >
        <!-- Show unit 'h' if value is present -->
        <template v-slot:unit>
          <div v-if="formData.dryingTime">h</div>
        </template>
        <!-- Validation message for drying time -->
        <template v-slot:message>
          <span v-if="wasSubmitted && !isFormValid && !formData.dryingTime"
            >Wpisz czas podsuszania</span
          >
          <span v-else>&nbsp;</span>
        </template>
      </base-text-input>
      <!-- Input for plant age, shown if state is 'suchy' and origin is 'kupno' -->
      <base-text-input
        v-if="
          formData.plantState === 'suchy' && formData.plantOrigin === 'kupno'
        "
        v-model="formData.plantAge"
        type="number"
        classType="number"
        inputColor="plant"
        :invalidInput="wasSubmitted && !isFormValid && !formData.plantAge"
        :storeName="storeName"
        @update:modelValue="
          (value, id) => setIntegerNumber(store, value, id, storeName)
        "
        @set:keyboard="handleKeyboard"
        label="Wiek surowca w miesiącach"
        id="plantAge"
        min="1"
        step="1"
      >
        <!-- Show unit with suffix if value is present -->
        <template v-slot:unit>
          <div v-if="formData.plantAge">
            {{ plantAgeWithSuffix(formData.plantAge) }}
          </div>
        </template>
        <!-- Validation message for plant age -->
        <template v-slot:message>
          <span v-if="wasSubmitted && !isFormValid && !formData.plantAge"
            >Wpisz wiek surowca</span
          >
          <span v-else>&nbsp;</span>
        </template>
      </base-text-input>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from "@/store/useStore";
import { ref, reactive, computed, watch, onMounted } from "vue";
import {
  setIntegerNumber,
  setNumberFormat,
  setKeyboardIntegerNumber,
  preventMinusNumber,
} from "@/helpers/formatHelpers";
import { plantAgeWithSuffix } from "@/helpers/displayHelpers.js";
import { PlantForm } from "@/types/forms/plantForm";
import { PlantState } from "@/types/enums";
import BaseTextInput from "@/ui/BaseTextInput.vue";

/**
 * @component PlantData
 * @description This component renders inputs and manages data related to plant material used in distillation, including weight, state, and drying/age information.
 * @props {boolean} isFormValid - Indicates if the form is valid.
 * @props {boolean} wasSubmitted - Indicates if the form was submitted.
 * @props {boolean} [isResetting] - Indicates if the form is being reset.
 * @props {boolean} [isEditing] - Indicates if the form is in editing mode.
 * @see setNumberFormat
 * @see setIntegerNumber
 * @see setKeyboardIntegerNumber
 * @see handleKeyboard
 */

/**
 * Props for PlantData component.
 * @interface
 * @property {boolean} isFormValid - Indicates if the form is valid.
 * @property {boolean} wasSubmitted - Indicates if the form was submitted.
 * @property {boolean} [isResetting] - Indicates if the form is being reset.
 * @property {boolean} [isEditing] - Indicates if the form is in editing mode.
 */
interface Props {
  isFormValid: boolean;
  isResetting?: boolean;
  isEditing?: boolean;
  wasSubmitted: boolean;
}

export default {
  name: "PlantData",
  components: { BaseTextInput },
  props: ["isFormValid", "isResetting", "isEditing", "wasSubmitted"],

  setup(props: Props) {
    // Options for plant state
    const states = reactive<PlantState[]>([
      PlantState.ŚWIEŻY,
      PlantState.PODSUSZONY,
      PlantState.SUCHY,
    ]);
    // Title of the radio inputs
    const title = ref<string>("Stan surowca");

    // Vuex store
    const store = useStore();
    // Name of the vuex store module
    const storeName = "plant";

    // Computed property to get form data from Vuex store
    const formData = computed<PlantForm>(
      () => store.getters["plant/plantForm"]
    );
    // Computed property for plant state
    const plantState = computed<PlantState | "">(
      () => store.getters["plant/plantState"]
    );

    /**
     * Handles keyboard events for integer-only input and prevents minus sign.
     * @param {KeyboardEvent} e - The keyboard event.
     */
    const handleKeyboard = (e: KeyboardEvent) => {
      setKeyboardIntegerNumber(e);
      preventMinusNumber(e);
    };

    // Fetch initial data from local storage on component mount
    onMounted(() => {
      [
        "plantWeight",
        "availableWeight",
        "plantState",
        "dryingTime",
        "plantAge",
      ].forEach((field) => {
        store.dispatch("plant/fetchLocalStorageData", field);
      });
    });

    // Watcher to handle changes in the plant state. Updates related fields and dispatches changes to the store.
    watch(
      () => plantState.value,
      (newValue, oldValue) => {
        if (props.isResetting) return;

        const resetFields: Partial<Record<PlantState, string>> = {
          [PlantState.PODSUSZONY]: "dryingTime",
          [PlantState.SUCHY]: "plantAge",
        };

        if (oldValue && resetFields[oldValue]) {
          store.dispatch("plant/setValue", {
            input: resetFields[oldValue],
            value: null,
          });
        }

        store.dispatch("plant/setValue", {
          input: "plantState",
          value: newValue,
        });
      }
    );

    return {
      store,
      storeName,
      formData,
      states,
      title,
      plantAgeWithSuffix,
      setNumberFormat,
      setIntegerNumber,
      preventMinusNumber,
      handleKeyboard,
    };
  },
};
</script>

<style scoped>
.plant-data {
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: flex-start;
  text-align: left;
}

.plant-data__weights {
  display: flex;
  flex-direction: row;
  gap: 50px;
}

.plant-data__state {
  display: flex;
  flex-direction: row;
  gap: 50px;
  width: 100%;
}

.plant-data__state-radioinput {
  width: 50%;
}

@media (max-width: 600px) {
  .plant-data__state {
    flex-direction: column;
    gap: 20px;
  }
}
</style>
