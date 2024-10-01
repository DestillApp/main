// no arch docs and code docs
<template>
  <div class="distillation__data">
    <!-- Input field for entering the amount of water used in distillation -->
    <base-text-input
      v-model="formData.waterForDistillation"
      type="number"
      classType="number"
      placeholder="l"
      :invalidInput="
        isFormValid === false && formData.waterForDistillation === null
      "
      :storeName="storeName"
      @update:modelValue="setInteger"
      @set:keyboard="setKeyboardIntegerNumber"
      label="Ilość wody użytej do destylacji"
      id="waterForDistillation"
      min="0"
      step="1"
    >
      <template v-slot:unit>
        <div v-if="formData.waterForDistillation !== null">l</div>
      </template>
      <template v-slot:message>
        <span
          v-if="isFormValid === false && formData.waterForDistillation === null"
          >Wpisz ilość wody użytej do destylacji</span
        >
        <span v-else>&nbsp;</span>
      </template>
    </base-text-input>
    <div class="distillation__time">
      <base-text-input
        v-model="formData.distillationTime.distillationHours"
        type="number"
        classType="number"
        placeholder="h"
        :invalidInput="
          !isFormValid &&
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
              !isFormValid &&
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
        :invalidInput="
              !isFormValid &&
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
          <div v-if="formData.distillationTime.distillationMinutes">
            min
          </div>
        </template></base-text-input
      >
    </div>
  </div>
</template>

<script>
import { onMounted, computed } from "vue";
import { useStore } from "vuex";
import BaseTextInput from "@/ui/BaseTextInput.vue";
import {
  setIntegerNumber,
  setKeyboardIntegerNumber,
} from "@/helpers/formatHelpers.js";

export default {
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

    onMounted(() => {
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
    });

    // Using the format function to handle integer input for water volume
    const setInteger = (value, id, storeName) => {
      setIntegerNumber(store, value, id, storeName);
    };

    const saveTime = (value, key) => {
      if (!value || isNaN(value)) {
        store.dispatch("distillation/setValue", { input: key, value: null });
       } else {
        store.dispatch("distillation/setDistillationTime", { key, value });
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
.distillation__data {
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