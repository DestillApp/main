<template>
  <!-- Container for the plant data form -->
  <div class="plant_data">
    <!-- Input field for entering the plant weight -->
    <base-text-input
      v-model="formData.plantWeight"
      type="number"
      classType="number"
      :invalidInput="isFormValid === false && formData.plantWeight === null"
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
        v-if="
          formData.plantState === 'suchy' && formData.plantOrigin === 'kupno'
        "
        v-model="formData.plantAge"
        type="number"
        classType="number"
        :invalidInput="isFormValid === false && formData.plantAge === null"
        :storeName="storeName"
        @update:modelValue="setInteger"
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
  </div>
</template>

<script>
import { useStore } from "vuex";
import { ref, reactive, computed, watch, onMounted } from "vue";
import {
  setIntegerNumber,
  setNumberFormat,
  setKeyboardIntegerNumber,
  setKeyboardFormatedNumber,
} from "@/helpers/formatHelpers.js";
import BaseTextInput from "@/ui/BaseTextInput.vue";

/**
 * @component PlantData
 * @description This component renders inputs and manage data related to plant material used in distillation, including weight, state, and soaking information.
 * @see setNumberFormat
 * @see setIntegerNumber
 * @see setKeyboardIntegerNumber
 * @see setKeyboardFormatedNumber
 */
export default {
  name: "PlantData",
  components: { BaseTextInput },
  props: ["isFormValid", "isResetting"],
  setup(props) {
    // Options for plant state
    const states = reactive(["świeży", "podsuszony", "suchy"]);
    // Title of the radio inputs
    const title = ref("Stan surowca");

    // Vuex store
    const store = useStore();
    // Name of the vuex store module
    const storeName = "plant";

    // Computed properties to get form data from Vuex store
    const formData = computed(() => store.getters["plant/plantForm"]);
    const plantState = computed(() => store.getters["plant/plantState"]);

    // Fetch initial data from local storage on component mount
    onMounted(() => {
      store.dispatch("plant/fetchLocalStorageData", "plantWeight");
      store.dispatch("plant/fetchLocalStorageData", "plantState");
      store.dispatch("plant/fetchLocalStorageData", "dryingTime");
      store.dispatch("plant/fetchLocalStorageData", "plantAge");
    });

    // Using the format function
    const setInteger = (value, id, storeName) => {
      setIntegerNumber(store, value, id, storeName);
    };

    // Using the format function
    const setNumber = (value, id, storeName) => {
      setNumberFormat(store, value, id, storeName);
    };

    // Watcher to handle changes in the plant state. Updates related fields and dispatches changes to the store.
    watch(
      () => plantState.value, // Watch the value of plantState
      (newValue, oldValue) => {
        if (props.isResetting) {
          return;
        } else {
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
      }
    );

    return {
      storeName,
      formData,
      states,
      title,
      setNumber,
      setInteger,
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