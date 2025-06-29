<template>
  <div class="distillation-plant">
    <!-- Section: Plant selection with autocomplete and info display -->
    <h5 class="distillation-plant__title">surowiec</h5>
    <base-autocomplete-input
      v-model="plant"
      class="distillation-plant__autocomplete"
      label="Surowiec z magazynu"
      placeholder="wybierz surowiec"
      id="choosedPlant"
      color="plant"
      :disabled="isEditing"
      :results="plants"
      :invalidInput="
        wasSubmitted && !isFormValid && !formData.choosedPlant.name
      "
      @update:modelValue="onInput"
      @choose:item="setPlant"
      @update:onBlur="onBlur"
    >
      <!-- Validation and plant info messages -->
      <template v-slot:message>
        <span v-if="wasSubmitted && !isFormValid && !formData.choosedPlant.name"
          >Wybierz surowiec z magazynu</span
        >
        <div
          v-if="formData.choosedPlant.name"
          :class="[
            'distillation-plant__informations',
            { 'dark-distillation-plant__information': isDarkTheme },
          ]"
        >
          <!-- Plant part info -->
          <div class="distillation-plant__information">
            <span>część rośliny: </span
            ><span class="distillation-plant__information-value">{{
              formData.choosedPlant.part
            }}</span>
          </div>
          <!-- Harvest date info -->
          <div
            v-if="formData.choosedPlant.harvestDate"
            class="distillation-plant__information"
          >
            <span>data zbioru: </span
            ><span class="distillation-plant__information-value">{{
              formData.choosedPlant.harvestDate
            }}</span>
          </div>
          <!-- Buy date info -->
          <div
            v-if="formData.choosedPlant.buyDate"
            class="distillation-plant__information"
          >
            <span>data kupna: </span
            ><span class="distillation-plant__information-value">{{
              formData.choosedPlant.buyDate
            }}</span>
          </div>
          <!-- Available weight info -->
          <div class="distillation-plant__information">
            <span>ilość surowca na stanie: </span
            ><span class="distillation-plant__information-value"
              >{{ updatedAvailableWeight }} kg</span
            >
          </div>
        </div>
        <span v-else>&nbsp;</span>
      </template>
    </base-autocomplete-input>

    <!-- Input for weight used in distillation -->
    <base-text-input
      v-model="formData.weightForDistillation"
      type="number"
      classType="number"
      inputColor="plant"
      :invalidInput="
        wasSubmitted && !isFormValid && !formData.weightForDistillation
      "
      :storeName="storeName"
      @change:modelValue="
        (value, id) => setNumberFormat(store, value, id, storeName)
      "
      @set:keyboard="preventMinusNumber"
      label="Waga surowca użytego do destylacji"
      id="weightForDistillation"
      placeholder="kg"
      min="0.1"
      :max="formData.choosedPlant.availableWeight"
      step="0.1"
    >
      <!-- Show unit 'kg' if value is present -->
      <template v-slot:unit>
        <div v-if="formData.weightForDistillation">kg</div>
      </template>
      <!-- Validation messages for weight input -->
      <template v-slot:message>
        <span
          v-if="
            (formData.weightForDistillation ?? 0) >
            (formData.choosedPlant.availableWeight ?? 0)
          "
          >Brak wystarczającej ilości surowca w magazynie</span
        >
        <span
          v-if="wasSubmitted && !isFormValid && !formData.weightForDistillation"
          >Wpisz wagę surowca</span
        >
        <span v-else>&nbsp;</span>
      </template>
    </base-text-input>
    <div class="distillation-plant__checkbox-container">
      <!-- Checkbox for soaking the plant -->
      <div class="distillation-plant__checkbox-container--isSoaked">
        <v-checkbox
          v-model="formData.isPlantSoaked"
          :class="{ 'dark-distillation-plant__checkbox': isDarkTheme }"
          class="distillation-plant__checkbox"
          label="Surowiec namaczany przed destylacją"
          color="var(--secondary-color)"
        ></v-checkbox>
        <!-- Inputs for soaking time and weight after soaking -->
        <div
          v-if="formData.isPlantSoaked"
          class="distillation-plant__container--isSoaked"
        >
          <!-- Input for soaking time -->
          <base-text-input
            v-model="formData.soakingTime"
            type="number"
            classType="number"
            inputColor="plant"
            :invalidInput="
              wasSubmitted && !isFormValid && !formData.soakingTime
            "
            :storeName="storeName"
            @update:modelValue="
              (value, id) => setIntegerNumber(store, value, id, storeName)
            "
            @set:keyboard="handleKeyboard"
            label="Czas namaczania"
            placeholder="h"
            id="soakingTime"
            min="1"
            step="1"
          >
            <!-- Show unit 'h' if value is present -->
            <template v-slot:unit>
              <div v-if="formData.soakingTime">h</div>
            </template>
            <!-- Validation message for soaking time -->
            <template v-slot:message>
              <span v-if="wasSubmitted && !isFormValid && !formData.soakingTime"
                >Wpisz czas namaczania</span
              >
              <span v-else>&nbsp;</span>
            </template>
          </base-text-input>
          <!-- Input for weight after soaking -->
          <base-text-input
            v-model="formData.weightAfterSoaking"
            type="number"
            classType="number"
            inputColor="plant"
            :invalidInput="
              wasSubmitted && !isFormValid && !formData.weightAfterSoaking
            "
            :storeName="storeName"
            @change:modelValue="
              (value, id) => setNumberFormat(store, value, id, storeName)
            "
            @set:keyboard="preventMinusNumber"
            label="Waga surowca po namoczeniu"
            placeholder="kg"
            id="weightAfterSoaking"
            min="0.1"
            step="0.1"
          >
            <!-- Show unit 'kg' if value is present -->
            <template v-slot:unit>
              <div v-if="formData.weightAfterSoaking">kg</div>
            </template>
            <!-- Validation message for weight after soaking -->
            <template v-slot:message>
              <span
                v-if="
                  wasSubmitted && !isFormValid && !formData.weightAfterSoaking
                "
                >Wpisz wagę po namaczaniu</span
              >
              <span v-else>&nbsp;</span>
            </template>
          </base-text-input>
        </div>
      </div>
      <!-- Checkbox for shredding the plant -->
      <v-checkbox
        v-model="formData.isPlantShredded"
        :class="{
          'dark-distillation-plant__checkbox-isPlantShredded': isDarkTheme,
        }"
        label="Surowiec rozdrobniony przed destylacją"
        color="var(--secondary-color)"
      ></v-checkbox>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, computed, watch, ref } from "vue";
