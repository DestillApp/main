<template>
  <!-- Container for the plant orgin form -->
  <div class="plant_origin">
    <div>
      <!-- Radio input for plant origin selection -->
      <base-radio-input
        v-model="formData.plantOrigin"
        :options="origins"
        :title="title"
        name="plantOrigin"
      >
        <template v-slot:message>
          <span v-if="isFormValid === false && formData.plantOrigin === ''"
            >Wybierz pochodzenie surowca</span
          >
          <span v-else>&nbsp;</span>
        </template></base-radio-input
      >
    </div>
    <!-- Container for harvest details, displayed if plant origin is 'zbiór' -->
    <div v-if="formData.plantOrigin === 'zbiór'" class="plant_origin--harvest">
      <div>
        <!-- Date picker for selecting harvest date -->
        <base-input-date-picker
          label="Data zbioru"
          title="Wybierz datę zbioru"
          id="harvestDate"
          :value="formData.harvestDate"
          @date:value="storeDate"
          :invalidInput="isFormValid === false && formData.harvestDate === ''"
        >
        </base-input-date-picker>
        <div class="message">
          <span v-if="isFormValid === false && formData.harvestDate === ''"
            >Wybierz datę zbioru</span
          >
          <span v-else>&nbsp;</span>
        </div>
      </div>
      <div class="harvest_conditions">
        <!-- Input field for entering harvest temperature -->
        <base-text-input
          v-model="formData.harvestTemperature"
          type="number"
          classType="number"
          placeholder="°C"
          :invalidInput="
            isFormValid === false && formData.harvestTemperature === null
          "
          @update:modelValue="setIntegerNumber"
          @set:keyboard="setKeyboardIntegerNumber"
          label="Temperatura podczas zbioru"
          id="harvestTemperature"
          min="-15"
          max="40"
          step="1"
        >
          <template v-slot:unit>
            <div v-if="formData.harvestTemperature !== null">°C</div>
          </template>
          <template v-slot:message>
            <span
              v-if="
                isFormValid === false && formData.harvestTemperature === null
              "
              >Wpisz temperaturę zbioru</span
            >
            <span v-else>&nbsp;</span>
          </template>
        </base-text-input>
        <div class="hours_container">
          <!-- Label for the harvest hours slider -->
          <label for="hours_slider" class="hours_label">Godziny zbioru</label>
          <!-- Range slider for selecting harvest hours -->
          <v-range-slider
            v-model="formData.harvestRange"
            class="slider"
            id="hours_slider"
            :min="300"
            :max="1320"
            :step="15"
            color="var(--secondary-color)"
          >
            <template v-slot:prepend>
              <base-text-input
                v-model="formData.harvestStartTime"
                type="text"
                classType="time"
                id="start_time"
                disabled="disabled"
              ></base-text-input>
            </template>
            <template v-slot:append>
              <base-text-input
                v-model="formData.harvestEndTime"
                type="text"
                classType="time"
                id="end_time"
                disabled="disabled"
              ></base-text-input>
            </template>
          </v-range-slider>
        </div>
      </div>
    </div>
    <!-- Container for purchase details, displayed if plant origin is 'kupno' -->
    <div v-if="formData.plantOrigin === 'kupno'" class="plant_origin--buy">
      <div>
        <!-- Date picker for selecting purchase date -->
        <base-input-date-picker
          label="Data zakupu"
          title="Wybierz datę zakupu"
          id="plantBuyDate"
          :value="formData.plantBuyDate"
          @date:value="storeDate"
          :invalidInput="isFormValid === false && formData.plantBuyDate === ''"
        ></base-input-date-picker>
        <div class="message">
          <span v-if="isFormValid === false && formData.plantBuyDate === ''"
            >Wybierz datę zakupu</span
          >
          <span v-else>&nbsp;</span>
        </div>
      </div>
      <!-- Input field for entering the name of the producer -->
      <div class="buy_containter">
        <base-text-input
          class="buy_producer"
          v-model="formData.plantProducer"
          type="text"
          label="Nazwa producenta"
          id="plantProducer"
          :invalidInput="isFormValid === false && formData.plantProducer === ''"
          @update:modelValue="setValue"
        >
          <template v-slot:message>
            <span v-if="isFormValid === false && formData.plantProducer === ''"
              >Wpisz nazwę producenta</span
            >
            <span v-else>&nbsp;</span>
          </template>
        </base-text-input>
        <!-- Autocomplete input for the country of origin -->
        <base-autocomplete-input
          v-model="formData.countryOfOrigin"
          class="buy_country"
          label="Kraj pochodzenia"
          id="countryOfOrigin"
          :results="countryNames"
          :invalidInput="
            isFormValid === false && formData.countryOfOrigin === ''
          "
          @update:modelValue="setValue"
          @input="onInput"
        >
          <template v-slot:message>
            <span
              v-if="isFormValid === false && formData.countryOfOrigin === ''"
              >Wybierz kraj pochodzenia</span
            >
            <span v-else>&nbsp;</span>
          </template>
        </base-autocomplete-input>
      </div>
    </div>
  </div>
