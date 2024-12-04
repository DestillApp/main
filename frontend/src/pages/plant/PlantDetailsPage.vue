// no docs 
// redirecting to the previous plant list page (now it is 1)
// miesiąc, miesiące, miesięcy - problem with this value, not displaying
<template>
  <div>
    <!-- Spinner that shows when data is loading -->
    <v-progress-circular v-if="isLoading" class="spinner" color="var(--secondary-color)" :size="60" :width="6"
      indeterminate></v-progress-circular>
    <!-- Display plant details once data is loaded and no longer loading -->
    <div v-if="plantDetails && !isLoading" class="plant">
      <div class="plant_container--one">
        <!-- Display available stock -->
        <div class="plant_instock">
          <p class="plant_instock--state">na stanie:</p>
          <br />{{ plantDetails.availableWeight }} kg
        </div>
        <!-- Display plant identification information -->
        <div class="plant_identification">
          <h3>{{ plantDetails.plantName }}</h3>
          <div>{{ plantDetails.plantPart }}</div>
        </div>
        <!-- Edit and delete buttons for the plant -->
        <div class="plant_buttons">
          <router-link :to="{ name: 'EditPlantPage', params: { page: page, id: plantId } }"><button
              class="plant_button--edit">Edytuj</button></router-link>
          <button class="plant_button--delete" @click="openDeleteModal">
            Usuń
          </button>
          <!-- Modal for deleting the plant -->
          <delete-item-modal v-if="isModalOpen" :plantName="plantDetails.plantName" :plantPart="plantDetails.plantPart"
            @close-modal="closeDeleteModal" @close-delete-modal="closeDeleteModal"
            @delete-item="deletePlant"></delete-item-modal>
        </div>
      </div>
      <!-- Display additional plant data -->
      <div class="plant_container--two">
        <!-- Show specific data if plant origin is 'zbiór' -->
        <div v-if="plantDetails.plantOrigin === 'zbiór'" class="plant_info">
          <h5 class="plant_title">warunki zbioru</h5>
          <div class="plant_data">
            data zbioru: {{ plantDetails.harvestDate }}
          </div>
          <div class="plant_data">
            temperatura: {{ plantDetails.harvestTemperature }} °C
          </div>
          <div class="plant_data">
            godziny zbioru: {{ plantDetails.harvestStartTime }} -
            {{ plantDetails.harvestEndTime }}
          </div>
        </div>
        <!-- Show specific data if plant origin is 'kupno' -->
        <div v-if="plantDetails.plantOrigin === 'kupno'" class="plant_info">
          <h5 class="plant_title">dane zakupu</h5>
          <div class="plant_data">
            data zakupu: {{ plantDetails.plantBuyDate }}
          </div>
          <div class="plant_data">
            producent: {{ plantDetails.plantProducer }}
          </div>
          <div class="plant_data">
            kraj pochodzenia: {{ plantDetails.countryOfOrigin }}
          </div>
        </div>
        <div class="plant_info">
          <h5 class="plant_title">informacje o surowcu</h5>
          <div class="plant_data">
            początkowa ilość: {{ plantDetails.plantWeight }} kg
          </div>
          <div class="plant_data" v-if="plantDetails.plantOrigin === 'kupno'">
            wiek przy zakupie: {{ plantDetails.plantAge }} miesięcy
          </div>
          <div class="plant_data">stan: {{ plantDetails.plantState }}</div>
          <div v-if="plantDetails.plantState === 'podsuszony'" class="plant_data">
            czas podsuszania: {{ plantDetails.dryingTime }} h
          </div>
        </div>
      </div>
      <!-- Button to navigate to the distillation form -->
      <router-link :to="{ name: 'AddDistillationPage', params: { id: plantId } }" class="plant_distill"><base-button
          class="distill_button">Destyluj</base-button></router-link>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useApolloClient } from "@vue/apollo-composable";

import DeleteItemModal from "@/components/plant/DeleteItemModal.vue";
import BaseButton from "@/ui/BaseButton.vue";

import { GET_PLANT_BY_ID } from "@/graphql/queries/plant.js";
import { DELETE_PLANT } from "@/graphql/mutations/plant.js";

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

    // Route object to access route params
    const route = useRoute();
    // Router object for navigation
    const router = useRouter();

    // Reactive reference to store the plant ID and plant page number from the route
    const plantId = ref(route.params.id);
    const page = ref(Number(route.params.page));
    // Reactive reference to store fetched plant details
    const plantDetails = ref(null);
    // Reactive reference to track if the delete modal is open
    const isModalOpen = ref(false);
    // Reactive reference to track loading state
    const isLoading = ref(true);

    /**
     * @async
     * @function fetchPlantDetails
     * @description Fetches the plant details by plant ID from GraphQL API.
     * @returns {Promise<void>}
     */
    const fetchPlantDetails = async () => {
      try {
        isLoading.value = true;
        const { data } = await apolloClient.query({
          query: GET_PLANT_BY_ID,
          variables: { id: plantId.value, formatDates: true },
          fetchPolicy: "network-only",
        });
        plantDetails.value = data.getPlantById;
        console.log(plantDetails.value, plantDetails.value.plantName);
      } catch (error) {
        console.error("Failed to get plant details:", error);
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
    const openDeleteModal = () => {
      isModalOpen.value = true;
    };

    /**
     * @function closeDeleteModal
     * @description Closes the delete confirmation modal.
     */
    const closeDeleteModal = () => {
      isModalOpen.value = false;
    };

    /**
     * @async
     * @function deletePlant
     * @description Deletes the plant by ID and navigates back to the plant list.
     * @returns {Promise<void>}
     */
    const deletePlant = async () => {
      try {
        const { data } = await apolloClient.mutate({
          mutation: DELETE_PLANT,
          variables: { id: plantId.value },
        });
        console.log(data.deletePlant);
        if (data.deletePlant) {
          await apolloClient.resetStore();
          router.push({ name: "PlantListPage", params: { page: 1 } });
        }
        closeDeleteModal();
      } catch (error) {
        console.error("Failed to delete plant:", error);
      }
    };

    return {
      plantDetails,
      isModalOpen,
      isLoading,
      plantId,
      page,
      openDeleteModal,
      closeDeleteModal,
      deletePlant,
    };
  },
};
</script>

<style scoped>
.spinner {
  margin-block: 20px;
}

.plant {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.plant_container--one {
  display: flex;
  flex-direction: row;
}

.plant_instock {
  width: 20%;
  display: flex;
  justify-content: flex-start;
}

.plant_instock--state {
  font-size: 11px;
}

.plant_identification {
  width: 60%;
  padding-top: 20px;
}

.plant_buttons {
  display: flex;
  flex-direction: row;
  width: 20%;
  font-size: 11px;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 10px;
}

.plant_button--edit {
  color: var(--secondary-color);
}

.plant_button--edit:hover {
  color: var(--primary-color);
}

.plant_button--delete:hover {
  color: red;
}

.plant_container--two {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

.plant_info {
  width: 50%;
}

.plant_title {
  color: var(--secondary-color);
  padding-bottom: 10px;
}

.plant_data {
  display: flex;
  justify-content: flex-start;
  font-size: 13px;
  padding-left: 20%;
  padding-right: 10%;
}

.plant_distill {
  padding-block: 10px;
}

.distill_button:hover {
  color: var(--secondary-color);
}
</style>
