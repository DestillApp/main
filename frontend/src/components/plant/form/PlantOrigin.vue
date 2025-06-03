<template>
  <!-- Container for the plant origin form -->
  <div class="plant-origin">
    <div>
      <!-- Radio input for plant origin selection -->
      <base-radio-input
        v-model="formData.plantOrigin"
        :options="origins"
        :title="title"
        color="var(--secondary-color)"
        name="plantOrigin"
      >
        <template v-slot:message>
          <span v-if="wasSubmitted && !isFormValid && !formData.plantOrigin"
            >Wybierz pochodzenie surowca</span
          >
          <span v-else>&nbsp;</span>
        </template></base-radio-input
      >
    </div>
    <!-- Container for harvest details, displayed if plant origin is 'zbiór' -->
    <div v-if="formData.plantOrigin === 'zbiór'" class="plant-origin__harvest">
      <div>
        <!-- Date picker for selecting harvest date -->
        <base-input-date-picker
          label="Data zbioru"
          title="Wybierz datę zbioru"
          id="harvestDate"
          :value="formData.harvestDate"
          @date:value="storeDate"
          :invalidInput="wasSubmitted && !isFormValid && !formData.harvestDate"
          color="plant"
        >
        </base-input-date-picker>
        <div class="plant-origin__message">
          <span v-if="wasSubmitted && !isFormValid && !formData.harvestDate"
            >Wybierz datę zbioru</span
          >
          <span v-else>&nbsp;</span>
        </div>
      </div>
      <div class="plant-origin__harvest-conditions">
        <!-- Input field for entering harvest temperature -->
        <base-text-input
          v-model="formData.harvestTemperature"
          type="number"
          classType="number"
          placeholder="°C"
          inputColor="plant"
          :invalidInput="
            (wasSubmitted && !isFormValid && !formData.harvestTemperature) ||
            !isTemperatureCorrect
          "
          :storeName="storeName"
          @update:modelValue="
            (value, id) => setIntegerNumber(store, value, id, storeName)
          "
          @set:keyboard="setKeyboardIntegerNumber"
          label="Temperatura podczas zbioru"
          id="harvestTemperature"
          min="-15"
          max="40"
          step="1"
        >
          <template v-slot:unit>
            <div v-if="formData.harvestTemperature">°C</div>
          </template>
          <template v-slot:message>
            <span
              v-if="
                wasSubmitted && !isFormValid && !formData.harvestTemperature
              "
              >Wpisz temperaturę zbioru</span
            >
            <span v-else-if="!isTemperatureCorrect"
              >Temperatura musi być w zakresie -15°C do 40°C</span
            >
            <span v-else>&nbsp;</span>
          </template>
        </base-text-input>
        <div class="plant-origin__hours-container">
          <!-- Label for the harvest hours slider -->
          <label for="hours_slider" class="plant-origin__hours-label"
            >Godziny zbioru</label
          >
          <!-- Range slider for selecting harvest hours -->
          <v-range-slider
            v-model="formData.harvestRange"
            class="plant-origin__slider"
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
                :disabled="disabled"
              ></base-text-input>
            </template>
            <template v-slot:append>
              <base-text-input
                v-model="formData.harvestEndTime"
                type="text"
                classType="time"
                id="end_time"
                :disabled="disabled"
              ></base-text-input>
            </template>
          </v-range-slider>

          <div class="plant-origin__slider-values">
            <base-text-input
              v-model="formData.harvestStartTime"
              type="text"
              classType="time"
              id="start_time"
              :disabled="disabled"
            ></base-text-input>
            <base-text-input
              v-model="formData.harvestEndTime"
              type="text"
              classType="time"
              id="end_time"
              :disabled="disabled"
            ></base-text-input>
          </div>
        </div>
      </div>
    </div>
    <!-- Container for purchase details, displayed if plant origin is 'kupno' -->
    <div v-if="formData.plantOrigin === 'kupno'" class="plant-origin__buy">
      <div>
        <!-- Date picker for selecting purchase date -->
        <base-input-date-picker
          label="Data zakupu"
          title="Wybierz datę zakupu"
          id="plantBuyDate"
          :value="formData.plantBuyDate"
          @date:value="storeDate"
          :invalidInput="wasSubmitted && !isFormValid && !formData.plantBuyDate"
          color="plant"
        ></base-input-date-picker>
        <div class="plant-origin__message">
          <span v-if="wasSubmitted && !isFormValid && !formData.plantBuyDate"
            >Wybierz datę zakupu</span
          >
          <span v-else>&nbsp;</span>
        </div>
      </div>
      <!-- Input field for entering the name of the producer -->
      <div class="plant-origin__buy-container">
        <base-text-input
          class="plant-origin__buy-producer"
          v-model="formData.plantProducer"
          type="text"
          label="Nazwa producenta"
          id="plantProducer"
          inputColor="plant"
          :invalidInput="
            wasSubmitted && !isFormValid && !formData.plantProducer
          "
          @update:modelValue="setValue"
        >
          <template v-slot:message>
            <span v-if="wasSubmitted && !isFormValid && !formData.plantProducer"
              >Wpisz nazwę producenta</span
            >
            <span v-else>&nbsp;</span>
          </template>
        </base-text-input>
        <!-- Autocomplete input for the country of origin -->
        <base-autocomplete-input
          v-model="countryName"
          class="plant-origin__buy-country"
          label="Kraj pochodzenia"
          id="countryOfOrigin"
          color="plant"
          :results="countryNames"
          @update:modelValue="onInput"
          @choose:item="setCountry"
          @update:onBlur="onBlur"
        >
          <template v-slot:message>
            <span
              v-if="wasSubmitted && !isFormValid && !formData.countryOfOrigin"
              >Wybierz kraj pochodzenia</span
            >
            <span v-else>&nbsp;</span>
          </template>
        </base-autocomplete-input>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from "@/store/useStore";
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useApolloClient } from "@vue/apollo-composable";
import BaseInputDatePicker from "@/ui/BaseInputDatePicker.vue";
import BaseTextInput from "@/ui/BaseTextInput.vue";
import BaseAutocompleteInput from "@/ui/BaseAutocompleteInput.vue";
import {
  setIntegerNumber,
  setKeyboardIntegerNumber,
} from "@/helpers/formatHelpers";
import { PlantForm } from "@/types/forms/plantForm";
import { GET_COUNTRY_NAMES } from "@/graphql/queries/country";
import * as Sentry from "@sentry/vue";

