<template>
  <div class="distillation-process">
    <!--Title for process part of distillation form-->
    <h5 class="distillation-process__title">destylacja</h5>
    <div class="distillation-process__informations">
      <!-- Autocomplete input for distillation Type -->
      <base-autocomplete-input
        v-model="distillationType"
        class="distillation-process__type"
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
          wasSubmitted && !isFormValid && !formData.distillationType
        "
      >
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
      disabled="disabled"
      placeholder="wybierz rodzaj destylatora"
      color="distillation"
      @update:modelValue="setValue"
      @choose:item="setDistillationApparatus"
      :invalidInput="
        wasSubmitted && !isFormValid && !formData.distillationApparatus
      "
    >
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
import {
  defineComponent,
  computed,
  ref,
  onMounted,
  onBeforeMount,
  watch,
} from "vue";
import BaseAutocompleteInput from "@/ui/BaseAutocompleteInput.vue";
import BaseInputDatePicker from "@/ui/BaseInputDatePicker.vue";

import { ResultsDistillation } from "@/types/forms/resultsForm";
import { DistillationForm } from "@/types/forms/distillationForm";

import { useStore } from "vuex";

/**
 * @component DistillationProcess
 * @description This component handles the distillation process inputs, such as selecting the distillation type, apparatus, and setting the date.
 * It integrates with Vuex to store form data and manage state updates.
 * @see fetchData
 * @see setValue
 * @see setDistillationType
 * @see setDistillationApparatus
 */

enum DistillationType {
  WODNA = "wodna",
  WODNO_PAROWA = "wodno-parowa",
  PAROWA = "parowa",
}

interface Distiller {
  id: string;
  material: string;
  capacity: number;
  heating: string;
}

interface Props {
  isFormValid: boolean;
  wasSubmitted: boolean;
  isEditing?: boolean;
}

export default defineComponent({
  name: "DistillationProcess",
  components: { BaseAutocompleteInput, BaseInputDatePicker },
  props: ["isFormValid", "wasSubmitted", "isEditing"],
  setup(props: Props) {
    // Vuex store
    const store = useStore();

    // Computed properties to get form data from Vuex store
    const formData = computed<ResultsDistillation | DistillationForm>(() =>
      props.isEditing
        ? store.getters["results/distillationData"]
        : store.getters["distillation/distillationForm"]
    );

    const distillationDate = computed<string>(() =>
      props.isEditing
        ? store.getters["results/distillationDate"]
        : store.getters["distillation/distillationDate"]
    );
    //Computed property to get the value from Vuex store
    const comingFromRoute = computed<boolean>(
      () => store.getters.comingFromRoute
    );

    // Flag to indicate if the autocomplete input should have the arrow input
    const toChoose = ref<boolean>(true);
    // Reference to indicate if the input is disabled
    const disabled = ref<boolean>(true);

    //Reactive references related to choosing distillation type
    const distillationType = ref<DistillationType | "">("");
    const distillationTypes = ref<DistillationType[]>([
      DistillationType.WODNA,
      DistillationType.WODNO_PAROWA,
      DistillationType.PAROWA,
    ]);

    // Computed property to get distillerList from Vuex store
    const distillerList = computed<Distiller[]>(
      () => store.getters["settings/distillerList"]
    );

    //Reactive references related to choosing distillation apparatus
    const distillationApparatus = ref<string>("");

    const apparatus = computed<string[]>(() => {
      return distillerList.value
        ? distillerList.value.map(
            (distiller: Distiller) =>
              `Destylator ${distiller.material} - ${distiller.capacity}l - ${distiller.heating}`
          )
        : [];
    });

    // Watch for changes in the specific formData values
    watch(
      () => formData.value.distillationType,
      (newDistillationType) => {
        distillationType.value = newDistillationType as DistillationType | "";
      }
    );

    watch(
      () => formData.value.distillationApparatus,
      (newDistillationApparatus: string) => {
        distillationApparatus.value = newDistillationApparatus;
      }
    );

    /**
     * @function fetchData
     * @description Fetches initial data from local storage via the Vuex store for a specified key.
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
     * @function fetchArchiveData
     * @description Fetches initial data from local storage via the Vuex store for a specified key.
     * @param {string} key - The key for the specific data to fetch.
     */
    const fetchArchiveData = (key: string): void => {
      store.dispatch("results/fetchDistillationDataFromLocalStorage", key);
    };

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
     * @function setValue
     * @description Updates the value of a specified input field in the Vuex store.
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
     * @function setDistillationType
     * @description Handles setting the selected distillation type and updating the store.
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
     * @function setDistillationApparatus
     * @description Sets the selected distillation apparatus and updates the store.
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
});
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