import { useStore } from "@/store/useStore";
import { useRoute, useRouter } from "vue-router";
import { useApolloClient } from "@vue/apollo-composable";
import { format } from "date-fns";
import BaseAutocompleteInput from "@/ui/BaseAutocompleteInput.vue";
import {
  setIntegerNumber,
  setNumberFormat,
  setKeyboardIntegerNumber,
  preventMinusNumber,
} from "@/helpers/formatHelpers";
import { handleUserError } from "@/helpers/errorHandling";
import BaseTextInput from "@/ui/BaseTextInput.vue";
import * as Sentry from "@sentry/vue";

import {
  ChoosedPlant,
  FormChoosedPlant,
  DistillationForm,
} from "@/types/forms/distillationForm";
import { BasicPlant } from "@/types/forms/plantForm";

import { GET_PLANTS } from "@/graphql/queries/plant";
import { GET_BASIC_PLANT_BY_ID } from "@/graphql/queries/plant";

/**
 * @component DistillationPlant
 * @description This component manages the selection of plant material for distillation, including details like plant part, weight, and optional soaking or shredding steps.
 * It also interacts with Vuex for data persistence and handles the fetching of plants from an Apollo GraphQL server.
 * @props {boolean} isFormValid - Indicates if the form is valid.
 * @props {boolean} wasSubmitted - Indicates if the form was submitted.
 * @props {boolean} [isEditing] - Indicates if the form is in editing mode.
 * @see fetchData
 * @see setPlantState
 * @see setPlant
 * @see fetchPlants
 * @see onInput
 * @see onBlur
 * @see setNumberFormat
 * @see setIntegerNumber
 * @see setKeyboardIntegerNumber
 */