</template>


<script>
import { useStore } from "vuex";
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useApolloClient } from "@vue/apollo-composable";
import BaseInputDatePicker from "@/ui/BaseInputDatePicker.vue";
import BaseTextInput from "@/ui/BaseTextInput.vue";
import BaseAutocompleteInput from "@/ui/BaseAutocompleteInput.vue";
import { GET_COUNTRY_NAMES } from "@/graphql/queries/country.js";

/**
 * @component PlantOrigin
 * @description This component renders a form to input and manage data related to plant used in distillation, including origin, harvest date, harvest temperature, harvest range, buy date and producer details.
 * @see setValue
 * @see setIntegerValue
 * @see setKeyboardIntegerNumber
 * @see storeDate
 */
export default {
  name: "PlantOrigin",
  components: { BaseInputDatePicker, BaseTextInput, BaseAutocompleteInput },
  props: ["isFormValid"],
  setup() {
    // Title of the radio inputs
    const title = ref("Pochodzenie surowca");
    // Options for plant origin
    const origins = reactive(["zbiór", "kupno"]);

    // Vuex store
    const store = useStore();
    // Computed properties to get form data from Vuex store
    const formData = computed(() => store.getters["plant/plantForm"]);
    const harvestRange = computed(() => store.getters["plant/harvestRange"]);
    const plantOrigin = computed(() => store.getters["plant/plantOrigin"]);

    // Fetch initial data from local storage on component mount
    onMounted(() => {
      store.dispatch("plant/fetchLocalStorageData", "plantOrigin");
      store.dispatch("plant/fetchLocalStorageData", "plantBuyDate");
      store.dispatch("plant/fetchLocalStorageData", "plantProducer");
      store.dispatch("plant/fetchLocalStorageData", "countryOfOrigin");
      store.dispatch("plant/fetchLocalStorageData", "harvestDate");
      store.dispatch("plant/fetchLocalStorageData", "harvestTemperature");
      store.dispatch("plant/fetchLocalStorageData", "harvestRange");
    });

    /**
     * Function to dispatch an action to the Vuex store to set a specific value.
     * @function setValue
     * @param {any} currentValue - The current value to be set.
     * @param {string} input - The input field name.
     */
    const setValue = (currentValue, input) => {
      store.dispatch("plant/setValue", { input, value: currentValue });
    };

    /**
     * Function to format number input to integer and dispatch to store
     * @function setIntegerNumber
     * @param {number} currentValue - The current value to be formatted.
     * @param {string} input - The input field name.
     */
    //Function to format number input to integer and dispatch to store
    const setIntegerNumber = (currentValue, input) => {
      if (!currentValue || isNaN(currentValue)) {
        store.dispatch("plant/setValue", { input, value: null });
      } else {
        store.dispatch("plant/setIntegerValue", { input, value: currentValue });
      }
    };

    /**
     * Prevent keyboard input for non-integer values
     * @function setKeyboardIntegerNumber
     * @param {Event} e - The keyboard event.
     */
    const setKeyboardIntegerNumber = (e) => {
      if (e.key === "." || e.key === ",") {
        e.preventDefault();
      }
    };

    /**
     * Function to store a date value in the Vuex store
     * @function storeDate
     * @param {Date} date - The date value to be stored.
     * @param {string} input - The input field name.
     */
    const storeDate = (date, input) => {
      store.dispatch("plant/setValue", { input, value: date });
    };

    // Watcher to handle changes in harvest range
    watch(harvestRange, (newValue) => {
      store.dispatch("plant/setStartTime");
      store.dispatch("plant/setEndTime");
      store.dispatch("plant/setValue", {
        input: "harvestRange",
        value: newValue,
      });
    });

    // Watcher to handle changes in the plant origin
    watch(
      () => plantOrigin.value, // Watch the value of plantOrigin
      (newValue, oldValue) => {
        store.dispatch("plant/setValue", {
          input: "plantOrigin",
          value: newValue,
        });

        // If the new plant origin is 'kupno'
        if (newValue === "kupno") {
          // Set data to initial values if the previous origin was 'zbiór'
          if (oldValue === "zbiór") {
            store.dispatch("plant/setValue", {
              input: "harvestDate",
              value: "",
            });
            store.dispatch("plant/setValue", {
              input: "harvestTemperature",
              value: null,
            });
            store.dispatch("plant/setValue", {
              input: "harvestRange",
              value: [600, 900],
            });
          }
        }

        // If the new plant origin is 'zbiór'
        if (newValue === "zbiór") {
          // Set data to initial values if the previous origin was 'kupno'
          if (oldValue === "kupno") {
            store.dispatch("plant/setValue", {
              input: "plantBuyDate",
              value: "",
            });
            store.dispatch("plant/setValue", {
              input: "plantProducer",
              value: "",
            });
          }
        }
      }
    );

    const countryNames = ref([]);
    const searchQuery = ref("");
    const timeout = ref(null);
    const { resolveClient } = useApolloClient();
    const apolloClient = resolveClient();

    /**
     * Async function to fetch country names based on user input for the autocomplete component.
     * @async
     * @function fetchCountries
     * @param {string} name - The search query to fetch country names for.
     * @returns {Promise<void>} Resolves when the country names are fetched and stored in the reactive variable.
     * @throws {Error} Throws an error if the fetching fails.
     */
    const fetchCountries = async (name) => {
      try {
        const { data } = await apolloClient.query({
          query: GET_COUNTRY_NAMES,
          variables: { name },
        });
        countryNames.value = data.getCountryNames;
        console.log("countryNames", countryNames.value);
      } catch (error) {
        console.error("Failed to get country names:", error);
        countryNames.value = [];
      }
    };

    /**
     * Handles the input event for the search or autocomplete component.
     * Updates the search query and manages the debounce timer to limit the frequency of fetch requests.
     *
     * @function onInput
     * @param {Event} e - The input event triggered by user interaction.
     * @returns {void}
     */
    const onInput = (e) => {
      searchQuery.value = e.target.value;
      console.log(searchQuery.value);
      if (timeout.value) {
        clearTimeout(timeout.value);
      }

      timeout.value = setTimeout(() => {
        if (searchQuery.value.length > 0) {
          fetchCountries(searchQuery.value);
        } else {
          countryNames.value = [];
        }
      }, 500);
    };

    return {
      formData,
      plantOrigin,
      title,
      origins,
      setValue,
      setIntegerNumber,
      setKeyboardIntegerNumber,
      storeDate,
      onInput,
      countryNames,
    };
  },
};
</script>


<style scoped>
.plant_origin {
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: left;
}

.plant_origin--harvest {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.harvest_conditions {
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 50px;
}

.hours_container {
  flex-grow: 3;
}

.hours_label {
  margin-left: 8px;
  font-size: 15px;
  line-height: 1.5;
}

.slider :deep(.v-input__prepend) {
  margin-right: 16px;
}

.plant_origin--buy {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.buy_containter {
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 50px;
}

.buy_producer {
  flex-grow: 3;
}

.buy_country {
  flex-grow: 2;
}

.message {
  color: var(--error-color);
  font-size: 12px;
  text-align: left;
}
</style>
