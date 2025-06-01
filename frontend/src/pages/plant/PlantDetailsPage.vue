<template>
  <div>
    <!-- Spinner that shows when data is loading -->
    <v-progress-circular
      v-if="isLoading"
      class="plant-details__spinner"
      color="var(--secondary-color)"
      :size="60"
      :width="6"
      indeterminate
    ></v-progress-circular>
    <!-- Display plant details once data is loaded and no longer loading -->
    <div v-if="plantDetails && !isLoading" class="plant-details">
      <div class="plant-details__container-one">
        <!-- Display available stock -->
        <div class="plant-details__instock">
          <p class="plant-details__instock-state">na stanie:</p>
          <br />{{ plantDetails.availableWeight }} kg
        </div>
        <!-- Display plant identification information -->
        <div class="plant-details__identification">
          <h3>{{ plantDetails.plantName }}</h3>
          <div>{{ plantDetails.plantPart }}</div>
        </div>
        <!-- Edit and delete buttons for the plant -->
        <div class="plant-details__buttons">
          <router-link
            :to="{ name: 'EditPlantPage', params: { page: page, id: plantId } }"
            ><button class="plant-details__button-edit">
              Edytuj
            </button></router-link
          >
          <button class="plant-details__button-delete" @click="openDeleteModal">
            Usuń
          </button>
          <!-- Modal for deleting the plant -->
          <delete-item-modal
            v-if="isModalOpen"
            :plantName="plantDetails.plantName"
            :plantPart="plantDetails.plantPart"
            @close-modal="closeDeleteModal"
            @close-delete-modal="closeDeleteModal"
            @delete-item="deletePlant"
          ></delete-item-modal>
        </div>
      </div>
      <!-- Display additional plant data -->
      <div class="plant-details__container-two">
        <!-- Show specific data if plant origin is 'zbiór' -->
        <div
          v-if="plantDetails.plantOrigin === 'zbiór'"
          class="plant-details__info"
        >
          <h5 class="plant-details__title">warunki zbioru</h5>
          <div class="plant-details__data">
            data zbioru: {{ plantDetails.harvestDate }}
          </div>
          <div class="plant-details__data">
            temperatura: {{ plantDetails.harvestTemperature }} °C
          </div>
          <div class="plant-details__data">
            godziny zbioru: {{ plantDetails.harvestStartTime }} -
            {{ plantDetails.harvestEndTime }}
          </div>
        </div>
        <!-- Show specific data if plant origin is 'kupno' -->
        <div
          v-if="plantDetails.plantOrigin === 'kupno'"
          class="plant-details__info"
        >
          <h5 class="plant-details__title">dane zakupu</h5>
          <div class="plant-details__data">
            data zakupu: {{ plantDetails.plantBuyDate }}
          </div>
          <div class="plant-details__data">
            producent: {{ plantDetails.plantProducer }}
          </div>
          <div class="plant-details__data">
            kraj pochodzenia: {{ plantDetails.countryOfOrigin }}
          </div>
        </div>
        <div class="plant-details__info">
          <h5 class="plant-details__title">informacje o surowcu</h5>
          <div class="plant-details__data">
            początkowa ilość: {{ plantDetails.plantWeight }} kg
          </div>
          <div
            class="plant-details__data"
            v-if="plantDetails.plantOrigin === 'kupno'"
          >
            wiek przy zakupie: {{ plantDetails.plantAge }}
            {{ plantAgeWithSuffix(plantDetails.plantAge ?? 0) }}
          </div>
          <div class="plant-details__data">
            stan: {{ plantDetails.plantState }}
          </div>
          <div
            v-if="plantDetails.plantState === 'podsuszony'"
            class="plant-details__data"
          >
            czas podsuszania: {{ plantDetails.dryingTime }} h
          </div>
        </div>
      </div>
      <!-- Button to navigate to the distillation form -->
      <router-link
        :to="{ name: 'AddDistillationPage', params: { id: plantId } }"
        class="plant-details__distill"
        ><base-button class="plant-details__distill-button"
          >Destyluj</base-button
        ></router-link
      >
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";
import { useStore } from "@/store/useStore";
import { useRoute, useRouter } from "vue-router";
import { useApolloClient } from "@vue/apollo-composable";
import { plantAgeWithSuffix } from "@/helpers/displayHelpers.js";
import { normalizeSelectedFields } from "@/helpers/formsNormalize";
import { handleUserError } from "@/helpers/errorHandling";

import DeleteItemModal from "@/components/plant/DeleteItemModal.vue";
import BaseButton from "@/ui/BaseButton.vue";

import { GetPlantById, NormalizedPlantById } from "@/types/forms/plantForm";

import { GET_PLANT_BY_ID } from "@/graphql/queries/plant";
import { DELETE_PLANT } from "@/graphql/mutations/plant";

