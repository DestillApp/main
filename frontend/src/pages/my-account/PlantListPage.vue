<template>
  <div>
    <!-- List length settings component -->
    <list-length-settings
      class="plant-list__settings"
      title="ilość surowców"
      listColor="plant"
      :chosenLength="plantsPerPage"
      @select-length="handleSelectLength"
    ></list-length-settings>
    <!-- Title for the plant list -->
    <h3 class="plant-list__title">Magazyn surowców</h3>
    <div class="plant-list__sort">
      <!-- Search item component for searching plants by name -->
      <base-search-item
        v-if="plantList.length >= 1 || isSearching"
        label="Szukaj surowca po nazwie"
        inputColor="plant"
        @search="handleSearch"
        @clear="handleSearch"
      ></base-search-item>
      <!-- List sorting component for sorting plants -->
      <list-sorting
        v-if="plantList.length >= 1 || isSearching"
        class="plant-list__sorting"
        :options="Object.values(options)"
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
    <ul v-if="!isLoading && plantList.length >= 1" class="plant-list__list">
      <!-- Iterate through plantList and display each plant's data -->
      <li v-for="plant in plantList" :key="plant._id" class="plant-list__item">
        <div class="plant-list__container">
          <div class="plant-list__data">
            <!-- Plant available weight -->
            <div class="plant-list__weight">
              <p class="plant-list__weight-state">na stanie:</p>
              {{ plant.availableWeight }} kg
            </div>
            <!-- Plant harvest date -->
            <div class="plant-list__date" v-if="plant.harvestDate !== null">
              <p class="plant-list__date-state">zbiór:</p>
              {{ plant.harvestDate }}
            </div>
            <!-- Plant buy date -->
            <div class="plant-list__date" v-if="plant.plantBuyDate !== null">
              <p class="plant-list__date-state">kupno:</p>
              {{ plant.plantBuyDate }}
            </div>
          </div>
          <!-- Plant identification -->
          <div class="plant-list__identification">
            <div class="plant-list__name">{{ plant.plantName }}</div>
            <div class="plant-list__part">{{ plant.plantPart }}</div>
          </div>
          <div class="plant-list__buttons">
            <!-- Button to view plant details -->
            <router-link
              :to="{
                name: 'PlantDetailsPage',
                params: { page: page, id: plant._id },
              }"
              class="plant-list__button-details"
            >
              <button>Zobacz szczegóły</button>
            </router-link>
            <!-- Button to delete plant -->
            <button
              @click="
                openDeleteModal(plant._id, plant.plantName, plant.plantPart)
              "
              class="plant-list__button-delete"
            >
              Usuń
            </button>
          </div>
        </div>
        <!-- Button to add distillation for this plant -->
        <router-link
          :to="{ name: 'AddDistillationPage', params: { id: plant._id } }"
          class="plant-list__distill"
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
    <div v-if="!isLoading && plantList.length < 1 && !isSearching">
      magazyn jest pusty...
    </div>
    <div v-if="!isLoading && plantList.length < 1 && isSearching">
      brak wyników...
    </div>
    <!-- Pagination for navigating plant list -->
    <v-pagination
      v-if="!isLoading && (plantsAmount ?? 0) > plantsPerPage"
      v-model="page"
      :length="paginationLength"
      rounded="circle"
      :total-visible="4"
      :active-color="`var(--secondary-color)`"
      class="plant-list__pagination"
    ></v-pagination>
  </div>
</template>

<script lang="ts">
import { ref, reactive, onBeforeMount, onMounted, watch, computed } from "vue";
import { useApolloClient } from "@vue/apollo-composable";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import { useStore } from "@/store/useStore";
import DeleteItemModal from "@/components/plant/DeleteItemModal.vue";
import BaseButton from "@/ui/BaseButton.vue";
import BaseSearchItem from "@/ui/BaseSearchItem.vue";
import ListLengthSettings from "@/components/ListLengthSettings.vue";
import ListSorting from "@/components/ListSorting.vue";
import { scrollToTop } from "@/helpers/displayHelpers";
import { GET_PLANTS } from "@/graphql/queries/plant";
import {
  updateListSorting,
  updateListSettings,
} from "@/helpers/settingsFunctions";
import { handleUserError } from "@/helpers/errorHandling";
import { DELETE_PLANT } from "@/graphql/mutations/plant";
import type { BasicPlant } from "@/types/forms/plantForm";

