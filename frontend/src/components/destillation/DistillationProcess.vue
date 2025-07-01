<template>
  <div class="distillation-process">
    <!-- Title for process part of distillation form -->
    <h5 class="distillation-process__title">destylacja</h5>
    <div class="distillation-process__informations">
      <!-- Autocomplete input for distillation type -->
      <base-autocomplete-input
        v-model="distillationType"
        class="distillation-process__type"
        label="Rodzaj destylacji"
        id="distillationType"
        :results="distillationTypes"
        :toChoose="toChoose"
        :disabled="disabled"
        placeholder="wybierz rodzaj destylacji"
        color="distillation"
        @update:modelValue="setValue"
        @choose:item="setDistillationType"
        :invalidInput="
          wasSubmitted && !isFormValid && !formData.distillationType
        "
      >
        <!-- Validation message for distillation type -->
        <template v-slot:message>
          <span
            v-if="wasSubmitted && !isFormValid && !formData.distillationType"
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
          class="distillation-process__date-picker"
          :value="distillationDate"
          @date:value="setValue"
          :invalidInput="
            wasSubmitted && !isFormValid && !formData.distillationDate
          "
          color="distillation"
        ></base-input-date-picker>
        <!-- Validation message for distillation date -->
        <div class="distillation-process__message">
          <span
            v-if="wasSubmitted && !isFormValid && !formData.distillationDate"
            >Wybierz datę destylacji</span
          >
          <span v-else>&nbsp;</span>
        </div>
      </div>
    </div>
    <!-- Autocomplete input for the distillation apparatus -->
    <base-autocomplete-input
      v-model="distillationApparatus"
      label="Rodzaj destylatora"
      id="distillationApparatus"
      :results="apparatus"
      :toChoose="toChoose"
      :disabled="disabled"
      placeholder="wybierz rodzaj destylatora"
      color="distillation"
      @update:modelValue="setValue"
      @choose:item="setDistillationApparatus"
      :invalidInput="
        wasSubmitted && !isFormValid && !formData.distillationApparatus
      "
    >
      <!-- Validation message for distillation apparatus -->
      <template v-slot:message>
        <span
          v-if="wasSubmitted && !isFormValid && !formData.distillationApparatus"
          >Wybierz rodzaj destylatora</span
        >
        <span v-else>&nbsp;</span>
      </template>
    </base-autocomplete-input>
  </div>
</template>

<script lang="ts">
import { computed, ref, onMounted, onBeforeMount, watch } from "vue";
import BaseAutocompleteInput from "@/ui/BaseAutocompleteInput.vue";
import BaseInputDatePicker from "@/ui/BaseInputDatePicker.vue";
import { ResultsDistillation } from "@/types/forms/resultsForm";
import { DistillationForm } from "@/types/forms/distillationForm";
import { DistillationType } from "@/types/enums";
import { DistillerWithId } from "@/types/distiller";
import { useStore } from "@/store/useStore";

/**
 * @component DistillationProcess
 * @description Handles the distillation process inputs, such as selecting the distillation type, apparatus, and setting the date.
 * Integrates with Vuex to store form data and manage state updates.
 * @props {boolean} isFormValid - Indicates if the form is valid.
 * @props {boolean} wasSubmitted - Indicates if the form was submitted.
 * @props {boolean} [isEditing] - Indicates if the form is in editing mode.
 * @see fetchData
 * @see setValue
 * @see setDistillationType
 * @see setDistillationApparatus
 */

