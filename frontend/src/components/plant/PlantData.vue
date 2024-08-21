<template>
  <!-- Container for the plant data form -->
  <div class="plant_data">
    <!-- Input field for entering the plant weight -->
    <base-text-input
      v-model="formData.plantWeight"
      type="number"
      classType="number"
      :invalidInput="isFormValid === false && formData.plantWeight === null"
      @change:modelValue="setNumberFormat"
      @set:keyboard="setKeyboardFormatedNumber"
      label="Waga surowca"
      id="plantWeight"
      placeholder="kg"
      min="0.1"
      step="0.1"
    >
      <template v-slot:unit>
        <div v-if="formData.plantWeight !== null">kg</div>
      </template>
      <template v-slot:message>
        <span v-if="isFormValid === false && formData.plantWeight === null"
          >Wpisz wagę surowca</span
        >
        <span v-else>&nbsp;</span>
      </template>
    </base-text-input>
    <!-- Container for plant state inputs -->
    <div class="plant_state">
      <!-- Radio input for plant state selection -->
      <base-radio-input
        v-model="formData.plantState"
        :options="states"
        :title="title"
        name="plantState"
        class="state_radioinput"
      >
        <template v-slot:message>
          <span v-if="isFormValid === false && formData.plantState === ''"
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
        :invalidInput="isFormValid === false && formData.dryingTime === null"
        @update:modelValue="setIntegerNumber"
        @set:keyboard="setKeyboardIntegerNumber"
        label="Czas podsuszania"
        id="dryingTime"
        placeholder="h"
        min="1"
        step="1"
      >
        <template v-slot:unit>
          <div v-if="formData.dryingTime !== null">h</div>
        </template>
        <template v-slot:message>
          <span v-if="isFormValid === false && formData.dryingTime === null"
            >Wpisz czas podsuszania</span
          >
          <span v-else>&nbsp;</span>
        </template>
      </base-text-input>
      <!-- Input field for entering plant age, displayed if plant state is 'suchy' -->
      <base-text-input
        v-if="formData.plantState === 'suchy'"
        v-model="formData.plantAge"
        type="number"
        classType="number"
        :invalidInput="isFormValid === false && formData.plantAge === null"
        @update:modelValue="setIntegerNumber"
        @set:keyboard="setKeyboardIntegerNumber"
        label="Wiek surowca w miesiącach"
        id="plantAge"
        min="1"
        step="1"
      >
        <template v-slot:unit>
          <div v-if="formData.plantAge !== null">
            <div v-if="formData.plantAge === 1">miesiąc</div>
            <div v-if="[2, 3, 4].includes(parseInt(formData.plantAge))">
              miesiące
            </div>
            <div v-if="![1, 2, 3, 4].includes(parseInt(formData.plantAge))">
              miesięcy
            </div>
          </div>
        </template>
        <template v-slot:message>
          <span v-if="isFormValid === false && formData.plantAge === null"
            >Wpisz wiek surowca</span
          >
          <span v-else>&nbsp;</span>
        </template>
      </base-text-input>
    </div>
    <!-- Checkbox for indicating if the plant was soaked -->
    <v-checkbox
      v-model="formData.isPlantSoaked"
      label="Surowiec namaczany przed destylacją"
      color="var(--secondary-color)"
    ></v-checkbox>
    <!-- Additional inputs displayed if the plant was soaked -->
    <div v-if="formData.isPlantSoaked">
      <!-- Input field for entering the soaking time -->
      <base-text-input
        v-model="formData.soakingTime"
        type="number"
        classType="number"
        :invalidInput="isFormValid === false && formData.soakingTime === null"
        @update:modelValue="setIntegerNumber"
        @set:keyboard="setKeyboardIntegerNumber"
        label="Czas namaczania"
        placeholder="h"
        id="soakingTime"
        min="1"
        step="1"
      >
        <template v-slot:unit>
          <div v-if="formData.soakingTime !== null">h</div>
        </template>
        <template v-slot:message>
          <span v-if="isFormValid === false && formData.soakingTime === null"
            >Wpisz czas namaczania</span
          >
          <span v-else>&nbsp;</span>
        </template>
      </base-text-input>
      <!-- Input field for entering the weight after soaking -->
      <base-text-input
        v-model="formData.weightAfterSoaking"
        type="number"
        classType="number"
        :invalidInput="
          isFormValid === false && formData.weightAfterSoaking === null
        "
        @change:modelValue="setNumberFormat"
        @set:keyboard="setKeyboardFormatedNumber"
        label="Waga surowca po namoczeniu"
        placeholder="kg"
        id="weightAfterSoaking"
        min="0.1"
        step="0.1"
      >
        <template v-slot:unit>
          <div v-if="formData.weightAfterSoaking !== null">kg</div>
        </template>
        <template v-slot:message>
          <span
            v-if="isFormValid === false && formData.weightAfterSoaking === null"
            >Wpisz wagę po namaczaniu</span
          >
          <span v-else>&nbsp;</span>
        </template>
      </base-text-input>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { ref, reactive, computed, watch, onMounted } from "vue";
import BaseTextInput from "@/ui/BaseTextInput.vue";

/**
 * @component PlantData
 * @description This component renders a form to input and manage data related to plant material used in distillation, including weight, state, and soaking information.
 * @see setNumberFormat
 * @see setIntegerValue
 * @see setKeyboardIntegerNumber
 * @see setKeyboardFormatedNumber
 */