/**
 * @component PlantOrigin
 * @description This component renders a form to input and manage data related to plant used in distillation, including origin, harvest date, harvest temperature, harvest range, buy date and producer details.
 * @see setValue
 * @see setIntegerNumber
 * @see setKeyboardIntegerNumber
 * @see storeDate
 */

enum PlantOrigin {
  ZBIÓR = "zbiór",
  KUPNO = "kupno",
}

interface Props {
  isFormValid: boolean;
  isResetting?: boolean;
  wasSubmitted: boolean;
}

export default {
  name: "PlantOrigin",
  components: { BaseInputDatePicker, BaseTextInput, BaseAutocompleteInput },
  props: ["isFormValid", "isResetting", "wasSubmitted"],
  setup(props: Props) {
    const { resolveClient } = useApolloClient();
    const apolloClient = resolveClient();

    // Vuex store
    const store = useStore();
    // Name of the vuex store module
    const storeName = "plant";

    // Title of the radio inputs
    const title = ref<string>("Pochodzenie surowca");
    // Options for plant origin
    const origins = reactive<PlantOrigin[]>([
      PlantOrigin.ZBIÓR,
      PlantOrigin.KUPNO,
    ]);
    //Reactive references related to fetching country
    const countryNames = ref<string[]>([]);
    const searchQuery = ref<string>("");
    const countryName = ref<string>("");
    const timeout = ref<ReturnType<typeof setTimeout> | null>(null);
    const disabled = ref<boolean>(true);

    // Computed properties to get form data from Vuex store
    const formData = computed<PlantForm>(
      () => store.getters["plant/plantForm"]
    );
    const harvestRange = computed<[number, number]>(
      () => store.getters["plant/harvestRange"]
    );
    const plantOrigin = computed<PlantOrigin>(
      () => store.getters["plant/plantOrigin"]
    );

    const isTemperatureCorrect = computed<boolean>(() => {
      const temperature = formData.value.harvestTemperature;
      if (
        (temperature && temperature < -15) ||
        (temperature && temperature > 40)
      ) {
        return false;
      } else {
        return true;
      }
    });

    // Watch for changes in the specific formData value (countryOfOrigin)
    watch(
      () => formData.value.countryOfOrigin,
      (newCountryOfOrigin) => {
        countryName.value = newCountryOfOrigin;
      }
    );

    // Watcher to handle changes in harvest range
    watch(harvestRange, (newValue) => {
      if (props.isResetting) {
        return;
      } else {
        store.dispatch("plant/setStartTime");
        store.dispatch("plant/setEndTime");
        store.dispatch("plant/setValue", {
          input: "harvestRange",
          value: newValue,
        });
      }
    });

    // Watcher to handle changes in the plant origin
    watch(
      () => plantOrigin.value,
      (newValue, oldValue) => {
        if (props.isResetting) return;

        store.dispatch("plant/setValue", {
          input: "plantOrigin",
          value: newValue,
        });

        const resetFields = {
          kupno: ["plantBuyDate", "plantProducer", "countryOfOrigin"],
          zbiór: ["harvestDate", "harvestTemperature", "harvestRange"],
        };

        if (resetFields[oldValue]) {
          resetFields[oldValue].forEach((field) =>
            store.dispatch("plant/setValue", {
              input: field,
              value: field === "harvestRange" ? [600, 900] : "",
            })
          );
        }
      }
    );

    // Fetch initial data from local storage on component mount
    onMounted(() => {
      [
        "plantOrigin",
        "plantBuyDate",
        "plantProducer",
        "harvestDate",
        "harvestTemperature",
        "harvestRange",
        "countryOfOrigin",
      ].forEach((field) =>
        store.dispatch("plant/fetchLocalStorageData", field)
      );
      countryName.value = formData.value.countryOfOrigin;
    });

    /**
     * Function to dispatch an action to the Vuex store to set a specific value.
     * @function setValue
     * @param {any} currentValue - The current value to be set.
     * @param {string} input - The input field name.
     */
    const setValue = (currentValue: string, input: string): void => {
      store.dispatch("plant/setValue", { input, value: currentValue });
    };

    /**
     * Function to store a date value in the Vuex store
     * @function storeDate
     * @param {Date} date - The date value to be stored.
     * @param {string} input - The input field name.
     */
    const storeDate = (date: string, input: string): void => {
      store.dispatch("plant/setValue", { input, value: date });
    };

    const setCountry = (currentValue: string, input: string): void => {
      setValue(currentValue, input);
      searchQuery.value = "";
      countryName.value = currentValue;
      countryNames.value = [];
    };

    /**
     * Async function to fetch country names based on user input for the autocomplete component.
     * @async
     * @function fetchCountries
     * @param {string} name - The search query to fetch country names for.
     * @returns {Promise<void>} Resolves when the country names are fetched and stored in the reactive variable.
     * @throws {Error} Throws an error if the fetching fails.
     */
    const fetchCountries = async (name: string): Promise<void> => {
      try {
        const { data } = await apolloClient.query({
          query: GET_COUNTRY_NAMES,
          variables: { name },
        });
        countryNames.value = data.getCountryNames.slice(0, 10);
      } catch (error) {
        Sentry.captureException(error);
        console.error("Failed to get country names:", error);
        countryNames.value = [];
      }
    };

    /**
     * Handles the input event for the search or autocomplete component.
     * Updates the search query and manages the timer to limit the frequency of fetch requests.
     *
     * @function onInput
     * @param {Event} e - The input event triggered by user interaction.
     * @returns {void}
     */
    const onInput = (value: string, input: string): void => {
      setValue("", input);
      searchQuery.value = value;
      countryName.value = searchQuery.value;
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

    /**
     * @function onBlur
     * @description Handles the blur event for the country input field. When the input field loses focus, it checks whether the user has selected a country. If no country is selected, it clears the country list and resets the search query and country name.
     * @returns {void}
     */
    const onBlur = (): void => {
      if (formData.value.countryOfOrigin === "") {
        countryNames.value = [];
        searchQuery.value = "";
        countryName.value = "";
      }
    };

    return {
      store,
      storeName,
      formData,
      plantOrigin,
      isTemperatureCorrect,
      title,
      origins,
      disabled,
      setValue,
      setIntegerNumber,
      setKeyboardIntegerNumber,
      storeDate,
      setCountry,
      onInput,
      onBlur,
      countryNames,
      countryName,
    };
  },
};
</script>

<style scoped>
.plant-origin {
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: left;
}

.plant-origin__harvest {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.plant-origin__harvest-conditions {
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 50px;
}

.plant-origin__hours-container {
  flex-grow: 3;
}

.plant-origin__hours-label {
  margin-left: 8px;
  font-size: 15px;
  line-height: 1.5;
}

.plant-origin__slider :deep(.v-input__prepend) {
  margin-right: 16px;
}

.plant-origin__slider :deep(.v-input__details) {
  display: none;
}

.plant-origin__slider-values {
  display: none;
}

.plant-origin__buy {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.plant-origin__buy-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 50px;
}

.plant-origin__buy-producer {
  flex-grow: 3;
}

.plant-origin__buy-country {
  flex-grow: 2;
}

.plant-origin__message {
  color: var(--error-color);
  font-size: 12px;
  text-align: left;
  padding-top: 5px;
}

@media (max-width: 1024px) {
  .plant-origin__harvest-conditions {
    flex-direction: column;
    gap: 20px;
  }

  .plant-origin__hours-label {
    margin-left: 0px;
  }
}

@media (max-width: 600px) {
  .plant-origin__slider :deep(.v-input__prepend),
  .plant-origin__slider :deep(.v-input__append) {
    display: none;
  }

  .plant-origin__slider-values {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .plant-origin__buy-container {
    flex-direction: column;
    gap: 20px;
  }
}
</style>
