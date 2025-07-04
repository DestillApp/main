<template>
  <div>
    <!-- Spinner that shows when data is loading -->
    <v-progress-circular
      v-if="isLoading"
      class="distillation__spinner"
      color="var(--secondary-color-distillation)"
      :size="60"
      :width="6"
      indeterminate
    ></v-progress-circular>
    <!-- Display distillation details once data is loaded and no longer loading -->
    <div v-if="distillationDetails && !isLoading" class="distillation">
      <div class="distillation__container--one">
        <!-- Display used weight of plant-->
        <div class="distillation__plant">
          <p class="distillation__plant-used">użyta ilość surowca:</p>
          <span>{{ distillationDetails.weightForDistillation }} kg</span>
        </div>
        <!-- Display plant identification information -->
        <div class="distillation__plant-identification">
          <h3>destylacja {{ distillationDetails.distillationType }}</h3>
          <div>{{ distillationDetails.choosedPlant.name }}</div>
          <div>{{ distillationDetails.choosedPlant.part }}</div>
        </div>
        <div class="distillation__buttons">
          <!-- Edit button for distillation -->
          <router-link
            :to="{
              name: 'EditDistillationPage',
              params: {
                page: page,
                distillId: distillationId,
                id: distillationDetails.choosedPlant.id,
              },
            }"
            ><button class="distillation__button--edit">
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
            class="distillation__button--delete"
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
          <!-- Modal for restoring plant weight after deletion -->
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
      <div class="distillation__container--two">
        <div class="distillation__plant-info">
          <h5 class="distillation__plant-title">przygotowanie surowca</h5>
          <!-- Soaking info -->
          <div v-if="distillationDetails.isPlantSoaked">
            <div class="distillation__plant-data">surowiec namaczany</div>
            <div class="distillation__plant-data">
              czas namaczania: {{ distillationDetails.soakingTime }} h
            </div>
            <div class="distillation__plant-data">
              waga po namoczeniu:
              {{ distillationDetails.weightAfterSoaking }} kg
            </div>
          </div>
          <div v-if="!distillationDetails.isPlantSoaked">
            <div class="distillation__plant-data">surowiec nie namaczany</div>
          </div>
          <!-- Shredding info -->
          <div v-if="distillationDetails.isPlantShredded">
            <div class="distillation__plant-data">surowiec rozdrobniony</div>
          </div>
          <div v-if="!distillationDetails.isPlantShredded">
            <div class="distillation__plant-data">
              surowiec nie rozdrobniony
            </div>
          </div>
          <!-- Toggle plant details button -->
          <button
            v-if="!isPlantOpen"
            @click="openClosePlant"
            class="distillation__plant-button"
          >
            więcej o surowcu
            <svg-icon
              class="distillation__icon"
              type="mdi"
              :path="pathArrowDown"
              size="18"
            ></svg-icon>
          </button>
          <button
            v-if="isPlantOpen"
            @click="openClosePlant"
            class="distillation__plant-button"
          >
            mniej o surowcu
            <svg-icon
              class="distillation__icon"
              type="mdi"
              :path="pathArrowUp"
              size="18"
            ></svg-icon>
          </button>
          <!-- Plant details component, shown when expanded -->
          <plant-details
            v-if="isPlantOpen"
            class="distillation__plant-details-component"
            :plantId="distillationDetails.choosedPlant.id"
          ></plant-details>
        </div>
        <div class="distillation__info">
          <h5 class="distillation__title">informacje o destylacji</h5>
          <div class="distillation__data">
            data destylacji: {{ distillationDetails.distillationDate }}
          </div>
          <div class="distillation__data">
            {{ distillationDetails.distillationApparatus }}
          </div>
          <div class="distillation__data">
            ilość wody do destylacji:
            {{ distillationDetails.waterForDistillation }} l
          </div>
        </div>
      </div>
      <!-- Button to add distillation results -->
      <router-link
        :to="{
          name: 'AddResultsPage',
          params: {
            distillId: distillationId,
          },
        }"
        class="distillation__results"
        ><base-button class="distillation__results-button"
          >Dodaj wyniki destylacji</base-button
        ></router-link
      >
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useApolloClient } from "@vue/apollo-composable";
import DeleteItemModal from "@/components/plant/DeleteItemModal.vue";
import BaseButton from "@/ui/BaseButton.vue";
import SvgIcon from "@jamescoyle/vue-icon";
import PlantDetails from "@/components/plant/PlantDetails.vue";
import { handleUserError } from "@/helpers/errorHandling";
import { mdiChevronDown } from "@mdi/js";
import { mdiChevronUp } from "@mdi/js";

