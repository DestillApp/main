<template>
  <div class="results-plant">
    <!-- Title for plant part of distillation form -->
    <h5 class="results-plant__title">surowiec</h5>
    <!-- Autocomplete input for the plants in the magazin -->
    <base-text-input
      v-model="plantData.plantName"
      class="results-plant__name"
      label="Surowiec z magazynu"
      placeholder="wybierz surowiec"
      id="plantName"
      color="plant"
      :disabled="isEditing"
    >
      <template v-slot:message>
        <!-- Display plant details if plant is selected -->
        <div v-if="plantData.plantName" class="results-plant__informations">
          <!-- Plant part -->
          <div
            :class="[
              'results-plant__information',
              { 'dark-results-plant__information': isDarkTheme },
            ]"
          >
            <span>część rośliny: </span
            ><span class="results-plant__information-value">{{
              plantData.plantPart
            }}</span>
          </div>
          <!-- Harvest date -->
          <div
            v-if="plantData.harvestDate"
            :class="[
              'results-plant__information',
              { 'dark-results-plant__information': isDarkTheme },
            ]"
          >
            <span>data zbioru: </span
            ><span class="results-plant__information-value">{{
              plantData.harvestDate
            }}</span>
          </div>
          <!-- Buy date -->
          <div
            v-if="plantData.plantBuyDate"
            :class="[
              'results-plant__information',
              { 'dark-results-plant__information': isDarkTheme },
            ]"
          >
            <span>data kupna: </span
            ><span class="results-plant__information-value">{{
              plantData.plantBuyDate
            }}</span>
          </div>
        </div>
      </template>
    </base-text-input>
    <!-- Input field for entering the plant weight that will be used for distillation -->
    <base-text-input
      v-model="distillationData.weightForDistillation"
      type="number"
      class="results-plant__weight"
      classType="number"
      inputColor="plant"
      :disabled="isEditing"
      label="Waga surowca użytego do destylacji"
      id="weightForDistillation"
      min="0"
    >
      <template v-slot:unit>
        <div>kg</div>
      </template>
    </base-text-input>
    <div class="results-plant__container">
      <div>
        <!-- Soaking info -->
        <p
          class="results-plant__paragraph"
          v-if="distillationData.isPlantSoaked"
        >
          Surowiec namaczany przed destylacją:
        </p>
        <p
          class="results-plant__paragraph"
          v-if="!distillationData.isPlantSoaked"
        >
          Surowiec nie namaczany przed destylacją
        </p>
        <!-- Additional inputs displayed if the plant was soaked -->
        <div
          v-if="distillationData.isPlantSoaked"
          class="results-plant__container--is-soaked"
        >
          <!-- Input field for entering the soaking time -->
          <base-text-input
            v-model="distillationData.soakingTime"
            type="number"
            classType="number"
            inputColor="plant"
            :disabled="isEditing"
            @set:keyboard="preventMinusNumber"
            label="Czas namaczania"
            id="soakingTime"
            min="1"
            step="1"
          >
            <template v-slot:unit>
              <div>h</div>
            </template>
          </base-text-input>
          <!-- Input field for entering the weight after soaking -->
          <base-text-input
            v-model="distillationData.weightAfterSoaking"
            class="results-plant__weight-after-soaking"
            type="number"
            classType="number"
            inputColor="plant"
            :disabled="isEditing"
            label="Waga surowca po namoczeniu"
            id="weightAfterSoaking"
          >
            <template v-slot:unit>
              <div>kg</div>
            </template>
          </base-text-input>
        </div>
      </div>
      <!-- Shredding info -->
      <p
        class="results-plant__paragraph"
        v-if="distillationData.isPlantShredded"
      >
        Surowiec rozdrobniony przed destylacją
      </p>
      <p
        class="results-plant__paragraph"
        v-if="!distillationData.isPlantShredded"
      >
        Surowiec nie rozdrabniany przed destylacją
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from "@/store/useStore";
import { onMounted, computed } from "vue";
import { initialResultsForm } from "@/helpers/formsInitialState";
import { preventMinusNumber } from "@/helpers/formatHelpers";
import BaseTextInput from "@/ui/BaseTextInput.vue";
import { ResultsPlant, ResultsDistillation } from "@/types/forms/resultsForm";

