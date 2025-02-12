<template>
  <div class="distillation">
    <!-- Input field for entering the amount of water used in distillation -->
    <base-text-input
      v-model="formData.waterForDistillation"
      type="number"
      classType="number"
      placeholder="l"
      inputColor="distillation"
      :invalidInput="isFormValid === false && !formData.waterForDistillation"
      :storeName="storeName"
      @update:modelValue="setInteger"
      @set:keyboard="setKeyboardIntegerNumber"
      label="Ilość wody użytej do destylacji"
      id="waterForDistillation"
      min="0"
      step="1"
    >
      <template v-slot:unit>
        <div v-if="formData.waterForDistillation">l</div>
      </template>
      <template v-slot:message>
        <span v-if="isFormValid === false && !formData.waterForDistillation">
          Wprowadź ilość wody użytej do destylacji
        </span>
        <span v-else>&nbsp;</span>
      </template>
    </base-text-input>
    <div class="distillation__time">
      <base-text-input
        v-model="formData.distillationTime.distillationHours"
        type="number"
        classType="number"
        placeholder="h"
        inputColor="distillation"
        :invalidInput="
          isFormValid === false &&
          !formData.distillationTime.distillationHours &&
          !formData.distillationTime.distillationMinutes
        "
        :storeName="storeName"
        @set:keyboard="setKeyboardIntegerNumber"
        @update:modelValue="saveTime"
        label="Długość procesu destylacji"
        id="distillationHours"
        min="0"
        step="1"
      >
        <template v-slot:unit>
          <div v-if="formData.distillationTime.distillationHours">h</div>
        </template>
        <template v-slot:message>
          <span
            v-if="
              isFormValid === false &&
              !formData.distillationTime.distillationHours &&
              !formData.distillationTime.distillationMinutes
            "
            >Wpisz długość procesu destylacji</span
          >
          <span v-else>&nbsp;</span>
        </template></base-text-input
      >
      <base-text-input
        v-model="formData.distillationTime.distillationMinutes"
        type="number"
        classType="number"
        class="distillation__minutes"
        placeholder="min"
        inputColor="distillation"
        :invalidInput="
          isFormValid === false &&
          !formData.distillationTime.distillationHours &&
          !formData.distillationTime.distillationMinutes
        "
        :storeName="storeName"
        @set:keyboard="setKeyboardIntegerNumber"
        @update:modelValue="saveTime"
        id="distillationMinutes"
        min="0"
        max="59"
        step="1"
      >
        <template v-slot:unit>
          <div v-if="formData.distillationTime.distillationMinutes">min</div>
        </template></base-text-input
      >
    </div>
  </div>
</template>

<script>
import BaseTextInput from "@/ui/BaseTextInput.vue";
import { useStore } from "vuex";
import { computed, onMounted } from "vue";
import {
  setIntegerNumber,
  setKeyboardIntegerNumber,
} from "@/helpers/formatHelpers.js";
import DOMPurify from "dompurify";

/**
 * @component DistillationData
 * @description This component handles the distillation data inputs, such as water used and distillation time.
 * It integrates with Vuex to store form data and manage state updates.
 * @see fetchData
 * @see setInteger
 * @see setKeyboardIntegerNumber
 * @see saveTime
 */

export default {
  name: "DistillationData",
  components: { BaseTextInput },
  props: ["isFormValid", "isEditing"],
  setup(props) {
    // Vuex store
    const store = useStore();

    // Computed properties to get form data from Vuex store
    const formData = computed(() =>
      props.isEditing
        ? store.getters["results/distillationData"]
        : store.getters["distillation/distillationForm"]
    );

    // Name of the vuex store module
    const storeName = computed(() =>
      props.isEditing ? "results" : "distillation"
    );

    // Fetch initial form data from local storage on component mount
    onMounted(() => {
      if (props.isEditing) {
        store.dispatch(
          "results/fetchDistillationDataFromLocalStorage",
          "waterForDistillation"
        );
        store.dispatch(
          "results/fetchDistillationTimeFromLocalStorage",
          "distillationHours"
        );
        store.dispatch(
          "results/fetchDistillationTimeFromLocalStorage",
          "distillationMinutes"
        );
      } else {
        store.dispatch("distillation/fetchLocalStorageData", {
          key: "waterForDistillation",
          isPlant: false,
        });
        store.dispatch(
          "distillation/fetchTimeFromLocalStorageData",
          "distillationHours"
        );
        store.dispatch(
          "distillation/fetchTimeFromLocalStorageData",
          "distillationMinutes"
        );
      }
    });

    // Using the format function to handle integer input for water volume
    const setInteger = (value, id, storeName) => {
      const sanitizedValue = Number(DOMPurify.sanitize(value));
      if (!isNaN(sanitizedValue) && sanitizedValue >= 0) {
        setIntegerNumber(store, sanitizedValue, id, storeName);
      } else {
        setIntegerNumber(store, null, id, storeName);
      }
    };

    const saveTime = (value, key) => {
      const sanitizedValue = Number(DOMPurify.sanitize(value));
      if (!isNaN(sanitizedValue) && sanitizedValue >= 0) {
        if (storeName.value === "distillation") {
          store.dispatch("distillation/setDistillationTime", { key, value: sanitizedValue });
        } else {
          store.dispatch("results/setDistillationTime", {
            input: key,
            value: sanitizedValue,
          });
        }
      } else {
        if (storeName.value === "distillation") {
          store.dispatch("distillation/setDistillationTime", { key, value: null });
        } else {
          store.dispatch("results/setDistillationTime", {
            input: key,
            value: null,
          });
        }
      }
    };

    return {
      storeName,
      formData,
      setInteger,
      setKeyboardIntegerNumber,
      saveTime,
    };
  },
};
</script>

<style scoped>
.distillation {
  display: flex;
  flex-direction: row;
  gap: 50px;
  margin-top: 30px;
  margin-bottom: 30px;
}

.distillation__time {
  position: relative;
  width: 40%;
}

.distillation__minutes {
  position: absolute;
  top: 23px;
  left: 100px;
}
</style>
