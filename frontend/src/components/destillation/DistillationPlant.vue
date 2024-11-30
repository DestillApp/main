// no arch docs //no some code docs
database
<template>
  <div class="distillation_plant">
    <!--Title for plant part of distillation form-->
    <h5 class="plant_title">surowiec</h5>
    <!-- Autocomplete input for the plants in the magazin-->
    <base-autocomplete-input
      v-model="plant"
      class="checkbox"
      label="Surowiec z magazynu"
      placeholder="wybierz surowiec"
      id="choosedPlant"
      color="plant"
      :disabled="isEditing"
      :results="plants"
      :invalidInput="isFormValid === false && formData.choosedPlant.name === ''"
      @update:modelValue="onInput"
      @choose:item="setPlant"
      @update:onBlur="onBlur"
    >
      <template v-slot:message>
        <span v-if="isFormValid === false && formData.choosedPlant.name === ''"
          >Wybierz surowiec z magazynu</span
        >
        <div v-if="formData.choosedPlant.name" class="plant_informations">
          <div class="plant_information">
            <span>część rośliny: </span
            ><span class="information">{{ formData.choosedPlant.part }}</span>
          </div>
          <div
            v-if="formData.choosedPlant.harvestDate"
            class="plant_information"
          >
            <span>data zbioru: </span
            ><span class="information">{{
              formData.choosedPlant.harvestDate
            }}</span>
          </div>
          <div v-if="formData.choosedPlant.buyDate" class="plant_information">
            <span>data kupna: </span
            ><span class="information">{{
              formData.choosedPlant.buyDate
            }}</span>
          </div>
          <div class="plant_information">
            <span>ilość surowca na stanie: </span
            ><span class="information"
              >{{ formData.choosedPlant.availableWeight }} kg</span
            >
          </div>
        </div>
        <span v-else>&nbsp;</span>
      </template>
    </base-autocomplete-input>
    <!-- Input field for entering the plant weight that will be use for distillation-->
    <base-text-input
      v-model="formData.weightForDistillation"
      type="number"
      class="plant_weight"
      classType="number"
      inputColor="plant"
      :invalidInput="
        isFormValid === false && formData.weightForDistillation === null
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
        <div v-if="formData.weightForDistillation !== null">kg</div>
      </template>
      <template v-slot:message>
        <span
          v-if="
            formData.weightForDistillation >
            formData.choosedPlant.availableWeight
          "
        >Brak wystarczającej ilości surowca z magazynie</span>
        <span
          v-if="
            isFormValid === false && formData.weightForDistillation === null
          "
          >Wpisz wagę surowca</span
        >
        <span v-else>&nbsp;</span>
      </template>
    </base-text-input>
    <div class="checkbox_container">
      <!-- Checkbox for indicating if the plant was soaked -->
      <div class="checkbox_container--isSoaked">
        <v-checkbox
          v-model="formData.isPlantSoaked"
          class="checkbox"
          label="Surowiec namaczany przed destylacją"
          color="var(--secondary-color)"
        ></v-checkbox>
        <!-- Additional inputs displayed if the plant was soaked -->
        <div v-if="formData.isPlantSoaked" class="container--isSoaked">
          <!-- Input field for entering the soaking time -->
          <base-text-input
            v-model="formData.soakingTime"
            type="number"
            classType="number"
            inputColor="plant"
            :invalidInput="
              isFormValid === false && formData.soakingTime === null
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
              <div v-if="formData.soakingTime !== null">h</div>
            </template>
            <template v-slot:message>
              <span
                v-if="isFormValid === false && formData.soakingTime === null"
                >Wpisz czas namaczania</span
              >
              <span v-else>&nbsp;</span>
            </template>
          </base-text-input>
          <!-- Input field for entering the weight after soaking -->
          <base-text-input
            v-model="formData.weightAfterSoaking"
            class="weightAfterSoaking"
            type="number"
            classType="number"
            inputColor="plant"
            :invalidInput="
              isFormValid === false && formData.weightAfterSoaking === null
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
              <div v-if="formData.weightAfterSoaking !== null">kg</div>
            </template>
            <template v-slot:message>
              <span
                v-if="
                  isFormValid === false && formData.weightAfterSoaking === null
                "
                >Wpisz wagę po namaczaniu</span
              >
              <span v-else>&nbsp;</span>
            </template>
          </base-text-input>
        </div>
      </div>
      <!-- Checkbox for indicating if the plant was shredded -->
      <v-checkbox
        class="checkbox_isPlantShredded"
        v-model="formData.isPlantShredded"
        label="Surowiec rozdrobniony przed destylacją"
        color="var(--secondary-color)"
      ></v-checkbox>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { onMounted, computed, watch, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useApolloClient } from "@vue/apollo-composable";