export default {
  name: "PlantData",
  components: { BaseTextInput },
  props: ["isFormValid"],
  setup() {
    // Options for plant state
    const states = reactive(["świeży", "podsuszony", "suchy"]);
    // Title of the radio inputs
    const title = ref("Stan surowca");

    // Vuex store
    const store = useStore();
    // Computed properties to get form data from Vuex store
    const formData = computed(() => store.getters["plant/plantForm"]);
    const plantState = computed(() => store.getters["plant/plantState"]);
    const isPlantSoaked = computed(() => store.getters["plant/isPlantSoaked"]);

    // Fetch initial data from local storage on component mount
    onMounted(() => {
      store.dispatch("plant/fetchLocalStorageData", "plantWeight");
      store.dispatch("plant/fetchLocalStorageData", "plantState");
      store.dispatch("plant/fetchLocalStorageData", "dryingTime");
      store.dispatch("plant/fetchLocalStorageData", "plantAge");
      store.dispatch("plant/fetchLocalStorageData", "isPlantSoaked");
      store.dispatch("plant/fetchLocalStorageData", "soakingTime");
      store.dispatch("plant/fetchLocalStorageData", "weightAfterSoaking");
    });

    /**
     * Formats the number input and dispatches the formatted value to the store.
     * @function setNumberFormat
     * @param {number} currentValue - The current value of the input.
     * @param {string} input - The input identifier.
     */
    const setNumberFormat = (currentValue, input) => {
      if (!currentValue || isNaN(currentValue)) {
        store.dispatch("plant/setValue", { input, value: null });
      } else {
        store.dispatch("plant/setNumberFormat", { input, value: currentValue });
      }
    };

    /**
     * Formats the number input to an integer and dispatches the value to the store.
     * @function setIntegerValue
     * @param {number} currentValue - The current value of the input.
     * @param {string} input - The input identifier.
     */
    const setIntegerNumber = (currentValue, input) => {
      if (!currentValue || isNaN(currentValue)) {
        store.dispatch("plant/setValue", { input, value: null });
      } else {
        store.dispatch("plant/setIntegerValue", { input, value: currentValue });
      }
    };

    /**
     * Prevents keyboard input for non-integer values.
     * @function setKeyboardIntegerNumber
     * @param {Event} e - The keyboard event.
     */
    const setKeyboardIntegerNumber = (e) => {
      if (e.key === "." || e.key === ",") {
        e.preventDefault();
      }
    };

    /**
     * Prevents keyboard input for non-formatted number values.
     * @function setKeyboardFormatedNumber
     * @param {Event} e - The keyboard event.
     */
    const setKeyboardFormatedNumber = (e) => {
      if (e.key === "." || e.key === "-") {
        e.preventDefault();
      }
    };

    // Watcher to handle changes in the plant state. Updates related fields and dispatches changes to the store.
    watch(
      () => plantState.value, // Watch the value of plantState
      (newValue, oldValue) => {
        // If the old value is an empty string, update the plant state in the store
        if (oldValue === "") {
          store.dispatch("plant/setValue", {
            input: "plantState",
            value: newValue,
          });
        }

        // If the new plant state is 'świeży'
        if (newValue === "świeży") {
          // Clear the drying time if the previous state was 'podsuszony'
          if (oldValue === "podsuszony") {
            store.dispatch("plant/setValue", {
              input: "dryingTime",
              value: null,
            });
          }
          // Clear the plant age if the previous state was 'suchy'
          if (oldValue === "suchy") {
            store.dispatch("plant/setValue", {
              input: "plantAge",
              value: null,
            });
          }
          // Update the plant state in the store
          store.dispatch("plant/setValue", {
            input: "plantState",
            value: newValue,
          });
        }

        // If the new plant state is 'podsuszony'
        if (newValue === "podsuszony") {
          // Clear the plant age if the previous state was 'suchy'
          if (oldValue === "suchy") {
            store.dispatch("plant/setValue", {
              input: "plantAge",
              value: null,
            });
          }
          // Update the plant state in the store
          store.dispatch("plant/setValue", {
            input: "plantState",
            value: newValue,
          });
        }

        // If the new plant state is 'suchy'
        if (newValue === "suchy") {
          // Clear the drying time if the previous state was 'podsuszony'
          if (oldValue === "podsuszony") {
            store.dispatch("plant/setValue", {
              input: "dryingTime",
              value: null,
            });
          }
          // Update the plant state in the store
          store.dispatch("plant/setValue", {
            input: "plantState",
            value: newValue,
          });
        }
      }
    );

    // Watcher to handle changes in the isPlantSoaked state. Updates related fields and dispatches changes to the store.
    watch(
      () => isPlantSoaked.value, // Watch the value of isPlantSoaked
      (newValue, oldValue) => {
        // If the old value is false, update the soaked state in the store
        if (oldValue === false) {
          store.dispatch("plant/setValue", {
            input: "isPlantSoaked",
            value: newValue,
          });
        }

        // If the new value is false
        if (newValue === false) {
          // Clear soaking-related fields if the previous state was true
          if (oldValue === true) {
            store.dispatch("plant/setValue", {
              input: "soakingTime",
              value: null,
            });
            store.dispatch("plant/setValue", {
              input: "weightAfterSoaking",
              value: null,
            });
            store.dispatch("plant/setValue", {
              input: "isPlantSoaked",
              value: newValue,
            });
          }
        }
      }
    );

    return {
      formData,
      states,
      title,
      setNumberFormat,
      setIntegerNumber,
      setKeyboardIntegerNumber,
      setKeyboardFormatedNumber,
    };
  },
};
</script>

<style scoped>
.plant_data {
  display: flex;
  flex-direction: column;
  gap: 30px;
  justify-content: flex-start;
  text-align: left;
}

.plant_state {
  display: flex;
  flex-direction: row;
  gap: 50px;
  width: 80%;
}

.state_radioinput {
  width: 30%;
}
</style>