// no arch docs
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
        color="distillation"
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
        <!-- Date picker input for selecting the distillation date -->
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
           color="distillation"
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
      color="distillation"
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
  </div>
</template>

<script>
import BaseAutocompleteInput from "@/ui/BaseAutocompleteInput.vue";
import BaseInputDatePicker from "@/ui/BaseInputDatePicker.vue";

import { useStore } from "vuex";
import { computed, ref, onMounted } from "vue";

/**
 * @component DistillationProcess
 * @description This component handles the distillation process inputs, such as selecting the distillation type, apparatus, and setting the date.
 * It integrates with Vuex to store form data and manage state updates.
 * @see fetchData
 * @see setValue
 * @see setDistillationType
 * @see setDistillationApparatus
 */

export default {
  name: "DistillationProcess",
  components: { BaseAutocompleteInput, BaseInputDatePicker },
  props: ["isFormValid"],
  setup() {
    // Vuex store
    const store = useStore();

    // Computed properties to get form data from Vuex store
    const formData = computed(
      () => store.getters["distillation/distillationForm"]
    );
    const distillationDate = computed(
      () => store.getters["distillation/distillationDate"]
    );

    // Flag to indicate if the autocomplete input should have the arrow input
    const toChoose = ref(true);
    // Reference to indicate if the input is disabled
    const disabled = ref(true);

    //Reactive references related to choosing distillation type
    const distillationType = ref("");
    const distillationTypes = ref(["wodna", "wodno-parowa", "parowa"]);

    //Reactive references related to choosing distillation apparatus
    const distillationApparatus = ref("");
    const apparatus = ref([
      "destylator stal nierdzewna 200l",
      "destylator stal nierdzewna 100l",
    ]);

    /**
     * @function fetchData
     * @description Fetches initial data from local storage via the Vuex store for a specified key.
     * @param {string} key - The key for the specific data to fetch.
     * @param {boolean} value - Indicates if the fetched data is related to plant information.
     */
    const fetchData = (key, value) => {
      store.dispatch("distillation/fetchLocalStorageData", {
        key: key,
        isPlant: value,
      });
    };

    // Fetch initial form data from local storage on component mount
    onMounted(() => {
      fetchData("distillationDate", false);
      fetchData("distillationType", false);
      fetchData("distillationApparatus", false);
      distillationType.value = formData.value.distillationType;
      distillationApparatus.value = formData.value.distillationApparatus;
    });

    /**
     * @function setValue
     * @description Updates the value of a specified input field in the Vuex store.
     * @param {string} value - The value to set for the input.
     * @param {string} input - The key for the specific input field.
     */
    const setValue = (value, input) => {
      store.dispatch("distillation/setValue", { input: input, value: value });
    };

    /**
     * @function setDistillationType
     * @description Handles setting the selected distillation type and updating the store.
     * @param {string} value - The selected distillation type.
     * @param {string} input - The input field triggering the event.
     */
    const setDistillationType = (value, input) => {
      setValue(value, input);
      distillationType.value = value;
      console.log("setDistill", value, input);
    };

    /**
     * @function setDistillationApparatus
     * @description Sets the selected distillation apparatus and updates the store.
     * @param {string} value - The selected distillation apparatus.
     * @param {string} input - The input field triggering the event.
     */
    const setDistillationApparatus = (value, input) => {
      setValue(value, input);
      distillationApparatus.value = value;
      console.log("setApparatus", value, input);
    };

    return {
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
