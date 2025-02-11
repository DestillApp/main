<template>
  <div>
    <!-- List length settings component -->
    <list-length-settings
      class="plant_list--settings"
      title="ilość surowców"
      listColor="plant"
      :chosenLength="plantsPerPage"
      @select-length="handleSelectLength"
    ></list-length-settings>
    <!-- Title for the plant list -->
    <h3 class="plant_list--title">Magazyn surowców</h3>
    <div class="plant_list--sort">
      <!-- Search item component for searching plants by name -->
      <base-search-item
        v-if="plantList.length >= 1"
        label="Szukaj surowca po nazwie"
        inputColor="plant"
        @search="handleSearch"
        @clear="handleSearch"
      ></base-search-item>
      <!-- List sorting component for sorting plants -->
      <list-sorting
       v-if="plantList.length >= 1"
        class="plant_list--sorting"
        :options="options"
        :sorting="sortingOption"
        @choose:sorting="handleSorting"
      ></list-sorting>
    </div>
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
        <div class="plant_containter">
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
              :to="{
                name: 'PlantDetailsPage',
                params: { page: page, id: plant._id },
              }"
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
        </div>
        <router-link
          :to="{ name: 'AddDistillationPage', params: { id: plant._id } }"
          class="plant_distill"
        >
          <base-button>Destyluj</base-button>
        </router-link>
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
import { ref, onBeforeMount, onMounted, watch, computed } from "vue";
import { useApolloClient } from "@vue/apollo-composable";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import { useStore } from "vuex";

import DeleteItemModal from "@/components/plant/DeleteItemModal.vue";
import BaseButton from "@/ui/BaseButton.vue";
import BaseSearchItem from "@/ui/BaseSearchItem.vue";
import ListLengthSettings from "@/components/ListLengthSettings.vue";
import ListSorting from "@/components/ListSorting.vue";
import { scrollToTop } from "@/helpers/displayHelpers";

import { GET_PLANTS } from "@/graphql/queries/plant.js";
import { updateListSorting, updateListSettings } from "@/graphql/mutations/settingsFunctions.js";
import { DELETE_PLANT } from "@/graphql/mutations/plant.js";

/**
 * @component PlantListPage
 * @description This component displays a paginated list of plants and allows deletion of plants.
 * @see fetchPlantList
 * @see deletePlant
 */

