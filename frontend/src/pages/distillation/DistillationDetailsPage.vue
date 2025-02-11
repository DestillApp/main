// no code and atch docs
<template>
  <div>
    <!-- Spinner that shows when data is loading -->
    <v-progress-circular
      v-if="isLoading"
      class="spinner"
      color="var(--secondary-color-distillation)"
      :size="60"
      :width="6"
      indeterminate
    ></v-progress-circular>
    <!-- Display distillation details once data is loaded and no longer loading -->
    <div v-if="distillationDetails && !isLoading" class="distillation">
      <div class="distillation_container--one">
        <!-- Display used weight of plant-->
        <div class="plant_distillation">
          <p class="plant_distillation--used">użyta ilość surowca:</p>
          <span>{{ distillationDetails.weightForDistillation }} kg</span>
        </div>
        <!-- Display plant identification information -->
        <div class="plant_identification">
          <h3>destylacja {{ distillationDetails.distillationType }}</h3>
          <div>{{ distillationDetails.choosedPlant.name }}</div>
          <div>{{ distillationDetails.choosedPlant.part }}</div>
        </div>
        <div class="distillation_buttons">
          <router-link
            :to="{
              name: 'EditDistillationPage',
              params: {
                page: page,
                distillId: distillationId,
                id: distillationDetails.choosedPlant.id,
              },
            }"
            ><button class="distillation_button--edit">
              Edytuj
            </button></router-link
          >
          <button
            @click="
              openDeleteModal(
                distillationDetails._id,
                distillationDetails.choosedPlant.id,
                distillationDetails.choosedPlant.name,
                distillationDetails.choosedPlant.part,
                distillationDetails.weightForDistillation,
                distillationDetails.distillationDate
              )
            "
            class="distillation_button--delete"
          >
            Usuń
          </button>
          <!-- Modal for deleting the plant -->
          <delete-item-modal
            v-if="isModalOpen"
            :plantName="plantName"
            :plantPart="plantPart"
            :distillationDate="distillationDate"
            @close-modal="closeDeleteModal"
            @close-delete-modal="closeDeleteModal"
            @delete-item="deleteDistillation"
          ></delete-item-modal>
          <ask-modal
            v-if="isAskModalOpen"
            :plantName="plantName"
            :plantPart="plantPart"
            :distillationWeight="distillationWeight"
            @handle-yes="handleYes"
            @close-modal="closeAskModal"
          ></ask-modal>
        </div>
      </div>
      <div class="distillation_container--two">
        <div class="plant_info">
          <h5 class="plant_title">przygotowanie surowca</h5>
          <div v-if="distillationDetails.isPlantSoaked">
            <div class="plant_data">surowiec namaczany</div>
            <div class="plant_data">
              czas namaczania: {{ distillationDetails.soakingTime }} h
            </div>
            <div class="plant_data">
              waga po namoczeniu:
              {{ distillationDetails.weightAfterSoaking }} kg
            </div>
          </div>
          <div class="plant_data" v-if="!distillationDetails.isPlantSoaked">
            surowiec nienamaczany
          </div>
          <div class="plant_data" v-if="!distillationDetails.isPlantShredded">
            surowiec nierozdrobniony
          </div>
          <div class="plant_data" v-if="distillationDetails.isPlantShredded">
            surowiec rozdrobniony
          </div>
          <div class="plant_details">
            <button
              v-if="!isPlantOpen"
              @click="openClosePlant"
              class="plant_button"
            >
              więcej o surowcu
              <svg-icon
                class="icon"
                type="mdi"
                :path="pathArrowDown"
                size="18"
              ></svg-icon>
            </button>
            <button
              v-if="isPlantOpen"
              @click="openClosePlant"
              class="plant_button"
            >
              mniej o surowcu
              <svg-icon
                class="icon"
                type="mdi"
                :path="pathArrowUp"
                size="18"
              ></svg-icon>
            </button>
            <plant-details
              v-if="isPlantOpen"
              class="plant_details--component"
              :plantId="distillationDetails.choosedPlant.id"
            ></plant-details>
          </div>
        </div>
        <div class="distillation_info">
          <h5 class="distillation_title">informacje o destylacji</h5>
          <div class="distillation_data">
            data destylacji: {{ distillationDetails.distillationDate }}
          </div>
          <div class="distillation_data">
            {{ distillationDetails.distillationApparatus }}
          </div>
          <div class="distillation_data">
            ilość wody do destylacji:
            {{ distillationDetails.waterForDistillation }} l
          </div>
        </div>
      </div>
      <router-link
        :to="{
          name: 'AddResultsPage',
          params: {
            distillId: distillationId,
          },
        }"
        class="distillation_results"
        ><base-button class="results_button"
          >Dodaj wyniki destylacji</base-button
        ></router-link
      >
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { useApolloClient } from "@vue/apollo-composable";
import DeleteItemModal from "@/components/plant/DeleteItemModal.vue";
import BaseButton from "@/ui/BaseButton.vue";
import SvgIcon from "@jamescoyle/vue-icon";
import PlantDetails from "@/components/plant/PlantDetails.vue";
import { mdiChevronDown } from "@mdi/js";
import { mdiChevronUp } from "@mdi/js";
import DOMPurify from "dompurify";
import { GET_DISTILLATION_BY_ID } from "@/graphql/queries/distillation";
import { DELETE_DISTILLATION } from "@/graphql/mutations/distillation";
import { CHANGE_AVAILABLE_WEIGHT } from "@/graphql/mutations/plant";

