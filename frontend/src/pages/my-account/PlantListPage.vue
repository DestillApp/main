// after deleting changing the amount of the plants (test pagination)
// searching the specific plant (?)
// filter by list length, when plant was added etc.... (?)
// no docs
<template>
  <div>
    <!-- Title for the plant list -->
    <h3 class="plant_list--title">Magazyn surowców</h3>
    <!-- Loading spinner while data is being fetched -->
    <v-progress-circular
      v-if="isLoading"
      color="var(--secondary-color)"
      :size="60"
      :width="6"
      indeterminate
    ></v-progress-circular>
    <!-- Plant list -->
    <ul v-if="!isLoading && plantList.length >= 1" class="plant_list">
      <!-- Iterate through plantList and display each plant's data -->
      <li v-for="plant in plantList" :key="plant._id" class="plant">
        <div class="plant_data">
          <div class="plant_weight">
            <p class="plant_weight_state">na stanie:</p>
            {{ plant.availableWeight }} kg
          </div>
          <div class="plant_date" v-if="plant.harvestDate !== null">
            zbiór: {{ plant.harvestDate }}
          </div>
          <div class="plant_date" v-if="plant.plantBuyDate !== null">
            kupno: {{ plant.plantBuyDate }}
          </div>
        </div>
        <div class="plant_identification">
          <div class="plant_name">{{ plant.plantName }}</div>
          <div class="plant_part">{{ plant.plantPart }}</div>
        </div>
        <div class="plant_buttons">
          <router-link
            :to="{ name: 'PlantDetailsPage', params: { page: page, id: plant._id } }"
            class="plant_button--details"
          >
            <button>Zobacz szczegóły</button>
          </router-link>
          <button
            @click="
              openDeleteModal(plant._id, plant.plantName, plant.plantPart)
            "
            class="plant_button--delete"
          >
            Usuń
          </button>
        </div>
      </li>
    </ul>
    <!-- Delete item modal -->
    <delete-item-modal
      v-if="isModalOpen"
      :plantName="plantName"
      :plantPart="plantPart"
      @close-modal="closeDeleteModal"
      @close-delete-modal="closeDeleteModal"
      @delete-item="deletePlant"
    ></delete-item-modal>
    <!-- Message displayed when no plants are available -->
    <div v-if="!isLoading && plantList.length < 1">magazyn jest pusty...</div>
    <!-- Pagination for navigating plant list -->
    <v-pagination
      v-if="!isLoading && plantsAmount > plantsPerPage"
      v-model="page"
      :length="paginationLength"
      rounded="circle"
      :total-visible="4"
      :active-color="`var(--secondary-color)`"
      class="plant_pagination"
    ></v-pagination>
  </div>
</template>

<script>
import { ref, onMounted, watch, computed } from "vue";
import { useApolloClient } from "@vue/apollo-composable";
import { useRoute, useRouter } from "vue-router";

import DeleteItemModal from "@/components/plant/DeleteItemModal.vue";
import { scrollToTop } from "@/helpers/displayHelpers";

import { GET_PLANTS } from "@/graphql/queries/plant.js";
import { DELETE_PLANT } from "@/graphql/mutations/plant.js";

/**
 * @component PlantListPage
 * @description This component displays a paginated list of plants and allows deletion of plants.
 * @see fetchPlantList
 * @see deletePlant
 */

