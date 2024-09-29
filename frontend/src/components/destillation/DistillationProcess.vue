// fetching apparatus form the my account saved distillation apparatus
<template>
  <div class="distillation__process">
    <!--Title for process part of distillation form-->
    <h5 class="distillation__title">destylacja</h5>
    <div class="distillation__informations">
      <!-- Autocomplete input for distillation Type -->
      <base-autocomplete-input
        v-model="distillationType"
        class="distillationType"
        label="Rodzaj destylacji"
        id="distillationType"
        :results="distillationTypes"
        :toChoose="toChoose"
        disabled="disabled"
        placeholder="wybierz rodzaj destylacji"
        @update:modelValue="setValue"
        @choose:item="setDistillationType"
        :invalidInput="
          isFormValid === false && formData.distillationType === ''
        "
      >
        <template v-slot:message>
          <span v-if="isFormValid === false && formData.distillationType === ''"
            >Wybierz rodzaj destylacji</span
          >
          <span v-else>&nbsp;</span>
        </template>
      </base-autocomplete-input>
      <div>
        <base-input-date-picker
          label="Data destylacji"
          title="Wybierz datę destylacji"
          id="distillationDate"
          class="distillationDate"
          :value="distillationDate"
          @date:value="setValue"
          :invalidInput="
            isFormValid === false && formData.distillationDate === ''
          "
        ></base-input-date-picker>
        <div class="message">
          <span v-if="isFormValid === false && formData.distillationDate === ''"
            >Wybierz datę destylacji</span
          >
          <span v-else>&nbsp;</span>
        </div>
      </div>
    </div>
    <!-- Autocomplete input for the distillation apparatus -->
    <base-autocomplete-input
      v-model="distillationApparatus"
      class="distillationApparatus"
      label="Rodzaj destylatora"
      id="distillationApparatus"
      :results="apparatus"
      :toChoose="toChoose"
      disabled="disabled"
      placeholder="wybierz rodzaj destylatora"
      @update:modelValue="setValue"
      @choose:item="setDistillationApparatus"
      :invalidInput="
        isFormValid === false && formData.distillationApparatus === ''
      "
    >
      <template v-slot:message>
        <span
          v-if="isFormValid === false && formData.distillationApparatus === ''"
          >Wybierz rodzaj destylacji</span
        >
        <span v-else>&nbsp;</span>
      </template>
    </base-autocomplete-input>
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
  </div>
</template>

<script>
import BaseAutocompleteInput from "@/ui/BaseAutocompleteInput.vue";
import BaseInputDatePicker from "@/ui/BaseInputDatePicker.vue";
import BaseTextInput from "@/ui/BaseTextInput.vue";
import {
  setIntegerNumber,
  setKeyboardIntegerNumber,
} from "@/helpers/formatHelpers.js";
import { useStore } from "vuex";
import { computed, ref, onMounted } from "vue";

export default {
  components: { BaseAutocompleteInput, BaseInputDatePicker, BaseTextInput },
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

    const distillationDate = computed(
      () => store.getters["distillation/distillationDate"]
    );

    const toChoose = ref(true);
    // Reference to indicate if the input is disabled
    const disabled = ref(true);

    const distillationType = ref("");
    const distillationTypes = ref(["wodna", "wodno-parowa", "parowa"]);
    const distillationApparatus = ref("");
    const apparatus = ref([
      "destylator stal nierdzewna 200l",
      "destylator stal nierdzewna 100l",
    ]);

    const fetchData = (key, value) => {
      store.dispatch("distillation/fetchLocalStorageData", {
        key: key,
        isPlant: value,
      });
    };

    onMounted(() => {
      fetchData("distillationDate", false);
      fetchData("distillationType", false);
      fetchData("distillationApparatus", false);
      fetchData("waterForDistillation", false);
      distillationType.value = formData.value.distillationType;
      distillationApparatus.value = formData.value.distillationApparatus;
    });

    const setValue = (value, input) => {
      store.dispatch("distillation/setValue", { input: input, value: value });
    };

    const setDistillationType = (value, input) => {
      setValue(value, input);
      distillationType.value = value;
      console.log("setDistill", value, input);
    };

    const setDistillationApparatus = (value, input) => {
      setValue(value, input);
      distillationApparatus.value = value;
      console.log("setApparatus", value, input);
    };

    // Using the format function
    const setInteger = (value, id, storeName) => {
      setIntegerNumber(store, value, id, storeName);
    };

    return {
      storeName,
      formData,
      distillationDate,
      toChoose,
      disabled,
      distillationType,
      distillationTypes,
      distillationApparatus,
      apparatus,
      setValue,
      setDistillationType,
      setDistillationApparatus,
      setInteger,
      setKeyboardIntegerNumber,
    };
  },
};
</script>

<style scoped>
.distillation__process {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.distillation__title {
  margin-bottom: 20px;
  font-size: 16px;
}

.distillation__informations {
  display: flex;
  flex-direction: row;
  gap: 50px;
  width: 100%;
}

.distillationType {
  flex-grow: 2;
}

.distillationDate {
  flex-grow: 1;
}

.message {
  color: var(--error-color);
  font-size: 12px;
  text-align: left;
}
</style>
