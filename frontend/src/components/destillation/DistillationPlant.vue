<template>
  <div class="distillation-plant">
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
          <div class="distillation-plant__information">
            <span>część rośliny: </span
            ><span class="distillation-plant__information-value">{{
              formData.choosedPlant.part
            }}</span>
          </div>
          <div
            v-if="formData.choosedPlant.harvestDate"
            class="distillation-plant__information"
          >
            <span>data zbioru: </span
            ><span class="distillation-plant__information-value">{{
              formData.choosedPlant.harvestDate
            }}</span>
          </div>
          <div
            v-if="formData.choosedPlant.buyDate"
            class="distillation-plant__information"
          >
            <span>data kupna: </span
            ><span class="distillation-plant__information-value">{{
              formData.choosedPlant.buyDate
            }}</span>
          </div>
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
    <base-text-input
      v-model="formData.weightForDistillation"
      type="number"
      classType="number"
      inputColor="plant"
      :invalidInput="
        wasSubmitted && !isFormValid && !formData.weightForDistillation
      "
      :storeName="storeName"
      @change:modelValue="setNumber"
      @set:keyboard="setKeyboardFormatedNumber"
      label="Waga surowca użytego do destylacji"
      id="weightForDistillation"
      placeholder="kg"
      min="0.1"
      :max="formData.choosedPlant.availableWeight"
      step="0.1"
    >
      <template v-slot:unit>
        <div v-if="formData.weightForDistillation">kg</div>
      </template>
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
      <div class="distillation-plant__checkbox-container--isSoaked">
        <v-checkbox
          v-model="formData.isPlantSoaked"
          :class="{ 'dark-distillation-plant__checkbox': isDarkTheme }"
          class="distillation-plant__checkbox"
          label="Surowiec namaczany przed destylacją"
          color="var(--secondary-color)"
        ></v-checkbox>
        <div
          v-if="formData.isPlantSoaked"
          class="distillation-plant__container--isSoaked"
        >
          <base-text-input
            v-model="formData.soakingTime"
            type="number"
            classType="number"
            inputColor="plant"
            :invalidInput="
              wasSubmitted && !isFormValid && !formData.soakingTime
            "
            :storeName="storeName"
            @update:modelValue="setInteger"
            @set:keyboard="setKeyboardIntegerNumber"
            label="Czas namaczania"
            placeholder="h"
            id="soakingTime"
            min="1"
            step="1"
          >
            <template v-slot:unit>
              <div v-if="formData.soakingTime">h</div>
            </template>
            <template v-slot:message>
              <span v-if="wasSubmitted && !isFormValid && !formData.soakingTime"
                >Wpisz czas namaczania</span
              >
              <span v-else>&nbsp;</span>
            </template>
          </base-text-input>
          <base-text-input
            v-model="formData.weightAfterSoaking"
            type="number"
            classType="number"
            inputColor="plant"
            :invalidInput="
              wasSubmitted && !isFormValid && !formData.weightAfterSoaking
            "
            :storeName="storeName"
            @change:modelValue="setNumber"
            @set:keyboard="setKeyboardFormatedNumber"
            label="Waga surowca po namoczeniu"
            placeholder="kg"
            id="weightAfterSoaking"
            min="0.1"
            step="0.1"
          >
            <template v-slot:unit>
              <div v-if="formData.weightAfterSoaking">kg</div>
            </template>
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
import { defineComponent, onMounted, computed, watch, ref } from "vue";
import { useStore } from "@/store/useStore";
import { useRoute, useRouter } from "vue-router";
import { useApolloClient } from "@vue/apollo-composable";
import { format } from "date-fns";
import BaseAutocompleteInput from "@/ui/BaseAutocompleteInput.vue";
import {
  setIntegerNumber,
  setNumberFormat,
  setKeyboardIntegerNumber,
  setKeyboardFormatedNumber,
} from "@/helpers/formatHelpers";
import BaseTextInput from "@/ui/BaseTextInput.vue";

import {
  ChoosedPlant,
  FormChoosedPlant,
  DistillationForm,
} from "@/types/forms/distillationForm";
import { BasicPlant } from "@/types/forms/plantForm";

import { GET_PLANTS } from "@/graphql/queries/plant.js";
import { GET_BASIC_PLANT_BY_ID } from "@/graphql/queries/plant.js";