/**
 * Props for DistillationProcess component.
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
  name: "DistillationProcess",
  components: { BaseAutocompleteInput, BaseInputDatePicker },
  props: ["isFormValid", "wasSubmitted", "isEditing"],
  setup(props: Props) {
    // Vuex store instance
    const store = useStore();

    // Computed property for form data from Vuex
    const formData = computed<ResultsDistillation | DistillationForm>(() =>
      props.isEditing
        ? store.getters["results/distillationData"]
        : store.getters["distillation/distillationForm"]
    );

    // Computed property for distillation date from Vuex
    const distillationDate = computed<string>(() =>
      props.isEditing
        ? store.getters["results/distillationDate"]
        : store.getters["distillation/distillationDate"]
    );

    // Computed property for navigation state
    const comingFromRoute = computed<boolean>(
      () => store.getters.comingFromRoute
    );

    // Ref for showing arrow in autocomplete
    const toChoose = ref<boolean>(true);
    // Ref for disabling input
    const disabled = ref<boolean>(true);

    // Ref for selected distillation type
    const distillationType = ref<DistillationType | "">("");
    // Ref for available distillation types
    const distillationTypes = ref<DistillationType[]>([
      DistillationType.WODNA,
      DistillationType.WODNO_PAROWA,
      DistillationType.PAROWA,
    ]);

    // Computed property for distiller list from Vuex
    const distillerList = computed<DistillerWithId[]>(
      () => store.getters["settings/distillerList"]
    );

    // Ref for selected distillation apparatus
    const distillationApparatus = ref<string>("");

    // Computed property for apparatus options
    const apparatus = computed<string[]>(() => {
      return distillerList.value
        ? distillerList.value.map(
            (distiller: DistillerWithId) =>
              `Destylator ${distiller.material} - ${distiller.capacity}l - ${distiller.heating}`
          )
        : [];
    });

    // Watch for changes in distillation type and update ref
    watch(
      () => formData.value.distillationType,
      (newDistillationType) => {
        distillationType.value = newDistillationType as DistillationType | "";
      }
    );

    // Watch for changes in distillation apparatus and update ref
    watch(
      () => formData.value.distillationApparatus,
      (newDistillationApparatus: string) => {
        distillationApparatus.value = newDistillationApparatus;
      }
    );

    /**
     * Fetches initial data from local storage via the Vuex store for a specified key.
     * @param {string} key - The key for the specific data to fetch.
     * @param {boolean} value - Indicates if the fetched data is related to plant information.
     */
    const fetchData = (key: string, value: boolean): void => {
      store.dispatch("distillation/fetchLocalStorageData", {
        key: key,
        isPlant: value,
      });
    };

    /**
     * Fetches archive data from local storage via the Vuex store for a specified key.
     * @param {string} key - The key for the specific data to fetch.
     */
    const fetchArchiveData = (key: string): void => {
      store.dispatch("results/fetchDistillationDataFromLocalStorage", key);
    };

    // Fetch distiller list before mount
    onBeforeMount(() => {
      store.dispatch("settings/fetchLocalStorageData", {
        key: "distillerList",
      });
    });

    // Fetch initial form data from local storage on component mount
    onMounted(() => {
      if (!comingFromRoute.value) {
        const keys: string[] = [
          "distillationDate",
          "distillationType",
          "distillationApparatus",
        ];
        if (props.isEditing) {
          keys.forEach((key) => {
            fetchArchiveData(key);
          });
        } else {
          keys.forEach((key) => {
            fetchData(key, false);
          });
        }
      }
      distillationType.value = formData.value.distillationType as
        | DistillationType
        | "";
      distillationApparatus.value = formData.value.distillationApparatus;
    });

    /**
     * Updates the value of a specified input field in the Vuex store.
     * @param {string} value - The value to set for the input.
     * @param {string} input - The key for the specific input field.
     */
    const setValue = (value: string, input: string): void => {
      if (props.isEditing) {
        store.dispatch("results/setDistillationDataValue", {
          input: input,
          value: value,
        });
      } else {
        store.dispatch("distillation/setValue", { input: input, value: value });
      }
    };

    /**
     * Handles setting the selected distillation type and updating the store.
     * @param {string} value - The selected distillation type.
     * @param {string} input - The input field triggering the event.
     */
    const setDistillationType = (
      value: DistillationType,
      input: string
    ): void => {
      setValue(value, input);
      distillationType.value = value;
    };

    /**
     * Sets the selected distillation apparatus and updates the store.
     * @param {string} value - The selected distillation apparatus.
     * @param {string} input - The input field triggering the event.
     */
    const setDistillationApparatus = (value: string, input: string): void => {
      setValue(value, input);
      distillationApparatus.value = value;
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
.distillation-process {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.distillation-process__title {
  font-size: 16px;
}

.distillation-process__informations {
  display: flex;
  flex-direction: row;
  gap: 50px;
  width: 100%;
}

.distillation-process__type {
  flex-grow: 2;
}

.distillation-process__date-picker {
  flex-grow: 1;
}

.distillation-process__message {
  color: var(--error-color);
  font-size: 12px;
  text-align: left;
  margin-top: 5px;
}

@media (max-width: 1024px) {
  .distillation-process__informations {
    flex-direction: column;
    gap: 20px;
  }
}
</style>
