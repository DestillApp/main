<template>
  <div>
    <!-- Spinner that shows when data is loading -->
    <v-progress-circular
      v-if="isLoading"
      class="archive-distillation__spinner"
      color="var(--secondary-color-results)"
      :size="60"
      :width="6"
      indeterminate
    ></v-progress-circular>
    <!-- Display distillation details once data is loaded and no longer loading -->
    <div v-if="distillationDetails && !isLoading" class="archive-distillation">
      <div class="archive-distillation__container-one">
        <!-- Display used weight of plant -->
        <div class="archive-distillation__plant">
          <p class="archive-distillation__plant-used">użyta ilość surowca:</p>
          <span
            >{{
              distillationDetails.distillationData.weightForDistillation
            }}
            kg</span
          >
        </div>
        <!-- Display plant identification information -->
        <div class="archive-distillation__plant-identification">
          <h3>
            destylacja
            {{ distillationDetails.distillationData.distillationType }}
          </h3>
          <div>{{ distillationDetails.distilledPlant.plantName }}</div>
          <div>{{ distillationDetails.distilledPlant.plantPart }}</div>
        </div>
        <!-- Edit and delete buttons for the distillation -->
        <div class="archive-distillation__buttons">
          <!-- Button to edit the distillation -->
          <router-link
            :to="{
              name: 'EditArchiveDistillationPage',
              params: {
                page: page,
                archiveId: archiveId,
              },
            }"
            ><button class="archive-distillation__button-edit">
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
            class="archive-distillation__button-delete"
          >
            Usuń
          </button>
          <!-- Modal for deleting the distillation -->
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
      <div class="archive-distillation__container-two">
        <div class="archive-distillation__plant-info">
          <h5 class="archive-distillation__plant-title">
            przygotowanie surowca
          </h5>
          <!-- Plant soaking info -->
          <div v-if="distillationDetails.distillationData.isPlantSoaked">
            <div class="archive-distillation__plant-data">
              surowiec namaczany
            </div>
            <div class="archive-distillation__plant-data">
              czas namaczania:
              {{ distillationDetails.distillationData.soakingTime }} h
            </div>
            <div class="archive-distillation__plant-data">
              waga po namoczeniu:
              {{ distillationDetails.distillationData.weightAfterSoaking }} kg
            </div>
          </div>
          <!-- Plant not soaked info -->
          <div
            class="archive-distillation__plant-data"
            v-if="!distillationDetails.distillationData.isPlantSoaked"
          >
            surowiec nienamaczany
          </div>
          <!-- Plant shredded info -->
          <div
            class="archive-distillation__plant-data"
            v-if="!distillationDetails.distillationData.isPlantShredded"
          >
            surowiec nierozdrobniony
          </div>
          <div
            class="archive-distillation__plant-data"
            v-if="distillationDetails.distillationData.isPlantShredded"
          >
            surowiec rozdrobniony
          </div>
          <!-- Button to show/hide more plant details -->
          <div class="archive-distillation__plant-details">
            <button
              v-if="!isPlantOpen"
              @click="openClosePlant"
              class="archive-distillation__plant-button"
            >
              więcej o surowcu
              <svg-icon
                class="archive-distillation__icon"
                type="mdi"
                :path="pathArrowDown"
                size="18"
              ></svg-icon>
            </button>
            <button
              v-if="isPlantOpen"
              @click="openClosePlant"
              class="archive-distillation__plant-button"
            >
              mniej o surowcu
              <svg-icon
                class="archive-distillation__icon"
                type="mdi"
                :path="pathArrowUp"
                size="18"
              ></svg-icon>
            </button>
            <!-- Plant details component -->
            <plant-details
              v-if="isPlantOpen"
              class="archive-distillation__plant-details-component"
              :distilledPlant="distillationDetails.distilledPlant"
            ></plant-details>
          </div>
        </div>
        <div class="archive-distillation__info">
          <h5 class="archive-distillation__title">informacje o destylacji</h5>
          <div class="archive-distillation__data">
            data destylacji:
            {{ distillationDetails.distillationData.distillationDate }}
          </div>
          <div class="archive-distillation__data">
            {{ distillationDetails.distillationData.distillationApparatus }}
          </div>
          <div class="archive-distillation__data">
            ilość wody do destylacji:
            {{ distillationDetails.distillationData.waterForDistillation }} l
          </div>
        </div>
      </div>
      <div>
        <h5 class="archive-distillation__results-title">wyniki destylacji</h5>
        <div class="archive-distillation__results">
          <div>
            ilość olejku eterycznego: {{ distillationDetails.oilAmount }} ml
          </div>
          <div class="archive-distillation__results-hydrosol">
            <div>
              ilość hydrolatu: {{ distillationDetails.hydrosolAmount }} l
            </div>
            <div>pH hydrolatu: {{ distillationDetails.hydrosolpH }}</div>
          </div>
          <div class="archive-distillation__results-descriptions">
            <div class="archive-distillation__results-description">
              opis olejku eterycznego: {{ distillationDetails.oilDescription }}
            </div>
            <div class="archive-distillation__results-description">
              opis hydrolatu: {{ distillationDetails.hydrosolDescription }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, Ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "@/store/useStore";
import { useApolloClient } from "@vue/apollo-composable";
import DeleteItemModal from "@/components/plant/DeleteItemModal.vue";
import SvgIcon from "@jamescoyle/vue-icon";
import PlantDetails from "@/components/plant/PlantDetails.vue";
import { mdiChevronDown } from "@mdi/js";
import { mdiChevronUp } from "@mdi/js";
import { GET_ARCHIVE_DISTILLATION_BY_ID } from "@/graphql/queries/results";
import { DELETE_DISTILLATION_ARCHIVE } from "@/graphql/mutations/results";
import { handleUserError } from "@/helpers/errorHandling";
import type { DistillationArchive } from "@/types/forms/resultsForm";

/**
 * @component ArchiveDistillationDetailsPage
 * @description Displays details of a distillation archive, allows editing, deleting, and viewing plant details.
 * @see fetchDistillationDetails
 * @see openClosePlant
 * @see openDeleteModal
 * @see closeDeleteModal
 * @see deleteDistillation
 */
export default {
  name: "ArchiveDistillationDetailsPage",
  components: { DeleteItemModal, SvgIcon, PlantDetails },
  setup() {
    const { resolveClient } = useApolloClient();
    const apolloClient = resolveClient();

    // Vuex store instance
    const store = useStore();

    // Route object to access route params
    const route = useRoute();
    // Router object for navigation
    const router = useRouter();

    // Archive distillation id from route
    const archiveId = ref<string | string[] | undefined>(
      route.params.archiveId
    );
    // Distillation details object
    const distillationDetails = ref<DistillationArchive | null>(null);
    // Selected distillation id for deletion
    const selectedDistillationId = ref<string | null>(null);
    // Plant name for modal
    const plantName = ref<string>("");
    // Plant part for modal
    const plantPart = ref<string>("");
    // Distillation weight for modal (not always used)
    const distillationWeight = ref<number | null>(null);
    // Distillation date for modal
    const distillationDate = ref<string>("");

    // Page number from route
    const page = ref<number>(Number(route.params.page));

    // Modal open state
    const isModalOpen = ref<boolean>(false);
    // Loading state
    const isLoading = ref<boolean>(true);
    // Plant details open/close state
    const isPlantOpen = ref<boolean>(false);

    // Icon paths for toggling plant details
    const pathArrowDown = ref<string>(mdiChevronDown);
    const pathArrowUp = ref<string>(mdiChevronUp);

    /**
     * Fetches the archive distillation details by ID from GraphQL API.
     * @async
     * @function fetchDistillationDetails
     * @returns {Promise<void>}
     */
    const fetchDistillationDetails = async (): Promise<void> => {
      try {
        isLoading.value = true;
        const { data } = await apolloClient.query({
          query: GET_ARCHIVE_DISTILLATION_BY_ID,
          variables: { id: archiveId.value, formatDistillDate: true },
        });
        distillationDetails.value = data.getArchiveDistillationById;
      } catch (error: any) {
        await handleUserError(error);
        distillationDetails.value = null;
      } finally {
        isLoading.value = false;
      }
    };

    // Fetch distillation details on mount
    onMounted(() => {
      fetchDistillationDetails();
    });

    /**
     * Toggles the plant details open/close state.
     * @function openClosePlant
     */
    const openClosePlant = (): void => {
      isPlantOpen.value = !isPlantOpen.value;
    };

    /**
     * Opens the delete modal for a specific distillation.
     * @function openDeleteModal
     * @param {String} id - The ID of the distillation to delete.
     * @param {String} name - The name of the plant.
     * @param {String} part - The part of the plant.
     * @param {String} date - Distillation date.
     */
    const openDeleteModal = (
      id: string,
      name: string,
      part: string,
      date: string
    ): void => {
      selectedDistillationId.value = id;
      plantName.value = name;
      plantPart.value = part;
      distillationDate.value = date;
      isModalOpen.value = true;
    };

    /**
     * Closes the delete modal.
     * @function closeDeleteModal
     */
    const closeDeleteModal = (): void => {
      selectedDistillationId.value = null;
      plantName.value = "";
      plantPart.value = "";
      distillationDate.value = "";
      isModalOpen.value = false;
    };

    /**
     * Deletes the selected distillation archive and navigates to the archives page.
     * @async
     * @function deleteDistillation
     * @returns {Promise<void>}
     */
    const deleteDistillation = async (): Promise<void> => {
      try {
        const { data } = await apolloClient.mutate({
          mutation: DELETE_DISTILLATION_ARCHIVE,
          variables: { id: selectedDistillationId.value },
        });
        closeDeleteModal();
        router.push({
          name: "DistillationArchivesPage",
          params: { page: page.value },
        });
      } catch (error: any) {
        await handleUserError(error);
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
.archive-distillation__spinner {
  margin-block: 20px;
}

.archive-distillation {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.archive-distillation__container-one {
  display: flex;
  flex-direction: row;
}

.archive-distillation__plant {
  width: 20%;
  display: flex;
  flex-direction: column;
}

.archive-distillation__plant-used {
  font-size: 11px;
}

.archive-distillation__plant-identification {
  width: 60%;
  padding-top: 20px;
}

.archive-distillation__buttons {
  display: flex;
  flex-direction: row;
  width: 20%;
  font-size: 11px;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 10px;
}

.archive-distillation__button-edit {
  color: var(--secondary-color-results);
}

.archive-distillation__button-edit:hover {
  color: var(--primary-color-results);
}

.archive-distillation__button-delete:hover {
  color: red;
}

.archive-distillation__container-two {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

.archive-distillation__plant-info,
.archive-distillation__info {
  width: 50%;
}

.archive-distillation__plant-title {
  color: var(--secondary-color);
  padding-bottom: 10px;
}

.archive-distillation__plant-data,
.archive-distillation__data {
  display: flex;
  justify-content: flex-start;
  font-size: 13px;
  padding-left: 20%;
  padding-right: 10%;
}

.archive-distillation__title {
  color: var(--secondary-color-distillation);
  padding-bottom: 10px;
}

.archive-distillation__plant-details {
  display: flex;
  flex-direction: column;
}

.archive-distillation__plant-button {
  position: relative;
  color: var(--secondary-color);
  font-size: 11px;
  margin-top: 20px;
  float: left;
  margin-left: 20%;
  text-align: left;
}

.archive-distillation__plant-button:hover {
  color: var(--primary-color);
}

.archive-distillation__plant-details-component {
  text-align: left;
  margin-left: 20%;
}

.archive-distillation__icon {
  position: absolute;
}

.archive-distillation__results-title {
  color: var(--secondary-color-results);
  padding-bottom: 10px;
}

.archive-distillation__results {
  font-size: 13px;
  display: flex;
  flex-direction: column;
}

.archive-distillation__results-hydrosol {
  display: flex;
  flex-direction: row;
  gap: 20px;
  justify-content: center;
}

.archive-distillation__results-descriptions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.archive-distillation__results-description {
  text-align: start;
  padding-inline: 10%;
}

@media (max-width: 800px) {
  .archive-distillation__container-two {
    flex-direction: column;
    justify-content: center;
    gap: 20px;
  }

  .archive-distillation__plant-info,
  .archive-distillation__info {
    width: 100%;
  }

  .archive-distillation__plant-data,
  .archive-distillation__data {
    justify-content: center;
    padding-left: 0;
    padding-right: 0;
  }

  .archive-distillation__plant-details-component {
    text-align: center;
    margin-left: 0;
  }

  .archive-distillation__plant-button {
    margin-left: 0;
    text-align: center;
  }
}
</style>