/**
 * @component ResultsPlant
 * @description Displays and manages the plant-related part of the distillation results, including plant selection, plant details, and soaking/shredding options.
 * @props {boolean} isFormValid - Indicates if the form is valid.
 * @props {boolean} [isEditing] - Indicates if the form is in editing mode.
 * @see fetchPlantData
 * @see fetchDistillationData
 */

/**
 * Props for ResultsPlant component.
 * @interface
 * @property {boolean} isFormValid - Indicates if the form is valid.
 * @property {boolean} [isEditing] - Indicates if the form is in editing mode.
 */
interface Props {
  isFormValid: boolean;
  isEditing?: boolean;
}

export default {
  name: "ResultsPlant",
  components: { BaseTextInput },
  props: ["isFormValid", "isEditing"],

  setup() {
    // Vuex store
    const store = useStore();

    // Computed property for plant data from Vuex store
    const plantData = computed<ResultsPlant>(
      () => store.getters["results/distilledPlant"]
    );

    // Computed property for distillation data from Vuex store
    const distillationData = computed<ResultsDistillation>(
      () => store.getters["results/distillationData"]
    );

    // Computed property for dark theme state
    const isDarkTheme = computed<boolean>(
      () => store.getters["settings/isDarkTheme"]
    );

    // Computed property for navigation state
    const comingFromRoute = computed<boolean>(
      () => store.getters.comingFromRoute
    );

    /**
     * Fetches plant data from local storage for a given key.
     * @function fetchPlantData
     * @param {string} key - The key for the specific data to fetch.
     */
    const fetchPlantData = (key: string): void => {
      store.dispatch("results/fetchDistilledPlantFromLocalStorage", key);
    };

    /**
     * Fetches distillation data from local storage for a given key.
     * @function fetchDistillationData
     * @param {string} key - The key for the specific data to fetch.
     */
    const fetchDistillationData = (key: string): void => {
      store.dispatch("results/fetchDistillationDataFromLocalStorage", key);
    };

    // Fetch initial data from local storage on component mount
    onMounted(async () => {
      if (!comingFromRoute.value) {
        const distilledPlantKeys = Object.keys(
          initialResultsForm.distilledPlant
        );
        distilledPlantKeys.forEach((key) => {
          fetchPlantData(key);
        });

        const distillationKeys = [
          "weightForDistillation",
          "isPlantSoaked",
          "soakingTime",
          "weightAfterSoaking",
          "isPlantShredded",
        ];
        distillationKeys.forEach((key) => {
          fetchDistillationData(key);
        });
      }
    });

    return {
      plantData,
      distillationData,
      preventMinusNumber,
      isDarkTheme,
    };
  },
};
</script>

<style scoped>
.results-plant {
  display: flex;
  flex-direction: column;
}

.results-plant__title {
  font-size: 16px;
  margin-bottom: 30px;
}

.results-plant__name {
  margin-bottom: 10px;
}

.results-plant__informations,
.results-plant__information {
  display: flex;
  flex-direction: row;
}

.results-plant__informations {
  gap: 20px;
}

.results-plant__information {
  gap: 10px;
  font-size: 13px;
  color: black;
  justify-content: flex-start;
}

.dark-results-plant__information {
  color: var(--text-color-dark);
}

.results-plant__information-value {
  color: var(--secondary-color);
}

.results-plant__weight {
  margin-top: 20px;
  margin-bottom: 20px;
}

.results-plant__container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.results-plant__paragraph {
  text-align: left;
  color: var(--text-color);
  margin-bottom: 30px;
  font-size: 15px;
}

.results-plant__container--is-soaked {
  display: flex;
  flex-direction: row;
  gap: 50px;
}

.results-plant__weight-after-soaking {
  margin-bottom: 20px;
}

@media (max-width: 600px) {
  .results-plant__informations {
    flex-direction: column;
    gap: 5px;
    margin-top: 5px;
  }
}
</style>