export default {
  name: "PlantListPage",
  components: { DeleteItemModal },
  setup() {
    // Apollo client instance
    const { resolveClient } = useApolloClient();
    const apolloClient = resolveClient();

    // Route object to access route params
    const route = useRoute();
    // Router object for navigation
    const router = useRouter();

    // Reactive references for plant data
    const plantList = ref([]);
    const selectedPlantId = ref(null);
    const plantName = ref(null);
    const plantPart = ref(null);

    // Reactive reference to track if the delete modal is open
    const isModalOpen = ref(false);

    // Reactive references for pagination
    const plantsAmount = ref(null);
    const page = ref(Number(route.params.page));
    const plantsPerPage = ref(10);

    // Reactive reference for loading state
    const isLoading = ref(true);

    // Computed property for pagination length
    const paginationLength = computed(() => {
      return Math.ceil(plantsAmount.value / plantsPerPage.value);
    });

    /**
     * @async
     * @function fetchPlantList
     * @description Fetch the list of plants from the GraphQL server.
     * @returns {Promise<void>}
     */
    const fetchPlantList = async (name = null) => {
      try {
        isLoading.value = true;
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
          },
          name: name
        });
        plantsAmount.value = data.getPlants.length;

        const start = (page.value - 1) * plantsPerPage.value;
        const end = page.value * plantsPerPage.value;

        plantList.value = data.getPlants.slice(start, end);
      } catch (error) {
        console.error("Failed to get plant list:", error);
        plantsAmount.value = null;
        plantList.value = [];
      } finally {
        isLoading.value = false;
      }
    };

    // Fetch plant list when the component is mounted
    onMounted(() => {
      fetchPlantList();
    });

    // Watch for changes in the page number and refetch plant list.
    watch(page, (newPage) => {
      router.push({ name: "PlantListPage", params: { page: newPage } });
      fetchPlantList();
      scrollToTop();
    });

    /**
     * @function openDeleteModal
     * @description Open the delete modal for a specific plant.
     * @param {String} id - The ID of the plant to delete.
     * @param {String} name - The name of the plant.
     * @param {String} part - The part of the plant.
     */
    const openDeleteModal = (id, name, part) => {
      selectedPlantId.value = id;
      plantName.value = name;
      plantPart.value = part;
      isModalOpen.value = true;
    };

    /**
     * @function closeDeleteModal
     * @description Close the delete modal.
     */
    const closeDeleteModal = () => {
      selectedPlantId.value = null;
      plantName.value = null;
      plantPart.value = null;
      isModalOpen.value = false;
    };

    /**
     * @async
     * @function deletePlant
     * @description Delete the selected plant from the list.
     * @returns {Promise<void>}
     */
    const deletePlant = async () => {
      try {
        const { data } = await apolloClient.mutate({
          mutation: DELETE_PLANT,
          variables: { id: selectedPlantId.value },
        });
        if (data.deletePlant) {
          deletePlantFromList(selectedPlantId.value);
        }
        closeDeleteModal();
      } catch (error) {
        console.error("Failed to delete plant:", error);
      }
    };

    /**
     * @function
     * @description Remove the deleted plant from the plant list.
     * @param {String} id - The ID of the deleted plant.
     */
    const deletePlantFromList = (id) => {
      plantList.value = plantList.value.filter((plant) => plant._id !== id);
    };

    return {
      plantList,
      isModalOpen,
      plantName,
      plantPart,
      plantsAmount,
      page,
      plantsPerPage,
      isLoading,
      paginationLength,
      openDeleteModal,
      closeDeleteModal,
      deletePlant,
    };
  },
};
</script>

<style scoped>
.plant_list--title {
  margin-bottom: 20px;
}

.plant_list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.plant {
  display: flex;
  flex-direction: row;
  padding: 10px 20px;
  border: 2px solid var(--primary-color);
  border-radius: var(--input-border-radius);
}

.plant_data {
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex-grow: 1;
}

.plant_weight {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.plant_weight_state {
  display: flex;
  font-size: 11px;
  justify-content: flex-start;
}

.plant_date {
  display: flex;
  font-size: 11px;
  justify-content: flex-start;
}

.plant_identification {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding-block: 10px;
  flex-grow: 3;
}

.plant_name {
  font-size: 20px;
}

.plant_part {
  font-size: 12px;
}

.plant_buttons {
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: flex-end;
  flex-grow: 1;
  font-size: 11px;
}

.plant_button--details {
  display: flex;
  color: var(--secondary-color);
}

.plant_button--details:hover {
  color: var(--primary-color);
}

.plant_button--delete:hover {
  color: red;
}

.plant_pagination {
  margin-top: 20px;
}
</style>