export default {
  name: "DistillationDetailsPage",
  components: { DeleteItemModal, BaseButton, SvgIcon, PlantDetails },
  setup() {
    const { resolveClient } = useApolloClient();
    const apolloClient = resolveClient();

    // Vuex store instance
    const store = useStore();

    // Route object to access route params
    const route = useRoute();
    // Router object for navigation
    const router = useRouter();

    // Reactive references for distillation data
    const distillationId = ref(route.params.distillId);
    const distillationDetails = ref(null);
    const selectedDistillationId = ref(null);
    const selectedPlantId = ref(null);
    const plantName = ref(null);
    const plantPart = ref(null);
    const distillationWeight = ref(null);
    const distillationDate = ref(null);

    // Reactive reference to store the plant ID and plant page number from the route
    const page = ref(Number(route.params.page));

    // Reactive reference to track if the delete modal is open
    const isModalOpen = ref(false);
    const isAskModalOpen = ref(false);

    // Reactive reference to track loading state
    const isLoading = ref(true);
    const isPlantOpen = ref(false);

    const pathArrowDown = ref(mdiChevronDown);
    const pathArrowUp = ref(mdiChevronUp);

    /**
     * @async
     * @function fetchDistillationDetails
     * @description Fetches the plant details by plant ID from GraphQL API.
     * @returns {Promise<void>}
     */
    const fetchDistillationDetails = async () => {
      try {
        isLoading.value = true;
        const { data } = await apolloClient.query({
          query: GET_DISTILLATION_BY_ID,
          fetchPolicy: "network-only",
          variables: { id: distillationId.value, formatDates: true },
        });
        distillationDetails.value = data.getDistillationById;
        console.log(distillationDetails.value);
      } catch (error) {
        if (error.message === "Unauthorized") {
          await store.dispatch("auth/logout");
          router.push("/login");
        }
        console.error("Failed to get plant details:", error);
        distillationDetails.value = null;
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(() => {
      fetchDistillationDetails();
    });

    const openClosePlant = () => {
      if (isPlantOpen.value) {
        isPlantOpen.value = false;
      } else {
        isPlantOpen.value = true;
      }
    };

    /**
     * @function openDeleteModal
     * @description Open the delete modal for a specific plant.
     * @param {String} id - The ID of the plant to delete.
     * @param {String} name - The name of the plant.
     * @param {String} part - The part of the plant.
     * @param {String} date - Distillation date.
     */
    const openDeleteModal = (id, plantId, name, part, dWeight, date) => {
      selectedDistillationId.value = id;
      selectedPlantId.value = plantId;
      plantName.value = name;
      plantPart.value = part;
      distillationWeight.value = dWeight;
      distillationDate.value = date;
      isModalOpen.value = true;
    };

    /**
     * @function closeDeleteModal
     * @description Close the delete modal.
     */
    const closeDeleteModal = () => {
      distillationDate.value = null;
      isModalOpen.value = false;
    };

    /**
     * @function openAskModal
     * @description Open the ask modal.
     */
    const openAskModal = () => {
      isAskModalOpen.value = true;
    };

    /**
     * @function closeAskModal
     * @description Close the ask modal.
     */
    const closeAskModal = () => {
      isAskModalOpen.value = false;
      selectedDistillationId.value = null;
      selectedPlantId.value = null;
      distillationWeight.value = null;
      plantName.value = null;
      plantPart.value = null;
      router.push({
        name: "InProgressDistillationsPage",
        params: { page: 1 },
      });
    };

    /**
     * @async
     * @function deleteDistillation
     * @description Delete the selected distillation.
     * @returns {Promise<void>}
     */
    const deleteDistillation = async () => {
      try {
        const { data } = await apolloClient.mutate({
          mutation: DELETE_DISTILLATION,
          variables: { id: selectedDistillationId.value },
        });
        if (data.deleteDistillation) {
          openAskModal();
        }
        closeDeleteModal();
      } catch (error) {
        console.error("Failed to delete distillation:", error);
      }
    };

    /**
     * @async
     * @function addPlantWeight
     * @description Add the distillation weight back to the plant's available weight.
     * @returns {Promise<void>}
     */
    const addPlantWeight = async () => {
      try {
        const sanitizedAvailableWeight = Number(
          DOMPurify.sanitize(distillationWeight.value)
        );
        const { data } = await apolloClient.mutate({
          mutation: CHANGE_AVAILABLE_WEIGHT,
          variables: {
            input: {
              id: selectedPlantId.value,
              availableWeight: sanitizedAvailableWeight,
            },
          },
        });
        console.log("Changed available weight:", data.changeAvailableWeight);
      } catch (error) {
        console.error("Failed to update available weight:", error);
      }
    };

    /**
     * @async
     * @function handleYes
     * @description Handle the confirmation of adding plant weight.
     * @returns {Promise<void>}
     */
    const handleYes = async () => {
      await addPlantWeight();
      closeAskModal();
    };

    return {
      distillationId,
      page,
      isLoading,
      distillationDetails,
      isModalOpen,
      isAskModalOpen,
      isPlantOpen,
      plantName,
      plantPart,
      distillationDate,
      distillationWeight,
      pathArrowDown,
      pathArrowUp,
      openClosePlant,
      openDeleteModal,
      closeDeleteModal,
      closeAskModal,
      deleteDistillation,
      handleYes,
    };
  },
};
</script>

<style scoped>
.spinner {
  margin-block: 20px;
}

.distillation {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.distillation_container--one {
  display: flex;
  flex-direction: row;
}

.plant_distillation {
  width: 20%;
  display: flex;
  flex-direction: column;
}

.plant_distillation--used {
  font-size: 11px;
}

.plant_identification {
  width: 60%;
  padding-top: 20px;
}

.distillation_buttons {
  display: flex;
  flex-direction: row;
  width: 20%;
  font-size: 11px;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 10px;
}

.distillation_button--edit {
  color: var(--secondary-color-distillation);
}

.distillation_button--edit:hover {
  color: var(--primary-color-distillation);
}

.distillation_button--delete:hover {
  color: var(--error-color);
}

.distillation_container--two {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

.plant_info,
.distillation_info {
  width: 50%;
}

.plant_title {
  color: var(--secondary-color);
  padding-bottom: 10px;
}

.plant_data,
.distillation_data {
  display: flex;
  justify-content: flex-start;
  font-size: 13px;
  padding-left: 20%;
  padding-right: 10%;
}

.distillation_title {
  color: var(--secondary-color-distillation);
  padding-bottom: 10px;
}

.plant_details {
  display: flex;
  flex-direction: column;
}

.plant_button {
  position: relative;
  color: var(--secondary-color);
  font-size: 11px;
  margin-top: 20px;
  float: left;
  margin-left: 20%;
  text-align: left;
}

.plant_button:hover {
  color: var(--primary-color);
}

.plant_details--component {
  text-align: left;
  margin-left: 20%;
}

.icon {
  position: absolute;
}

.distillation_results {
  padding-block: 10px;
  margin-inline: 30%;
}

.results_button:hover {
  color: var(--secondary-color-distillation);
}
</style>
