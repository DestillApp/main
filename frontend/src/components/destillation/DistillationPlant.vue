// no docs
<template>
  <div>
    <!--Title for plant part of distillation form-->
    <h5>surowiec</h5>
    <!-- Input field for entering the plant weight that will be use for distillation-->
    <base-text-input v-model="formData.weightForDistillation" type="number" classType="number" :invalidInput="
        isFormValid === false && formData.weightForDistillation === null
      " :storeName="storeName" @change:modelValue="setNumber" @set:keyboard="setKeyboardFormatedNumber"
      label="Waga surowca użytego do destylacji" id="weightForDistillation" placeholder="kg" min="0.1" step="0.1">
      <template v-slot:unit>
        <div v-if="formData.weightForDistillation !== null">kg</div>
      </template>
      <template v-slot:message>
        <span v-if="
            isFormValid === false && formData.weightForDistillation === null
          ">Wpisz wagę surowca</span>
        <span v-else>&nbsp;</span>
      </template>
    </base-text-input>
    <!-- Checkbox for indicating if the plant was soaked -->
    <v-checkbox v-model="formData.isPlantSoaked" label="Surowiec namaczany przed destylacją"
      color="var(--secondary-color)"></v-checkbox>
    <!-- Additional inputs displayed if the plant was soaked -->
    <div v-if="formData.isPlantSoaked">
      <!-- Input field for entering the soaking time -->
      <base-text-input v-model="formData.soakingTime" type="number" classType="number"
        :invalidInput="isFormValid === false && formData.soakingTime === null" :storeName="storeName"
        @update:modelValue="setInteger" @set:keyboard="setKeyboardIntegerNumber" label="Czas namaczania" placeholder="h"
        id="soakingTime" min="1" step="1">
        <template v-slot:unit>
          <div v-if="formData.soakingTime !== null">h</div>
        </template>
        <template v-slot:message>
          <span v-if="isFormValid === false && formData.soakingTime === null">Wpisz czas namaczania</span>
          <span v-else>&nbsp;</span>
        </template>
      </base-text-input>
      <!-- Input field for entering the weight after soaking -->
      <base-text-input v-model="formData.weightAfterSoaking" type="number" classType="number" :invalidInput="
          isFormValid === false && formData.weightAfterSoaking === null
        " :storeName="storeName" @change:modelValue="setNumber" @set:keyboard="setKeyboardFormatedNumber"
        label="Waga surowca po namoczeniu" placeholder="kg" id="weightAfterSoaking" min="0.1" step="0.1">
        <template v-slot:unit>
          <div v-if="formData.weightAfterSoaking !== null">kg</div>
        </template>
        <template v-slot:message>
          <span v-if="isFormValid === false && formData.weightAfterSoaking === null">Wpisz wagę po namaczaniu</span>
          <span v-else>&nbsp;</span>
        </template>
      </base-text-input>
    </div>
    <!-- Checkbox for indicating if the plant was shredded -->
    <v-checkbox v-model="formData.isPlantShredded" label="Surowiec rozdrobniony przed destylacją"
      color="var(--secondary-color)"></v-checkbox>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { onMounted, computed, watch } from "vue";
import {
  setIntegerNumber,
  setNumberFormat,
  setKeyboardIntegerNumber,
  setKeyboardFormatedNumber,
} from "@/helpers/formatHelpers.js";
import BaseTextInput from "@/ui/BaseTextInput.vue";

export default {
  name: "DistillationPlant",
  components: { BaseTextInput },
  props: ["isFormValid"],
  setup() {
    // Vuex store
    const store = useStore();

    // Name of the vuex store module
    const storeName = "distillation";

    // Computed properties to get form data from Vuex store
    const formData = computed(
      () => store.getters["distillation/distillationForm"]
    );
    const isPlantSoaked = computed(
      () => store.getters["distillation/isPlantSoaked"]
    );
    const isPlantShredded = computed(
      () => store.getters["distillation/isPlantShredded"]
    );

    // Fetch initial data from local storage on component mount
    onMounted(() => {
      store.dispatch("distillation/fetchLocalStorageData", "weightForDistillation");
      store.dispatch("distillation/fetchLocalStorageData", "isPlantSoaked");
      store.dispatch("distillation/fetchLocalStorageData", "soakingTime");
      store.dispatch(
        "distillation/fetchLocalStorageData",
        "weightAfterSoaking"
      );
      store.dispatch("distillation/fetchLocalStorageData", "isPlantShredded");

    });

    // Using the format function
    const setInteger = (value, id, storeName) => {
      setIntegerNumber(store, value, id, storeName);
    };

    // Using the format function
    const setNumber = (value, id, storeName) => {
      setNumberFormat(store, value, id, storeName);
    };

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

    // Watcher to handle changes in the isPlantShredded state. Updates related field and dispatches changes to the store.
    watch(
      () => isPlantShredded.value, // Watch the value of isPlantShredded
      (newValue, oldValue) => {
        // If the old value is false, update the soaked state in the store
        if (oldValue !== newValue) {
          store.dispatch("plant/setValue", {
            input: "isPlantShredded",
            value: newValue,
          });
        }
      });

    return {
      storeName,
      formData,
      isPlantSoaked,
      setNumber,
      setInteger,
      setKeyboardIntegerNumber,
      setKeyboardFormatedNumber,
    };
  },
};
</script>