export default {
  name: "PlantListPage",
  components: {
    DeleteItemModal,
    BaseButton,
    BaseSearchItem,
    ListLengthSettings,
    ListSorting,
  },
  setup() {
    // Apollo client instance
    const { resolveClient } = useApolloClient();
    const apolloClient = resolveClient();

    // Vuex store instance
    const store = useStore();

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
    const plantsPerPage = computed(
      () => store.getters["settings/settingsForm"].plantListLength
    );

    // Reactive reference for loading state
    const isLoading = ref(true);

    // Computed property for pagination length
    const paginationLength = computed(() => {
      return Math.ceil(plantsAmount.value / plantsPerPage.value);
    });

    // Computed property to get searchQuery from Vuex store
    const searchQuery = computed(() => store.getters.searchQuery);

    const options = ref([
      "nazwy rośliny alfabetycznie",
      "daty dodania",
      "najnowszej daty zbioru i zakupu",
      "najstarszej daty zbioru i zakupu",
    ]);

    const sortingOption = computed(() => {
      const sortingValue =
        store.getters["settings/settingsForm"].plantListSorting;
      if (sortingValue === "plantName") return "nazwy rośliny alfabetycznie";
      if (sortingValue === "createdAt") return "daty dodania";
      if (sortingValue === "oldDate") return "najstarszej daty zbioru i zakupu";
      if (sortingValue === "youngDate")
        return "najnowszej daty zbioru i zakupu";
      return "";
    });

    const sorting = computed(
      () => store.getters["settings/settingsForm"].plantListSorting
    );

    /**
     * @async
     * @function fetchPlantList
     * @description Fetch the list of plants from the GraphQL server.
     * @returns {Promise<void>}
     */
    const fetchPlantList = async (name, sorting) => {
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
            formatDates: true,
            name: name,
            sorting: sorting,
          },
        });
        plantsAmount.value = data.getPlants.length;

        const start = (page.value - 1) * plantsPerPage.value;
        const end = page.value * plantsPerPage.value;

        plantList.value = data.getPlants.slice(start, end);
      } catch (error) {
        if (error.message === "Unauthorized") {
          await store.dispatch("auth/logout");
          router.push("/login");
        }
        console.error("Failed to get plant list:", error);
        plantsAmount.value = null;
        plantList.value = [];
      } finally {
        isLoading.value = false;
      }
    };

    /**
     * @function handleSearch
     * @description Handle the search query emitted from the BaseSearchItem component.
     * @param {String} query - The search query.
     */
    const handleSearch = async () => {
      console.log("Search query from Vuex:", searchQuery.value);
      await fetchPlantList(searchQuery.value, sorting.value);
    };

    /**
     * @function handleSelectLength
     * @description Handle the selection of list length.
     * @param {Number} length - The selected length.
     */
    const handleSelectLength = async (length) => {
      const isUpdating = await updateListSettings(apolloClient, "plantListLength", length);
      if (isUpdating) {
        console.log("Updated plant list length");
        store.dispatch("settings/setValue", {
          input: "plantListLength",
          value: length,
        });
        page.value = 1;
      }
    };

    /**
     * @function handleSorting
     * @description Handle the sorting of the plant list.
     * @param {String} sorting - The sorting option.
     */
    const handleSorting = async (option) => {
      if (option === "nazwy rośliny alfabetycznie") {
        await updateListSorting(apolloClient, "plantListSorting", "plantName");
        store.dispatch("settings/setValue", {
          input: "plantListSorting",
          value: "plantName",
        });
        await fetchPlantList(searchQuery.value, "plantName");
      }
      if (option === "daty dodania") {
        await updateListSorting(apolloClient, "plantListSorting", "createdAt");
        store.dispatch("settings/setValue", {
          input: "plantListSorting",
          value: "createdAt",
        });
        await fetchPlantList(searchQuery.value, "createdAt");
      }
      if (option === "najstarszej daty zbioru i zakupu") {
        await updateListSorting(apolloClient, "plantListSorting", "oldDate");
        store.dispatch("settings/setValue", {
          input: "plantListSorting",
          value: "oldDate",
        });
        await fetchPlantList(searchQuery.value, "oldDate");
      }
      if (option === "najnowszej daty zbioru i zakupu") {
        await updateListSorting(apolloClient, "plantListSorting", "youngDate");
        store.dispatch("settings/setValue", {
          input: "plantListSorting",
          value: "youngDate",
        });
        await fetchPlantList(searchQuery.value, "youngDate");
      }
      page.value = 1;
    };

    onBeforeMount(() => {
      store.dispatch("settings/fetchLocalStorageData", {
        key: "plantListLength",
      });
      store.dispatch("settings/fetchLocalStorageData", {
        key: "plantListSorting",
      });
      store.dispatch("fetchSearchQueryFromLocalStorage");
    });

    // Fetch plant list when the component is mounted
    onMounted(async () => {
        await fetchPlantList(searchQuery.value, sorting.value);
    });

    // Watch for changes in the page number and refetch plant list.
    watch(page, async (newPage) => {
      router.push({ name: "PlantListPage", params: { page: newPage } });
      await fetchPlantList(searchQuery.value, sorting.value);
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
          if (page.value > 1 && !plantList.value.length) {
            console.log("pushing");
            page.value = page.value - 1;
            router.push({
              name: "PlantListPage",
              params: { page: page.value },
            });
          } else {
            await fetchPlantList(searchQuery.value, sorting.value);
            console.log("fetching");
          }
        }
        closeDeleteModal();
      } catch (error) {
        if (error.message === "Unauthorized") {
          await store.dispatch("auth/logout");
          router.push("/login");
        }
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

    // Navigation guard to reset searchQuery in Vuex state and local storage
    onBeforeRouteLeave((to, from, next) => {
      if (to.path !== from.path) {
        store.dispatch("updateSearchQuery", "");
        localStorage.removeItem("searchQuery");
      }
      next();
    });

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
      searchQuery,
      options,
      sortingOption,
      handleSorting,
      handleSelectLength,
      openDeleteModal,
      closeDeleteModal,
      deletePlant,
      handleSearch,
    };
  },
};
</script>

<style scoped>
.plant_list--settings {
  float: right;
}

.plant_list--title {
  margin-bottom: 20px;
}

.plant_list--sort {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.plant_list--sorting {
  width: 300px;
}

.plant_list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.plant {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px 20px;
  border: 2px solid var(--primary-color);
  border-radius: var(--input-border-radius);
}

.plant_containter {
  display: flex;
  flex-direction: row;
}

.plant_data {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 25%;
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
  width: 50%;
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
  width: 25%;
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