/**
 * @component DistillationPlant
 * @description This component manages the selection of plant material for distillation, including details like plant part, weight, and optional soaking or shredding steps.
 * It also interacts with Vuex for data persistence and handles the fetching of plants from an Apollo GraphQL server.
 * @see fetchData
 * @see setPlantState
 * @see setPlant
 * @see fetchPlantList
 * @see onInput
 * @see onBlur
 * @see setNumberFormat
 * @see setIntegerNumber
 * @see setKeyboardIntegerNumber
 * @see setKeyboardFormatedNumber
 */

interface Props {
  isFormValid: boolean;
  wasSubmitted: boolean;
  isEditing?: boolean;
}

export default defineComponent({
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

    const router = useRouter();
    const route = useRoute();

    const searchQuery = ref<string>("");
    const plant = ref<string>("");
    const plants = ref<BasicPlant[]>([]);
    const timeout = ref<ReturnType<typeof setTimeout> | null>(null);

    // Computed properties to get form data from Vuex store
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

    const comingFromRoute = computed<boolean>(
      () => store.getters.comingFromRoute
    );

    const getPlantData = async (): Promise<BasicPlant | undefined> => {
      try {
        const { data } = await apolloClient.query({
          query: GET_BASIC_PLANT_BY_ID,
          variables: { id: route.params.id, formatDates: false },
        });

        return data.getPlantById;
      } catch (error) {
        console.error("Failed to get plant details:", error);
      }
    };

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

    // Fetch initial data from local storage on component mount
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
     * @function setPlantState
     * @description Updates the selected plant's state in Vuex by dispatching key-value pairs.
     * @param {string} key - The key of the plant attribute.
     * @param {any} value - The value of the plant attribute.
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
     * @function setPlant
     * @desctiption Sets the selected plant details in the form, including plant ID, name, part, and weight. Clears the search input and list of plants after selection.
     * @param {Object} value - The selected plant object from the plant list.
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
     * @async
     * @function fetchPlants
     * @description Fetch the list of plants from the GraphQL server by matching name.
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
      } catch (error) {
        // Narrow the type of error to check its properties
        if (error instanceof Error) {
          if (error.message === "Unauthorized") {
            await store.dispatch("auth/logout");
            router.push("/login");
          }
          console.error("Failed to get plant list:", error.message);
        } else {
          console.error("An unknown error occurred:", error);
        }
        plants.value = [];
      }
    };

    /**
     * @function onInput
     * @description Handles the input event for the search or autocomplete component. Updates the search query and manages the timer to limit the frequency of fetch requests.
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
     * @function onBlur
     * @description Handles the blur event when the input field loses focus. Clears the plant list and resets the input value if no plant is selected.
     */
    const onBlur = () => {
      if (formData.value.choosedPlant.name === "") {
        plants.value = [];
        searchQuery.value = "";
        plant.value = "";
      }
    };

    // Using the format function
    const setInteger = (value: string, id: string, storeName: string) => {
      setIntegerNumber(store, value, id, storeName);
    };

    // Using the format function
    const setNumber = (value: string, id: string, storeName: string) => {
      setNumberFormat(store, value, id, storeName);
    };

    // Watcher to handle changes in the isPlantSoaked state. Updates related fields and dispatches changes to the store.
    watch(
      () => isPlantSoaked.value, // Watch the value of isPlantSoaked
      (newValue, oldValue) => {
        // If the old value is false, update the soaked state in the store
        if (oldValue === false) {
          store.dispatch("plant/setValue", {
            input: "isPlantSoaked",
            value: newValue,
          });
        }

        //PROBLEM WITH CLEANING FIELDS!!!
        // If the new value is false
        if (newValue === false) {
          // Clear soaking-related fields if the previous state was true
          if (oldValue === true) {
            store.dispatch("plant/setValue", {
              input: "soakingTime",
              value: null,
            });
            store.dispatch("plant/setValue", {
              input: "weightAfterSoaking",
              value: null,
            });
            store.dispatch("plant/setValue", {
              input: "isPlantSoaked",
              value: newValue,
            });
          }
        }
      }
    );

    // Watcher to handle changes in the isPlantShredded state. Updates related field and dispatches changes to the store.
    watch(
      () => isPlantShredded.value, // Watch the value of isPlantShredded
      (newValue, oldValue) => {
        // If the old value is false, update the soaked state in the store
        if (oldValue !== newValue) {
          store.dispatch("plant/setValue", {
            input: "isPlantShredded",
            value: newValue,
          });
        }
      }
    );

    return {
      storeName,
      formData,
      isPlantSoaked,
      updatedAvailableWeight,
      plant,
      plants,
      setPlant,
      onInput,
      onBlur,
      setNumber,
      setInteger,
      setKeyboardIntegerNumber,
      setKeyboardFormatedNumber,
      isDarkTheme,
    };
  },
});
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