/**
 * @component PlantDetailsPage
 * @description This component fetches and displays the details of a specific plant, allows for deleting the plant, and navigating to the distillation form.
 * @see fetchPlantDetails
 * @see openDeleteModal
 * @see closeDeleteModal
 * @see deletePlant
 */
export default {
  name: "PlantDetailsPage",
  components: { DeleteItemModal, BaseButton },
  setup() {
    const { resolveClient } = useApolloClient();
    const apolloClient = resolveClient();
    // Vuex store instance
    const store = useStore();

    // Route object to access route params
    const route = useRoute();
    // Router object for navigation
    const router = useRouter();

    // Reactive reference to store the plant ID and plant page number from the route
    const plantId = ref<string | string[]>(route.params.id);
    const page = ref<number>(Number(route.params.page));
    // Reactive reference to store fetched plant details
    const plantDetails = ref<NormalizedPlantById | null>(null);
    // Reactive reference to track if the delete modal is open
    const isModalOpen = ref<boolean>(false);
    // Reactive reference to track loading state
    const isLoading = ref<boolean>(true);

    const fieldsToNormalize: (keyof GetPlantById)[] = [
      "harvestDate",
      "harvestStartTime",
      "harvestEndTime",
      "countryOfOrigin",
      "plantBuyDate",
      "plantProducer",
    ];

    /**
     * @async
     * @function fetchPlantDetails
     * @description Fetches the plant details by plant ID from GraphQL API.
     * @returns {Promise<void>}
     */
    const fetchPlantDetails = async (): Promise<void> => {
      try {
        isLoading.value = true;
        const { data } = await apolloClient.query({
          query: GET_PLANT_BY_ID,
          variables: { id: plantId.value, formatDates: true },
          fetchPolicy: "network-only",
        });
        plantDetails.value = normalizeSelectedFields(
          data.getPlantById,
          fieldsToNormalize
        );
      } catch (error: any) {
        await handleUserError(error);
        plantDetails.value = null;
      } finally {
        isLoading.value = false;
      }
    };

    // Fetch plant details when the component is mounted
    onMounted(() => {
      fetchPlantDetails();
    });

    /**
     * @function openDeleteModal
     * @description Opens the delete confirmation modal.
     */
    const openDeleteModal = (): void => {
      isModalOpen.value = true;
    };

    /**
     * @function closeDeleteModal
     * @description Closes the delete confirmation modal.
     */
    const closeDeleteModal = (): void => {
      isModalOpen.value = false;
    };

    /**
     * @async
     * @function deletePlant
     * @description Deletes the plant by ID and navigates back to the plant list.
     * @returns {Promise<void>}
     */
    const deletePlant = async (): Promise<void> => {
      try {
        const { data } = await apolloClient.mutate({
          mutation: DELETE_PLANT,
          variables: { id: plantId.value },
        });

        if (data.deletePlant) {
          await apolloClient.resetStore();
          router.push({ name: "PlantListPage", params: { page: 1 } });
        }
        closeDeleteModal();
      } catch (error: any) {
        await handleUserError(error);
      }
    };

    return {
      plantDetails,
      isModalOpen,
      isLoading,
      plantId,
      page,
      plantAgeWithSuffix,
      openDeleteModal,
      closeDeleteModal,
      deletePlant,
    };
  },
};
</script>

<style scoped>
:deep(.my-account__card) {
  margin-top: 50px;
}

.plant-details__spinner {
  margin-block: 20px;
}

.plant-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.plant-details__container-one {
  display: flex;
  flex-direction: row;
}

.plant-details__instock {
  width: 20%;
  display: flex;
  justify-content: flex-start;
}

.plant-details__instock-state {
  font-size: 11px;
}

.plant-details__identification {
  width: 60%;
  padding-top: 20px;
}

.plant-details__buttons {
  display: flex;
  flex-direction: row;
  width: 20%;
  font-size: 11px;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 10px;
}

.plant-details__button-edit {
  color: var(--secondary-color);
}

.plant-details__button-edit:hover {
  color: var(--primary-color);
}

.plant-details__button-delete:hover {
  color: red;
}

.plant-details__container-two {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

.plant-details__info {
  width: 50%;
}

.plant-details__title {
  color: var(--secondary-color);
  padding-bottom: 10px;
}

.plant-details__data {
  display: flex;
  justify-content: flex-start;
  font-size: 13px;
  padding-left: 20%;
  padding-right: 10%;
}

.plant-details__distill {
  padding-block: 10px;
}

.plant-details__distill-button:hover {
  color: var(--secondary-color);
}

@media (max-width: 800px) {
  .plant-details__instock {
    flex-direction: column;
  }

  .plant-details__container-two {
    flex-direction: column;
    gap: 30px;
  }

  .plant-details__info {
    width: 100%;
  }
  .plant-details__data {
    padding-left: 0;
    padding-right: 0;
    justify-content: center;
  }
}
</style>
