// fetching apparatus form the my account 
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
    <div>
      <!-- Autocomplete input for the country of origin -->
      <base-autocomplete-input
        v-model="distillationApparatus"
        class="distillationApparatus"
        label="Rodzaj destylatora"
        id="distillationApparatus"
        :results="distillationTypes"
        :toChoose="toChoose"
        disabled="disabled"
        placeholder="wybierz rodzaj destylatora"
        @update:modelValue="setValue"
        @choose:item="setDistillationType"
      >
        <template v-slot:message>
          <span v-if="isFormValid === false && formData.distillationType === ''"
            >Wybierz rodzaj destylacji</span
          >
          <span v-else>&nbsp;</span>
        </template>
      </base-autocomplete-input>
    </div>
  </div>
</template>

<script>
import BaseAutocompleteInput from "@/ui/BaseAutocompleteInput.vue";
import BaseInputDatePicker from "@/ui/BaseInputDatePicker.vue";
import { useStore } from "vuex";
import { computed, ref, onMounted } from "vue";

export default {
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

    const toChoose = ref(true);
    // Reference to indicate if the input is disabled
    const disabled = ref(true);

    const distillationType = ref("");
    const distillationTypes = ref(["wodna", "wodno-parowa", "parowa"]);
    const distillationApparatus = ref('');

    const fetchData = (key, value) => {
      store.dispatch("distillation/fetchLocalStorageData", {
        key: key,
        isPlant: value,
      });
    };

    onMounted(() => {
      fetchData("distillationDate", false);
    });

    const setValue = (value, input) => {
      store.dispatch("distillation/setValue", { input: input, value: value });
    };

    const setDistillationType = (value, input) => {
      setValue(value, input);
      distillationType.value = value;
    };

    return {
      formData,
      distillationDate,
      toChoose,
      disabled,
      distillationType,
      distillationTypes,
      distillationApparatus,
      setValue,
      setDistillationType,
    };
  },
};
</script>

<template>
  <base-card>
    <h3>Zapisane destylatory</h3>
    <base-button>Dodaj destylator</base-button>
  </base-card>
</template>

<style scoped>
.distillation__process {
  display: flex;
  flex-direction: column;
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