/**
 * @component PlantListPage
 * @description This component displays a paginated, searchable, and sortable list of plants. Allows deletion of plants and manages list settings.
 * @see fetchPlantList
 * @see handleSearch
 * @see handleSelectLength
 * @see handleSorting
 * @see updateSorting
 * @see openDeleteModal
 * @see closeDeleteModal
 * @see deletePlant
 * @see deletePlantFromList
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
    const plantList = ref<BasicPlant[]>([]);
    const selectedPlantId = ref<string>("");
    const plantName = ref<string>("");
    const plantPart = ref<string>("");

    // Modal open state ref
    const isModalOpen = ref<boolean>(false);

    // Pagination state refs
    const plantsAmount = ref<number | null>(null);
    const page = ref<number>(Number(route.params.page));
    // Computed property for number of plants per page from settings
    const plantsPerPage = computed<number>(
      () => store.getters["settings/settingsForm"].plantListLength
    );

    // Loading state ref
    const isLoading = ref<boolean>(true);

    // Computed property for searching state
    const searchQuery = computed<string>(() => store.getters.searchQuery);
    const isSearching = computed<boolean>(() => {
      return searchQuery.value ? true : false;
    });

    // Computed property for pagination length
    const paginationLength = computed<number | undefined>(() => {
      if (plantsAmount.value) {
        return Math.ceil(plantsAmount.value / plantsPerPage.value);
      }
    });

    // Sorting options
    const options = reactive<Record<string, string>>({
      plantName: "nazwy rośliny alfabetycznie",
      createdAt: "daty dodania",
      oldDate: "najstarszej daty zbioru i zakupu",
      youngDate: "najnowszej daty zbioru i zakupu",
    });

    // Computed property for current sorting option label
    const sortingOption = computed<string>(() => {
      const sortingValue =
        store.getters["settings/settingsForm"].plantListSorting;
      return options[sortingValue] || "";
    });

    // Computed property for current sorting key
    const sorting = computed<string>(
      () => store.getters["settings/settingsForm"].plantListSorting
    );

    /**
     * Fetch the list of plants from the GraphQL server.
     * @async
     * @function fetchPlantList
     * @param {string} name - Search query for plant name.
     * @param {string} sorting - Sorting key.
     * @returns {Promise<void>}
     */
    const fetchPlantList = async (
      name: string,
      sorting: string
    ): Promise<void> => {
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
      } catch (error: any) {
        await handleUserError(error);
        plantsAmount.value = null;
        plantList.value = [];
      } finally {
        isLoading.value = false;
      }
    };

    /**
     * Handle the search query emitted from the BaseSearchItem component.
     * @function handleSearch
     */
    const handleSearch = async (): Promise<void> => {
      await fetchPlantList(searchQuery.value, sorting.value);
    };

    /**
     * Handle the selection of list length.
     * @function handleSelectLength
     * @param {number} length - The selected length.
     */
    const handleSelectLength = async (
      length: number
    ): Promise<void | undefined> => {
      const isUpdating = await updateListSettings(
        apolloClient,
        "plantListLength",
        length
      );
      if (isUpdating === "Unauthorized") {
        await store.dispatch("auth/logout");
        router.push("/login");
        return;
      }
      if (isUpdating === true) {
        store.dispatch("settings/setValue", {
          input: "plantListLength",
          value: length,
        });
        page.value = 1;
      }
    };

    /**
     * Handle the sorting of the items list.
     * @function handleSorting
     * @param {string} option - The sorting option.
     */
    const handleSorting = async (option: string): Promise<void> => {
      const sortingKey = Object.keys(options).find(
        (key) => options[key] === option
      );
      if (sortingKey) {
        await updateSorting(sortingKey, sortingKey);
        page.value = 1;
      }
    };

    /**
     * Update the sorting option and fetch the plant list.
     * @function updateSorting
     * @param {string} sortingKey - The sorting key.
     * @param {string} sortingValue - The sorting value.
     */
    const updateSorting = async (
      sortingKey: string,
      sortingValue: string
    ): Promise<void | undefined> => {
      const update = await updateListSorting(
        apolloClient,
        "plantListSorting",
        sortingKey
      );
      if (update === "Unauthorized") {
        await store.dispatch("auth/logout");
        router.push("/login");
        return;
      } else {
        store.dispatch("settings/setValue", {
          input: "plantListSorting",
          value: sortingKey,
        });
        await fetchPlantList(searchQuery.value, sortingValue);
      }
    };

    // Fetch settings and search query from local storage before mount
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
     * Open the delete modal for a specific plant.
     * @function openDeleteModal
     * @param {string} id - The ID of the plant to delete.
     * @param {string} name - The name of the plant.
     * @param {string} part - The part of the plant.
     */
    const openDeleteModal = (id: string, name: string, part: string): void => {
      selectedPlantId.value = id;
      plantName.value = name;
      plantPart.value = part;
      isModalOpen.value = true;
    };

    /**
     * Close the delete modal.
     * @function closeDeleteModal
     */
    const closeDeleteModal = (): void => {
      selectedPlantId.value = "";
      plantName.value = "";
      plantPart.value = "";
      isModalOpen.value = false;
    };

    /**
     * Delete the selected plant from the list.
     * @async
     * @function deletePlant
     * @returns {Promise<void>}
     */
    const deletePlant = async (): Promise<void> => {
      try {
        const { data } = await apolloClient.mutate({
          mutation: DELETE_PLANT,
          variables: { id: selectedPlantId.value },
        });
        if (data.deletePlant) {
          deletePlantFromList(selectedPlantId.value);
          if (page.value > 1 && !plantList.value.length) {
            page.value = page.value - 1;
            router.push({
              name: "PlantListPage",
              params: { page: page.value },
            });
          } else {
            await fetchPlantList(searchQuery.value, sorting.value);
          }
        }
        closeDeleteModal();
      } catch (error: any) {
        await handleUserError(error);
      }
    };

    /**
     * Remove the deleted plant from the plant list.
     * @function deletePlantFromList
     * @param {string} id - The ID of the deleted plant.
     */
    const deletePlantFromList = (id: string): void => {
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
      isSearching,
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
.plant-list__settings {
  float: right;
}

.plant-list__title {
  margin-bottom: 20px;
}

.plant-list__sort {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
}

.plant-list__sorting {
  width: 300px;
}

.plant-list__list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.plant-list__item {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px 20px;
  border: 2px solid var(--primary-color);
  border-radius: var(--input-border-radius);
}

.plant-list__container {
  display: flex;
  flex-direction: row;
}

.plant-list__data {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 25%;
}

.plant-list__weight {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.plant-list__weight-state {
  display: flex;
  font-size: 11px;
  justify-content: flex-start;
}

.plant-list__date {
  display: flex;
  font-size: 11px;
  justify-content: flex-start;
}

.plant-list__date-state {
  margin-right: 5px;
}

.plant-list__identification {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding-block: 10px;
  width: 50%;
}

.plant-list__name {
  font-size: 20px;
}

.plant-list__part {
  font-size: 12px;
}

.plant-list__buttons {
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: flex-end;
  width: 25%;
  font-size: 11px;
}

.plant-list__button-details {
  display: flex;
  color: var(--secondary-color);
}

.plant-list__button-details:hover {
  color: var(--primary-color);
}

.plant-list__button-delete:hover {
  color: red;
}

.plant-list__pagination {
  margin-top: 20px;
}

@media (max-width: 900px) {
  .plant-list__sort {
    flex-direction: column;
    gap: 20px;
  }

  .plant-list__sorting {
    width: 260px;
  }
}

@media (max-width: 600px) {
  .plant-list__item {
    flex-direction: column;
    padding: 10px;
    border: 1px solid var(--primary-color);
  }

  .plant-list__container {
    flex-direction: column-reverse;
    gap: 10px;
  }

  .plant-list__buttons {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 10px;
  }

  .plant-list__button-details,
  .plant-list__button-delete {
    flex: 1;
    text-align: center;
  }

  .plant-list__button-details {
    margin-left: 10px;
  }

  .plant-list__button-delete {
    margin-right: 10px;
    text-align: right;
  }

  .plant-list__data {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-inline: 20px;
    gap: 10px;
    width: 100%;
  }

  .plant-list__identification {
    width: 100%;
  }

  .plant-list__weight,
  .plant-list__date {
    flex: 1;
    text-align: left;
  }

  .plant-list__date {
    flex-direction: column;
    gap: 6px;
    text-align: right;
  }

  .plant-list__date-state {
    margin-right: 0px;
  }

  .plant-list__weight-state {
    font-size: 11px;
  }
}
</style>
