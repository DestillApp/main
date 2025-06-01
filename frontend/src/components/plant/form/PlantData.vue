<template>
  <!-- Container for the plant data form -->
  <div class="plant-data">
    <!-- Input field for entering the plant weight -->
    <div class="plant-data__weights">
      <base-text-input
        v-model="formData.plantWeight"
        type="number"
        classType="number"
        inputColor="plant"
        :invalidInput="wasSubmitted && !isFormValid && !formData.plantWeight"
        :storeName="storeName"
        @change:modelValue="setNumber"
        @set:keyboard="setKeyboardFormatedNumber"
        label="Waga surowca"
        id="plantWeight"
        placeholder="kg"
        min="0.1"
        step="0.1"
      >
        <template v-slot:unit>
          <div v-if="formData.plantWeight">kg</div>
        </template>
        <template v-slot:message>
          <span v-if="wasSubmitted && !isFormValid && !formData.plantWeight"
            >Wpisz wagę surowca</span
          >
          <span v-else>&nbsp;</span>
        </template>
      </base-text-input>
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
        @change:modelValue="setNumber"
        @set:keyboard="setKeyboardFormatedNumber"
        label="Waga surowca na stanie"
        id="availableWeight"
        placeholder="kg"
        min="0.1"
        step="0.1"
      >
        <template v-slot:unit>
          <div v-if="formData.availableWeight">kg</div>
        </template>
        <template v-slot:message>
          <span v-if="wasSubmitted && !isFormValid && !formData.availableWeight"
            >Wpisz wagę surowca na stanie</span
          >
          <span v-else>&nbsp;</span>
        </template>
      </base-text-input>
    </div>
    <!-- Container for plant state inputs -->
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
        <template v-slot:message>
          <span v-if="wasSubmitted && !isFormValid && !formData.plantState"
            >Wybierz stan surowca</span
          >
          <span v-else>&nbsp;</span>
        </template>
      </base-radio-input>
      <!-- Input field for entering drying time, displayed if plant state is 'podsuszony' -->
      <base-text-input
        v-if="formData.plantState === 'podsuszony'"
        v-model="formData.dryingTime"
        type="number"
        classType="number"
        inputColor="plant"
        :invalidInput="wasSubmitted && !isFormValid && !formData.dryingTime"
        :storeName="storeName"
        @update:modelValue="setInteger"
        @set:keyboard="setKeyboardIntegerNumber"
        label="Czas podsuszania"
        id="dryingTime"
        placeholder="h"
        min="1"
        step="1"
      >
        <template v-slot:unit>
          <div v-if="formData.dryingTime">h</div>
        </template>
        <template v-slot:message>
          <span v-if="wasSubmitted && !isFormValid && !formData.dryingTime"
            >Wpisz czas podsuszania</span
          >
          <span v-else>&nbsp;</span>
        </template>
      </base-text-input>
      <!-- Input field for entering plant age, displayed if plant state is 'suchy' -->
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
        @update:modelValue="setInteger"
        @set:keyboard="setKeyboardIntegerNumber"
        label="Wiek surowca w miesiącach"
        id="plantAge"
        min="1"
        step="1"
      >
        <template v-slot:unit>
          <div v-if="formData.plantAge">
            {{ plantAgeWithSuffix(formData.plantAge) }}
          </div>
        </template>
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
  setKeyboardFormatedNumber,
} from "@/helpers/formatHelpers";
import { plantAgeWithSuffix } from "@/helpers/displayHelpers.js";
import { PlantForm } from "@/types/forms/plantForm";
import BaseTextInput from "@/ui/BaseTextInput.vue";

/**
 * @component PlantData
 * @description This component renders inputs and manage data related to plant material used in distillation, including weight, state, and soaking information.
 * @see setNumberFormat
 * @see setIntegerNumber
 * @see setKeyboardIntegerNumber
 * @see setKeyboardFormatedNumber
 */

enum PlantState {
  ŚWIEŻY = "świeży",
  PODSUSZONY = "podsuszony",
  SUCHY = "suchy",
}

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

    // Computed properties to get form data from Vuex store
    const formData = computed<PlantForm>(
      () => store.getters["plant/plantForm"]
    );
    const plantState = computed<PlantState | "">(
      () => store.getters["plant/plantState"]
    );

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

    // Using the format function
    const setInteger = (
      value: string | number,
      id: string,
      storeName: string
    ): void => {
      const numericValue = typeof value === "string" ? Number(value) : value;
      setIntegerNumber(
        store,
        numericValue >= 0 ? numericValue : null,
        id,
        storeName
      );
    };

    // Using the format function
    const setNumber = (
      value: string | number,
      id: string,
      storeName: string
    ): void => {
      const numericValue = typeof value === "string" ? Number(value) : value;
      setNumberFormat(
        store,
        numericValue >= 0 ? numericValue : null,
        id,
        storeName
      );
    };

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
      storeName,
      formData,
      states,
      title,
      plantAgeWithSuffix,
      setNumber,
      setInteger,
      setKeyboardIntegerNumber,
      setKeyboardFormatedNumber,
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