import BaseAutocompleteInput from "@/ui/BaseAutocompleteInput.vue";
import {
  setIntegerNumber,
  setNumberFormat,
  setKeyboardIntegerNumber,
  setKeyboardFormatedNumber,
} from "@/helpers/formatHelpers.js";
import BaseTextInput from "@/ui/BaseTextInput.vue";

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

export default {
  name: "DistillationPlant",
  components: { BaseTextInput, BaseAutocompleteInput },
  props: ["isFormValid", "isEditing"],

  setup(props) {
    // Apollo client instance
    const { resolveClient } = useApolloClient();
    const apolloClient = resolveClient();

    // Vuex store
    const store = useStore();

    // Name of the vuex store module
    const storeName = "distillation";

    const router = useRouter();
    const route = useRoute();

    const searchQuery = ref("");
    const plant = ref("");
    const plants = ref([]);
    const timeout = ref(null);

    // Computed properties to get form data from Vuex store
    const formData = computed(
      () => store.getters["distillation/distillationForm"]
    );
    const isPlantSoaked = computed(
      () => store.getters["distillation/isPlantSoaked"]
    );
    const isPlantShredded = computed(
      () => store.getters["distillation/isPlantShredded"]
    );
    const comingFromRoute = computed(() => store.getters.comingFromRoute);

    const getPlantData = async () => {
      try {
        const { data } = await apolloClient.query({
          query: GET_BASIC_PLANT_BY_ID,
          variables: { id: route.params.id, formatDates: true },
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
    const fetchData = (key, value) => {
      store.dispatch("distillation/fetchLocalStorageData", {
        key: key,
        isPlant: value,
      });
    };

    // Fetch initial data from local storage on component mount
    onMounted(async () => {
      console.log(route.params.id);
      if (comingFromRoute.value) {
        if (route.params.id) {
          const plantData = await getPlantData();
          store.dispatch("distillation/setChoosedPlant", {
            key: "id",
            value: plantData._id,
          });
          store.dispatch("distillation/setChoosedPlant", {
            key: "name",
            value: plantData.plantName,
          });
          store.dispatch("distillation/setChoosedPlant", {
            key: "part",
            value: plantData.plantPart,
          });
          store.dispatch("distillation/setChoosedPlant", {
            key: "availableWeight",
            value: plantData.availableWeight,
          });
          store.dispatch("distillation/setChoosedPlant", {
            key: "harvestDate",
            value: plantData.harvestDate,
          });
          store.dispatch("distillation/setChoosedPlant", {
            key: "buyDate",
            value: plantData.plantBuyDate,
          });
          plant.value = formData.value.choosedPlant.name;
        } else {
          return;
        }
      } else {
        fetchData("id", true);
        fetchData("name", true);
        fetchData("part", true);
        fetchData("availableWeight", true);
        fetchData("harvestDate", true);
        fetchData("buyDate", true);
        fetchData("weightForDistillation", false);
        fetchData("isPlantSoaked", false);
        fetchData("soakingTime", false);
        fetchData("weightAfterSoaking", false);
        fetchData("isPlantShredded", false);
        plant.value = formData.value.choosedPlant.name;
      }
    });

    /**
     * @function setPlantState
     * @description Updates the selected plant's state in Vuex by dispatching key-value pairs.
     * @param {string} key - The key of the plant attribute.
     * @param {any} value - The value of the plant attribute.
     */
    const setPlantState = (key, value) => {
      store.dispatch("distillation/setChoosedPlant", {
        key: key,
        value: value,
      });
    };

    /**
     * @function setPlant
     * @desctiption Sets the selected plant details in the form, including plant ID, name, part, and weight. Clears the search input and list of plants after selection.
     * @param {Object} value - The selected plant object from the plant list.
     * @param {string} input - The input identifier triggering the event.
     */
    const setPlant = (value, input) => {
      setPlantState("id", value._id);
      setPlantState("name", value.plantName);
      setPlantState("part", value.plantPart);
      setPlantState("availableWeight", value.availableWeight);
      setPlantState("harvestDate", value.harvestDate);
      setPlantState("buyDate", value.plantBuyDate);
      searchQuery.value = "";
      plant.value = value.plantName;
      plants.value = [];
      console.log("setPlant", plant, input);
      if (props.isEditing) {
        router.replace({ name: 'EditDistillationPage', params: { id: value._id } });
      } else {
        router.replace({ name: 'AddDistillationPage', params: { id: value._id } });
      }
    };

    /**
     * @async
     * @function fetchPlantList
     * @description Fetch the list of plants from the GraphQL server by matching name.
     * @returns {Promise<void>}
     */
    const fetchPlants = async (name) => {
      console.log("fetch plants!", name);
      try {
        const { data } = await apolloClient.query({
          query: GET_PLANTS,
          fetchPolicy: "network-only",
          variables: {
            fields: [
              "plantName",
              "plantPart",
              "availableWeight",
              "harvestDate",
              "plantBuyDate",
              "_id",
            ],
            name: name,
          },
        });

        plants.value = data.getPlants;
        console.log("plants", plants.value);
      } catch (error) {
        console.error("Failed to get plant list:", error);
        plants.value = [];
      }
    };

    /**
     * @function onInput
     * @description Handles the input event for the search or autocomplete component. Updates the search query and manages the timer to limit the frequency of fetch requests.
     * @param {Event} e - The input event triggered by user interaction.
     * @returns {void}
     */
    const onInput = (value, input) => {
      if (input === "choosedPlant") {
        setPlantState("id", null);
        setPlantState("name", "");
        setPlantState("part", "");
        setPlantState("availableWeight", null);
        setPlantState("harvestDate", "");
        setPlantState("buyDate", "");
      }
      if (props.isEditing) {
        router.replace({ name: 'EditDistillationPage', params: { id: null } });
      } else {
        router.replace({ name: 'AddDistillationPage', params: { id: null } });
      }
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
    const setInteger = (value, id, storeName) => {
      setIntegerNumber(store, value, id, storeName);
    };

    // Using the format function
    const setNumber = (value, id, storeName) => {
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
      plant,
      plants,
      setPlant,
      onInput,
      onBlur,
      setNumber,
      setInteger,
      setKeyboardIntegerNumber,
      setKeyboardFormatedNumber,
    };
  },
};
</script>

<style scoped>
.distillation_plant,
.checkbox_container--isSoaked,
.container--isSoaked {
  display: flex;
  flex-direction: column;
}

.plant_title {
  font-size: 16px;
}

.plant_informations,
.plant_information,
.checkbox_container {
  display: flex;
  flex-direction: row;
}

.plant_informations {
  gap: 20px;
}

.plant_information {
  gap: 10px;
  font-size: 13px;
  color: black;
  justify-content: flex-start;
}

.information {
  color: var(--secondary-color);
}

.plant_weight {
  margin-top: 20px;
}

.checkbox_container {
  gap: 50px;
  align-items: flex-start;
  justify-content: center;
}

.checkbox {
  color: black;
  margin-bottom: 10px;
}

.checkbox :deep(.v-input__details) {
  display: none;
}

.checkbox_container--isSoaked {
  flex-grow: 1;
}

.container--isSoaked {
  gap: 20px;
}

.weightAfterSoaking {
  margin-bottom: 20px;
}

.checkbox_isPlantShredded {
  flex-grow: 1;
  color: black;
}
</style>
