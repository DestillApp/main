<template>
  <div>
    <!-- Spinner that shows when data is loading -->
    <v-progress-circular
      v-if="isLoading"
      class="spinner"
      color="var(--secondary-color-results)"
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
          <span
            >{{
              distillationDetails.distillationData.weightForDistillation
            }}
            kg</span
          >
        </div>
        <!-- Display plant identification information -->
        <div class="plant_identification">
          <h3>
            destylacja
            {{ distillationDetails.distillationData.distillationType }}
          </h3>
          <div>{{ distillationDetails.distilledPlant.plantName }}</div>
          <div>{{ distillationDetails.distilledPlant.plantPart }}</div>
        </div>
        <div class="distillation_buttons">
          <router-link
            :to="{
              name: 'EditArchiveDistillationPage',
              params: {
                page: page,
                archiveId: archiveId,
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
                distillationDetails.distilledPlant.plantName,
                distillationDetails.distilledPlant.plantPart,
                distillationDetails.distillationData.distillationDate
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
        </div>
      </div>
      <div class="distillation_container--two">
        <div class="plant_info">
          <h5 class="plant_title">przygotowanie surowca</h5>
          <div v-if="distillationDetails.distillationData.isPlantSoaked">
            <div class="plant_data">surowiec namaczany</div>
            <div class="plant_data">
              czas namaczania:
              {{ distillationDetails.distillationData.soakingTime }} h
            </div>
            <div class="plant_data">
              waga po namoczeniu:
              {{ distillationDetails.distillationData.weightAfterSoaking }} kg
            </div>
          </div>
          <div
            class="plant_data"
            v-if="!distillationDetails.distillationData.isPlantSoaked"
          >
            surowiec nienamaczany
          </div>
          <div
            class="plant_data"
            v-if="!distillationDetails.distillationData.isPlantShredded"
          >
            surowiec nierozdrobniony
          </div>
          <div
            class="plant_data"
            v-if="distillationDetails.distillationData.isPlantShredded"
          >
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
              :distilledPlant="distillationDetails.distilledPlant"
            ></plant-details>
          </div>
        </div>
        <div class="distillation_info">
          <h5 class="distillation_title">informacje o destylacji</h5>
          <div class="distillation_data">
            data destylacji:
            {{ distillationDetails.distillationData.distillationDate }}
          </div>
          <div class="distillation_data">
            {{ distillationDetails.distillationData.distillationApparatus }}
          </div>
          <div class="distillation_data">
            ilość wody do destylacji:
            {{ distillationDetails.distillationData.waterForDistillation }} l
          </div>
        </div>
      </div>
      <div>
        <h5 class="results_title">wyniki destylacji</h5>
        <div class="results">
          <div>
            ilość olejku eterycznego: {{ distillationDetails.oilAmount }} ml
          </div>
          <div class="results_hydrosol">
            <div>
              ilość hydrolatu: {{ distillationDetails.hydrosolAmount }} l
            </div>
            <div>pH hydrolatu: {{ distillationDetails.hydrosolpH }}</div>
          </div>
          <div class="results_descriptions">
            <div class="results_description">
              opis olejku eterycznego: {{ distillationDetails.oilDescription }}
            </div>
            <div class="results_description">
              opis hydrolatu: {{ distillationDetails.hydrosolDescription }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useApolloClient } from "@vue/apollo-composable";
import DeleteItemModal from "@/components/plant/DeleteItemModal.vue";
import SvgIcon from "@jamescoyle/vue-icon";
import PlantDetails from "@/components/plant/PlantDetails.vue";
import { mdiChevronDown } from "@mdi/js";
import { mdiChevronUp } from "@mdi/js";
import { GET_ARCHIVE_DISTILLATION_BY_ID } from "@/graphql/queries/results";
import { DELETE_DISTILLATION_ARCHIVE } from "@/graphql/mutations/results";

export default {
  name: "ArchiveDistillationDetailsPage",
  components: { DeleteItemModal, SvgIcon, PlantDetails },
  setup() {
    const { resolveClient } = useApolloClient();
    const apolloClient = resolveClient();

    // Route object to access route params
    const route = useRoute();
    // Router object for navigation
    const router = useRouter();

    // Reactive references for distillation data
    const archiveId = ref(route.params.archiveId);
    const distillationDetails = ref(null);
    const selectedDistillationId = ref(null);
    const plantName = ref(null);
    const plantPart = ref(null);
    const distillationWeight = ref(null);
    const distillationDate = ref(null);

    // Reactive reference to store the plant ID and plant page number from the route
    const page = ref(Number(route.params.page));

    // Reactive reference to track if the delete modal is open
    const isModalOpen = ref(false);

    // Reactive reference to track loading state
    const isLoading = ref(true);
    const isPlantOpen = ref(false);

    const pathArrowDown = ref(mdiChevronDown);
    const pathArrowUp = ref(mdiChevronUp);

    /**
     * @async
     * @function fetchDistillationDetails
     * @description Fetches the archive distillation details by ID from GraphQL API.
     * @returns {Promise<void>}
     */
    const fetchDistillationDetails = async () => {
      try {
        isLoading.value = true;
        const { data } = await apolloClient.query({
          query: GET_ARCHIVE_DISTILLATION_BY_ID,
          variables: { id: archiveId.value },
        });
        distillationDetails.value = data.getArchiveDistillationById;
        console.log(distillationDetails.value);
      } catch (error) {
        console.error("Failed to get archive distillation details:", error);
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
    const openDeleteModal = (id, name, part, date) => {
      selectedDistillationId.value = id;
      plantName.value = name;
      plantPart.value = part;
      distillationDate.value = date;
      isModalOpen.value = true;
    };

    /**
     * @function closeDeleteModal
     * @description Close the delete modal.
     */
    const closeDeleteModal = () => {
      selectedDistillationId.value = null;
      plantName.value = null;
      plantPart.value = null;
      distillationDate.value = null;
      isModalOpen.value = false;
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
          mutation: DELETE_DISTILLATION_ARCHIVE,
          variables: { id: selectedDistillationId.value },
        });

        console.log(data.deleteDistillationArchive);
        closeDeleteModal();
        router.push({
          name: "DistillationArchivesPage",
          params: { page: page.value },
        });
      } catch (error) {
        console.error("Failed to delete distillation:", error);
      }
    };

    return {
      archiveId,
      page,
      isLoading,
      distillationDetails,
      isModalOpen,
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
      deleteDistillation,
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
  color: var(--secondary-color-results);
}

.distillation_button--edit:hover {
  color: var(--primary-color-results);
}

.distillation_button--delete:hover {
  color: red;
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

.results_title {
  color: var(--secondary-color-results);
  padding-bottom: 10px;
}

.results {
  font-size: 13px;
  display: flex;
  flex-direction: column;
}

.results_hydrosol {
  display: flex;
  flex-direction: row;
  gap: 20px;
  justify-content: center;
}

.results_descriptions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.results_description {
  text-align: start;
  padding-inline: 10%;
}
</style>