/**
 * Props for DistillationPlant component.
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
  name: "DistillationPlant",
  components: { BaseTextInput, BaseAutocompleteInput },
  props: ["isFormValid", "wasSubmitted", "isEditing"],

  setup(props: Props) {
    // Apollo client instance
    const { resolveClient } = useApolloClient();
    const apolloClient = resolveClient();

    // Vuex store
    const store = useStore();

    // Name of the vuex store module
    const storeName = "distillation";

    // Vue Router
    const router = useRouter();
    const route = useRoute();

    // Search input value for plant autocomplete
    const searchQuery = ref<string>("");
    // Selected plant name for autocomplete
    const plant = ref<string>("");
    // List of plants for autocomplete results
    const plants = ref<BasicPlant[]>([]);
    // Timeout ref for debouncing plant search
    const timeout = ref<ReturnType<typeof setTimeout> | null>(null);

    // Computed properties to get data from Vuex store
    const formData = computed<DistillationForm>(
      () => store.getters["distillation/distillationForm"]
    );
    const isPlantSoaked = computed<boolean>(
      () => store.getters["distillation/isPlantSoaked"]
    );
    const isPlantShredded = computed<boolean>(
      () => store.getters["distillation/isPlantShredded"]
    );
    const isDarkTheme = computed<boolean>(
      () => store.getters["settings/isDarkTheme"]
    );

    // Mapping of plant fields for selection and formatting
    const plantFields: {
      key: keyof ChoosedPlant;
      valueKey: keyof BasicPlant;
      format?: boolean;
    }[] = [
      { key: "id", valueKey: "_id" },
      { key: "name", valueKey: "plantName" },
      { key: "part", valueKey: "plantPart" },
      { key: "availableWeight", valueKey: "availableWeight" },
      { key: "harvestDate", valueKey: "harvestDate", format: true },
      { key: "buyDate", valueKey: "plantBuyDate", format: true },
    ];

    // Computed property to calculate the new available weight
    const updatedAvailableWeight = computed<number | undefined>(() => {
      const availableWeight = formData.value.choosedPlant.availableWeight ?? 0;
      const weightForDistillation = formData.value.weightForDistillation ?? 0;
      const initialWeightForDistillation =
        formData.value.initialWeightForDistillation ?? 0;
      if (props.isEditing) {
        return parseFloat(
          (
            availableWeight +
            initialWeightForDistillation -
            weightForDistillation
          ).toFixed(1)
        );
      } else {
        return parseFloat((availableWeight - weightForDistillation).toFixed(1));
      }
    });

    // Get comingFromRoute state from Vuex store
    const comingFromRoute = computed<boolean>(
      () => store.getters.comingFromRoute
    );

    // Handles keyboard events for integer-only input and prevents minus sign
    const handleKeyboard = (e: KeyboardEvent) => {
      setKeyboardIntegerNumber(e);
      preventMinusNumber(e);
    };

    /**
     * Gets plant data by ID from the GraphQL server.
     * @returns {Promise<BasicPlant | undefined>}
     */
    const getPlantData = async (): Promise<BasicPlant | undefined> => {
      try {
        const { data } = await apolloClient.query({
          query: GET_BASIC_PLANT_BY_ID,
          variables: { id: route.params.id, formatDates: false },
        });

        return data.getPlantById;
      } catch (error) {
        Sentry.captureException(error);
        console.error("Failed to get plant details:", error);
      }
    };

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

    // Fetch initial data from local storage or API on component mount
    onMounted(async () => {
      if (comingFromRoute.value) {
        if (route.params.id) {
          const plantData = await getPlantData();

          if (plantData) {
            plantFields.forEach(({ key, valueKey, format: shouldFormat }) => {
              const value =
                shouldFormat && plantData[valueKey]
                  ? format(new Date(plantData[valueKey]), "dd-MM-yyyy")
                  : plantData[valueKey];

              store.dispatch("distillation/setChoosedPlant", { key, value });
            });
            plant.value = formData.value.choosedPlant.name;
          }
        } else {
          return;
        }
      } else {
        const distillationFields = [
          "weightForDistillation",
          "isPlantSoaked",
          "soakingTime",
          "weightAfterSoaking",
          "isPlantShredded",
        ];

        plantFields.forEach(({ key }) => {
          fetchData(key, true);
        });

        distillationFields.forEach((field) => {
          fetchData(field, false);
        });
        plant.value = formData.value.choosedPlant.name;
      }
    });

    /**
     * Updates the selected plant's state in Vuex by dispatching key-value pairs.
     * @param {keyof FormChoosedPlant} key - The key of the plant attribute.
     * @param {string | number | null} value - The value of the plant attribute.
     */
    const setPlantState = (
      key: keyof FormChoosedPlant,
      value: string | number | null
    ): void => {
      store.dispatch("distillation/setChoosedPlant", {
        key: key,
        value: value,
      });
    };

    /**
     * Sets the selected plant details in the form, including plant ID, name, part, and weight.
     * Clears the search input and list of plants after selection.
     * @param {BasicPlant} value - The selected plant object from the plant list.
     */
    const setPlant = (value: BasicPlant): void => {
      plantFields.forEach(({ key, valueKey }) => {
        setPlantState(key, value[valueKey] ?? null);
      });
      searchQuery.value = "";
      plant.value = value.plantName;
      plants.value = [];

      const targetRoute = props.isEditing
        ? "EditDistillationPage"
        : "AddDistillationPage";
      router.replace({ name: targetRoute, params: { id: value._id } });
    };

    /**
     * Fetch the list of plants from the GraphQL server by matching name.
     * @async
     * @param {string} name - The plant name to search for.
     * @returns {Promise<void>}
     */
    const fetchPlants = async (name: string): Promise<void> => {
      try {
        const { data } = await apolloClient.query({
          query: GET_PLANTS,
          fetchPolicy: "network-only",
          variables: {
            fields: plantFields.map(({ valueKey }) => valueKey),
            formatDates: true,
            name: name,
          },
        });
        plants.value = data.getPlants;
      } catch (error: any) {
        await handleUserError(error);
        plants.value = [];
      }
    };

    /**
     * Handles the input event for the search or autocomplete component.
     * Updates the search query and manages the timer to limit the frequency of fetch requests.
     * @param {string} value - The input value.
     * @param {string} input - The input field identifier.
     * @returns {void}
     */
    const onInput = (value: string, input: string): void => {
      if (input === "choosedPlant") {
        plantFields.forEach(({ key }) => {
          key === "id" || key === "availableWeight"
            ? setPlantState(key, null)
            : setPlantState(key, "");
        });
      }

      const routeName = props.isEditing
        ? "EditDistillationPage"
        : "AddDistillationPage";
      router.replace({ name: routeName, params: { id: null } });

      searchQuery.value = value;
      plant.value = searchQuery.value;
      if (timeout.value) {
        clearTimeout(timeout.value);
      }

      timeout.value = setTimeout(() => {
        if (searchQuery.value !== "") {
          fetchPlants(searchQuery.value);
        } else {
          plants.value = [];
        }
      }, 500);
    };

    /**
     * Handles the blur event when the input field loses focus.
     * Clears the plant list and resets the input value if no plant is selected.
     */
    const onBlur = () => {
      if (formData.value.choosedPlant.name === "") {
        plants.value = [];
        searchQuery.value = "";
        plant.value = "";
      }
    };

    // Watcher to handle changes in the isPlantSoaked state. Updates related fields and dispatches changes to the store.
    watch(
      () => isPlantSoaked.value,
      (newValue, oldValue) => {
        if (oldValue === false) {
          store.dispatch("distillation/setValue", {
            input: "isPlantSoaked",
            value: newValue,
          });
        }

        if (newValue === false) {
          if (oldValue === true) {
            store.dispatch("distillation/setValue", {
              input: "soakingTime",
              value: null,
            });
            store.dispatch("distillation/setValue", {
              input: "weightAfterSoaking",
              value: null,
            });
            store.dispatch("distillation/setValue", {
              input: "isPlantSoaked",
              value: newValue,
            });
          }
        }
      }
    );

    // Watcher to handle changes in the isPlantShredded state. Updates related field and dispatches changes to the store.
    watch(
      () => isPlantShredded.value,
      (newValue, oldValue) => {
        if (oldValue !== newValue) {
          store.dispatch("distillation/setValue", {
            input: "isPlantShredded",
            value: newValue,
          });
        }
      }
    );

    return {
      store,
      storeName,
      formData,
      isPlantSoaked,
      updatedAvailableWeight,
      plant,
      plants,
      setPlant,
      onInput,
      onBlur,
      setNumberFormat,
      setIntegerNumber,
      setKeyboardIntegerNumber,
      preventMinusNumber,
      handleKeyboard,
      isDarkTheme,
    };
  },
};
</script>