import { GetDistillationById } from "@/types/forms/distillationForm";
import { GET_DISTILLATION_BY_ID } from "@/graphql/queries/distillation";
import { DELETE_DISTILLATION } from "@/graphql/mutations/distillation";
import { CHANGE_AVAILABLE_WEIGHT } from "@/graphql/mutations/plant";
import * as Sentry from "@sentry/vue";

/**
 * @component DistillationDetailsPage
 * @description Displays details of a distillation, allows editing, deleting, and restoring plant weight. Handles fetching, deletion, and restoration logic.
 * @see fetchDistillationDetails
 * @see openDeleteModal
 * @see closeDeleteModal
 * @see openAskModal
 * @see closeAskModal
 * @see deleteDistillation
 * @see addPlantWeight
 * @see handleYes
 * @see openClosePlant
 */

export default {
  name: "DistillationDetailsPage",
  components: { DeleteItemModal, BaseButton, SvgIcon, PlantDetails },
  setup() {
    const { resolveClient } = useApolloClient();
    const apolloClient = resolveClient();

    // Route object to access route params
    const route = useRoute();
    // Router object for navigation
    const router = useRouter();

    // Reactive references for distillation data
    const distillationId = ref<string | string[]>(route.params.distillId);
    const distillationDetails = ref<GetDistillationById | null>(null);
    const selectedDistillationId = ref<string | null>(null);
    const selectedPlantId = ref<string | null>(null);
    const plantName = ref<string>("");
    const plantPart = ref<string>("");
    const distillationWeight = ref<number | null>(null);
    const distillationDate = ref<string>("");

    // Current page number from route
    const page = ref<number>(Number(route.params.page));

    // Modal open state refs
    const isModalOpen = ref<boolean>(false);
    const isAskModalOpen = ref<boolean>(false);

    // Loading state ref
    const isLoading = ref<boolean>(true);
    // Plant details open/close state
    const isPlantOpen = ref<boolean>(false);

    // Arrow icon refs
    const pathArrowDown = ref<string>(mdiChevronDown);
    const pathArrowUp = ref<string>(mdiChevronUp);

    /**
     * Fetches the distillation details by ID from GraphQL API.
     * @async
     * @function fetchDistillationDetails
     * @returns {Promise<void>}
     */
    const fetchDistillationDetails = async (): Promise<void> => {
      try {
        isLoading.value = true;
        const { data } = await apolloClient.query({
          query: GET_DISTILLATION_BY_ID,
          fetchPolicy: "network-only",
          variables: { id: distillationId.value, formatDates: true },
        });
        distillationDetails.value = data.getDistillationById;
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
     * Toggles the plant details section open/close.
     * @function openClosePlant
     */
    const openClosePlant = (): void => {
      isPlantOpen.value = !isPlantOpen.value;
    };

    /**
     * Opens the delete modal for a specific distillation.
     * @function openDeleteModal
     * @param {string} id - The distillation ID.
     * @param {string} plantId - The plant ID.
     * @param {string} name - The plant name.
     * @param {string} part - The plant part.
     * @param {number} dWeight - The distillation weight.
     * @param {string} date - The distillation date.
     */
    const openDeleteModal = (
      id: string,
      plantId: string,
      name: string,
      part: string,
      dWeight: number,
      date: string
    ): void => {
      selectedDistillationId.value = id;
      selectedPlantId.value = plantId;
      plantName.value = name;
      plantPart.value = part;
      distillationWeight.value = dWeight;
      distillationDate.value = date;
      isModalOpen.value = true;
    };

    /**
     * Closes the delete modal.
     * @function closeDeleteModal
     */
    const closeDeleteModal = (): void => {
      distillationDate.value = "";
      isModalOpen.value = false;
    };

    /**
     * Opens the ask modal.
     * @function openAskModal
     */
    const openAskModal = (): void => {
      isAskModalOpen.value = true;
    };

    /**
     * Closes the ask modal and resets related state.
     * @function closeAskModal
     */
    const closeAskModal = () => {
      isAskModalOpen.value = false;
      selectedDistillationId.value = null;
      selectedPlantId.value = null;
      distillationWeight.value = null;
      plantName.value = "";
      plantPart.value = "";
      router.push({
        name: "InProgressDistillationsPage",
        params: { page: 1 },
      });
    };

    /**
     * Deletes the selected distillation.
     * @async
     * @function deleteDistillation
     * @returns {Promise<void>}
     */
    const deleteDistillation = async (): Promise<void> => {
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
        Sentry.captureException(error);
        console.error("Failed to delete distillation:", error);
      }
    };

    /**
     * Adds the distillation weight back to the plant's available weight.
     * @async
     * @function addPlantWeight
     * @returns {Promise<void>}
     */
    const addPlantWeight = async (): Promise<void> => {
      try {
        await apolloClient.mutate({
          mutation: CHANGE_AVAILABLE_WEIGHT,
          variables: {
            input: {
              id: selectedPlantId.value,
              availableWeight: distillationWeight.value,
            },
          },
        });
      } catch (error: any) {
        await handleUserError(error);
      }
    };

    /**
     * Handles confirmation of adding plant weight back after deletion.
     * @async
     * @function handleYes
     * @returns {Promise<void>}
     */
    const handleYes = async (): Promise<void> => {
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
.distillation__spinner {
  margin-block: 20px;
}

.distillation {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.distillation__container--one {
  display: flex;
  flex-direction: row;
}

.distillation__plant {
  width: 20%;
  display: flex;
  flex-direction: column;
}

.distillation__plant-used {
  font-size: 11px;
}

.distillation__plant-identification {
  width: 60%;
  padding-top: 20px;
}

.distillation__buttons {
  display: flex;
  flex-direction: row;
  width: 20%;
  font-size: 11px;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 10px;
}

.distillation__button--edit {
  color: var(--secondary-color-distillation);
}

.distillation__button--edit:hover {
  color: var(--primary-color-distillation);
}

.distillation__button--delete:hover {
  color: var(--error-color);
}

.distillation__container--two {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

.distillation__plant-info,
.distillation__info {
  width: 50%;
}

.distillation__plant-title {
  color: var(--secondary-color);
  padding-bottom: 10px;
}

.distillation__plant-data,
.distillation__data {
  display: flex;
  justify-content: flex-start;
  font-size: 13px;
  padding-left: 20%;
  padding-right: 10%;
}

.distillation__title {
  color: var(--secondary-color-distillation);
  padding-bottom: 10px;
}

.distillation__plant-details-component {
  text-align: left;
  margin-left: 20%;
}

.distillation__plant-button {
  position: relative;
  color: var(--secondary-color);
  font-size: 11px;
  margin-top: 20px;
  float: left;
  margin-left: 20%;
  text-align: left;
  width: 100%;
}

.distillation__plant-button:hover {
  color: var(--primary-color);
}

.distillation__icon {
  position: absolute;
}

.distillation__results {
  padding-block: 10px;
  margin-inline: 30%;
}

.distillation__results-button:hover {
  color: var(--secondary-color-distillation);
}

@media (max-width: 800px) {
  .distillation__container--two {
    flex-direction: column;
    justify-content: center;
    gap: 20px;
  }

  .distillation__plant-info,
  .distillation__info {
    width: 100%;
  }

  .distillation__plant-data,
  .distillation__data {
    justify-content: center;
    padding-left: 0;
    padding-right: 0;
  }

  .distillation__plant-details-component {
    text-align: center;
    margin-left: 0;
  }

  .distillation__plant-button {
    margin-left: 0;
    text-align: center;
  }

  .distillation__results {
    margin-inline: 20%;
  }
}

@media (max-width: 600px) {
  .distillation__results {
    margin-inline: 0;
  }
}
</style>