<style scoped>
.distillation-plant,
.distillation-plant__checkbox-container--isSoaked,
.distillation-plant__container--isSoaked {
  display: flex;
  flex-direction: column;
}

.distillation-plant {
  gap: 20px;
}

.distillation-plant__title {
  font-size: 16px;
}

.distillation-plant__informations,
.distillation-plant__information,
.distillation-plant__checkbox-container {
  display: flex;
  flex-direction: row;
}

.distillation-plant__informations {
  gap: 20px;
}

.distillation-plant__information {
  gap: 10px;
  font-size: 13px;
  color: var(--text-color);
  justify-content: flex-start;
}

.dark-distillation-plant__information {
  color: var(--text-color-dark);
}
.distillation-plant__information-value {
  color: var(--secondary-color);
}

.distillation-plant__checkbox-container {
  gap: 50px;
  align-items: flex-start;
  justify-content: center;
}

.distillation-plant__checkbox :deep(.v-input__details) {
  display: none;
}

.distillation-plant__checkbox-container--isSoaked {
  flex-grow: 1;
}

.distillation-plant__container--isSoaked {
  gap: 20px;
}

.dark-distillation-plant__checkbox-isPlantShredded {
  flex-grow: 1;
  color: var(--text-color);
}

.dark-distillation-plant__checkbox {
  color: var(--text-color-dark);
}

@media (max-width: 1024px) {
  .distillation-plant__informations {
    flex-direction: column;
    gap: 5px;
    margin-top: 5px;
  }

  .distillation-plant__checkbox-container {
    flex-direction: column;
    gap: 20px;
  }
}
</style>
