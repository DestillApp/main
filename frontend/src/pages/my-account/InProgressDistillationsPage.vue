<template>
  <div>
    <!-- List length settings component -->
    <list-length-settings
      class="distillation__settings"
      title="ilość destylacji"
      listColor="distillation"
      :chosenLength="distillationsPerPage"
      @select-length="handleSelectLength"
    ></list-length-settings>
    <!-- Title for the distillation list -->
    <h3 class="distillation__title">Destylacje w toku</h3>
    <div class="distillation__sort">
      <!-- Search item component for searching distillations by name -->
      <base-search-item
        v-if="distillationsList.length >= 1 || isSearching"
        label="Szukaj destylacji po nazwie rośliny"
        inputColor="distillation"
        @search="handleSearch"
        @clear="handleSearch"
      ></base-search-item>
      <!-- List sorting component for sorting distillations -->
      <list-sorting
        v-if="distillationsList.length >= 1 || isSearching"
        class="distillation__sorting"
        :options="Object.values(options)"
        :sorting="sortingOption"
        @choose:sorting="handleSorting"
      ></list-sorting>
    </div>
    <!-- Loading spinner while data is being fetched -->
    <v-progress-circular
      v-if="isLoading"
      color="var(--secondary-color-distillation)"
      :size="60"
      :width="6"
      indeterminate
    ></v-progress-circular>
    <!-- Distillation list -->
    <ul
      v-if="!isLoading && distillationsList.length >= 1"
      class="distillation__list"
    >
      <!-- Iterate through distillationList and display each distillation's data -->
      <li
        v-for="distillation in distillationsList"
        :key="distillation._id"
        class="distillation__item"
      >
        <div class="distillation__container">
          <div class="distillation__data">
            <!-- Distillation type -->
            <div class="distillation__type">
              <p class="distillation__type-state">typ destylacji:</p>
              {{ distillation.distillationType }}
            </div>
            <!-- Distillation date -->
            <div class="distillation__date">
              <p class="distillation__date-state">data destylacji:</p>
              {{ distillation.distillationDate }}
            </div>
          </div>
          <!-- Plant identification -->
          <div class="distillation__plant-identification">
            <div class="distillation__plant-name">
              {{ distillation.choosedPlant.name }}
            </div>
            <div class="distillation__plant-part">
              {{ distillation.choosedPlant.part }}
            </div>
          </div>
          <div class="distillation__buttons">
            <!-- Button to view distillation details -->
            <router-link
              :to="{
                name: 'DistillationDetailsPage',
                params: { page: page, distillId: distillation._id },
              }"
              class="distillation__button-details"
            >
              <button>Zobacz szczegóły</button>
            </router-link>
            <!-- Button to delete distillation -->
            <button
              @click="
                openDeleteModal(
                  distillation._id,
                  distillation.choosedPlant.id,
                  distillation.choosedPlant.name,
                  distillation.choosedPlant.part,
                  distillation.weightForDistillation,
                  distillation.distillationDate
                )
              "
              class="distillation__button-delete"
            >
              Usuń
            </button>
          </div>
        </div>
        <!-- Button to add distillation results -->
        <router-link
          :to="{
            name: 'AddResultsPage',
            params: { distillId: distillation._id },
          }"
          class="distillation__button-results"
        >
          <base-button>Dodaj wyniki</base-button>
        </router-link>
      </li>
    </ul>
    <!-- Delete distillation modal -->
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
    <!-- Message displayed when no plants are available -->
    <div v-if="!isLoading && distillationsList.length < 1 && !isSearching">
      brak destylacji w toku...
    </div>
    <div v-if="!isLoading && distillationsList.length < 1 && isSearching">
      brak wyników...
    </div>
    <!-- Pagination for navigating distillation list -->
    <v-pagination
      v-if="!isLoading && (distillationsAmount ?? 0) > distillationsPerPage"
      v-model="page"
      :length="paginationLength"
      rounded="circle"
      :total-visible="4"
      :active-color="`var(--secondary-color-distillation)`"
      class="distillation__pagination"
    ></v-pagination>
  </div>
</template>

<script lang="ts">
import { ref, reactive, computed, onBeforeMount, onMounted, watch } from "vue";
import { useApolloClient } from "@vue/apollo-composable";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import { useStore } from "@/store/useStore";
import DeleteItemModal from "@/components/plant/DeleteItemModal.vue";
import BaseButton from "@/ui/BaseButton.vue";
import BaseSearchItem from "@/ui/BaseSearchItem.vue";
import ListLengthSettings from "@/components/ListLengthSettings.vue";
import ListSorting from "@/components/ListSorting.vue";
import { scrollToTop } from "@/helpers/displayHelpers";
import { handleUserError } from "@/helpers/errorHandling";
import {
  updateListSorting,
  updateListSettings,
} from "@/helpers/settingsFunctions";
import { GET_DISTILLATIONS } from "@/graphql/queries/distillation";
import { DELETE_DISTILLATION } from "@/graphql/mutations/distillation";
import { CHANGE_AVAILABLE_WEIGHT } from "@/graphql/mutations/plant";
import type { GetDistillationById } from "@/types/forms/distillationForm";

/**
 * @component InProgressDistillationsPage
 * @description Displays a paginated, searchable, and sortable list of in-progress distillations. Allows deletion of distillations and manages list settings.
 * @see fetchDistillationList
 * @see handleSearch
 * @see handleSelectLength
 * @see updateSorting
 * @see handleSorting
 * @see openDeleteModal
 * @see closeDeleteModal
 * @see deleteDistillation
 * @see closeAskModal
 * @see addPlantWeight
 * @see handleYes
 */

export default {
  name: "InProgressDistillationsPage",
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

    // Route and router objects
    const route = useRoute();
    const router = useRouter();

    // Reactive references for distillation data
    const distillationsList = ref<GetDistillationById[]>([]);
    const selectedDistillationId = ref<string>("");
    const selectedPlantId = ref<string>("");
    const plantName = ref<string>("");
    const plantPart = ref<string>("");
    const distillationWeight = ref<number | null>(null);
    const distillationDate = ref<string>("");

    // Modal open state refs
    const isModalOpen = ref<boolean>(false);
    const isAskModalOpen = ref<boolean>(false);

    // Pagination state refs
    const distillationsAmount = ref<number | null>(null);
    const page = ref<number>(Number(route.params.page));
    // Computed property for number of distillations per page from settings
    const distillationsPerPage = computed<number>(
      () => store.getters["settings/settingsForm"].distillationListLength
    );

    // Loading state ref
    const isLoading = ref<boolean>(true);

    // Computed property for searching state
    const searchQuery = computed<string>(() => store.getters.searchQuery);
    const isSearching = computed<boolean>(() => {
      return searchQuery.value ? true : false;
    });

    // Computed property for pagination length
    const paginationLength = computed<number>(() => {
      return Math.ceil(
        (distillationsAmount.value ?? 0) / distillationsPerPage.value
      );
    });

    // Sorting options
    const options = reactive<Record<string, string>>({
      plantName: "nazwy rośliny alfabetycznie",
      createdAt: "daty dodania destylacji",
      youngDate: "najnowszej daty destylacji",
      oldDate: "najstarszej daty destylacji",
    });

    // Computed property for current sorting option label
    const sortingOption = computed<string>(() => {
      const sortingValue =
        store.getters["settings/settingsForm"].distillationListSorting;
      return options[sortingValue] || "";
    });

    // Computed property for current sorting key
    const sorting = computed<string>(
      () => store.getters["settings/settingsForm"].distillationListSorting
    );

    /**
     * Fetch the list of distillations from the GraphQL server.
     * @async
     * @function fetchDistillationList
     * @param {string} name - Search query for plant name.
     * @param {string} sorting - Sorting key.
     * @returns {Promise<void>}
     */
    const fetchDistillationList = async (
      name: string,
      sorting: string
    ): Promise<void> => {
      try {
        isLoading.value = true;
        const { data } = await apolloClient.query({
          query: GET_DISTILLATIONS,
          fetchPolicy: "network-only",
          variables: {
            fields: [
              "choosedPlant.id",
              "choosedPlant.name",
              "choosedPlant.part",
              "weightForDistillation",
              "distillationType",
              "distillationDate",
              "_id",
            ],
            name: name,
            sorting: sorting,
            page: page.value,
            limit: distillationsPerPage.value,
          },
        });
        distillationsAmount.value = data.getDistillations.length;

        const start = (page.value - 1) * distillationsPerPage.value;
        const end = page.value * distillationsPerPage.value;

        distillationsList.value = data.getDistillations.slice(start, end);
      } catch (error: any) {
        await handleUserError(error);
        distillationsAmount.value = null;
        distillationsList.value = [];
      } finally {
        isLoading.value = false;
      }
    };

    /**
     * Handle the search query emitted from the BaseSearchItem component.
     * @function handleSearch
     */
    const handleSearch = async (): Promise<void> => {
      await fetchDistillationList(searchQuery.value, sorting.value);
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
        "distillationListLength",
        length
      );
      if (isUpdating === "Unauthorized") {
        await store.dispatch("auth/logout");
        router.push("/login");
        return;
      }
      if (isUpdating === true) {
        store.dispatch("settings/setValue", {
          input: "distillationListLength",
          value: length,
        });
        page.value = 1;
      }
    };

    /**
     * Update the sorting option and fetch the distillation list.
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
        "distillationListSorting",
        sortingKey
      );
      if (update === "Unauthorized") {
        await store.dispatch("auth/logout");
        router.push("/login");
        return;
      } else {
        store.dispatch("settings/setValue", {
          input: "distillationListSorting",
          value: sortingKey,
        });
        await fetchDistillationList(searchQuery.value, sortingValue);
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

    // Fetch settings and search query from local storage before mount
    onBeforeMount(() => {
      store.dispatch("settings/fetchLocalStorageData", {
        key: "distillationListLength",
      });
      store.dispatch("settings/fetchLocalStorageData", {
        key: "distillationListSorting",
      });
      store.dispatch("fetchSearchQueryFromLocalStorage");
    });

    // Fetch distillation list when the component is mounted
    onMounted(async () => {
      await fetchDistillationList(searchQuery.value, sorting.value);
    });

    // Watch for changes in the page number and refetch distillation list.
    watch(page, async (newPage) => {
      router.push({
        name: "InProgressDistillationsPage",
        params: { page: newPage },
      });
      await fetchDistillationList(searchQuery.value, sorting.value);
      scrollToTop();
    });

    /**
     * Open the delete modal for a specific distillation.
     * @function openDeleteModal
     * @param {string} id - The ID of the distillation to delete.
     * @param {string} plantId - The ID of the plant.
     * @param {string} name - The name of the plant.
     * @param {string} part - The part of the plant.
     * @param {number} dWeight - The weight of the distillation.
     * @param {string} date - Distillation date.
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
     * Close the delete modal.
     * @function closeDeleteModal
     */
    const closeDeleteModal = (): void => {
      distillationDate.value = "";
      isModalOpen.value = false;
    };

    /**
     * Remove the deleted distillation from the list.
     * @function deleteDistillationFromList
     * @param {string} id - The ID of the deleted distillation.
     */
    const deleteDistillationFromList = (id: string): void => {
      distillationsList.value = distillationsList.value.filter(
        (plant) => plant._id !== id
      );
    };

    // Open the ask modal for restoring plant weight
    const openAskModal = (): void => {
      isAskModalOpen.value = true;
    };

    /**
     * Delete the selected distillation from the list.
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
          deleteDistillationFromList(selectedDistillationId.value);
          if (page.value > 1 && !distillationsList.value.length) {
            page.value = page.value - 1;
            router.push({
              name: "InProgressDistillationsPage",
              params: { page: page.value },
            });
          } else {
            await fetchDistillationList(searchQuery.value, sorting.value);
          }
        }
        closeDeleteModal();
      } catch (error: any) {
        await handleUserError(error);
      }
    };

    // Close the ask modal and reset related state
    const closeAskModal = (): void => {
      isAskModalOpen.value = false;
      selectedDistillationId.value = "";
      selectedPlantId.value = "";
      distillationWeight.value = null;
      plantName.value = "";
      plantPart.value = "";
    };

    /**
     * Add the distillation weight back to the plant's available weight.
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

    // Navigation guard to reset searchQuery in Vuex state and local storage
    onBeforeRouteLeave((to, from, next) => {
      if (to.path !== from.path) {
        store.dispatch("updateSearchQuery", "");
        localStorage.removeItem("searchQuery");
      }
      next();
    });

    return {
      distillationsList,
      isLoading,
      isSearching,
      isModalOpen,
      isAskModalOpen,
      plantName,
      plantPart,
      distillationDate,
      distillationsAmount,
      distillationWeight,
      page,
      distillationsPerPage,
      paginationLength,
      searchQuery,
      options,
      sortingOption,
      openDeleteModal,
      closeDeleteModal,
      closeAskModal,
      deleteDistillation,
      handleYes,
      handleSorting,
      handleSearch,
      handleSelectLength,
    };
  },
};
</script>

<style scoped>
.distillation__settings {
  float: right;
}

.distillation__title {
  margin-bottom: 20px;
}

.distillation__sort {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
}

.distillation__sorting {
  width: 300px;
}

.distillation__list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.distillation__item {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px 20px;
  border: 2px solid var(--primary-color-distillation);
  border-radius: var(--input-border-radius);
}

.distillation__container {
  display: flex;
  flex-direction: row;
}

.distillation__data {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 25%;
}

.distillation__type {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.distillation__type-state {
  display: flex;
  font-size: 11px;
  justify-content: flex-start;
}

.distillation__date {
  display: flex;
  flex-direction: column;
  font-size: 11px;
  gap: 6px;
  justify-content: flex-start;
}

.distillation__date-state {
  margin-right: 5px;
}

.distillation__plant-identification {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding-block: 10px;
  width: 100%;
}

.distillation__plant-name {
  font-size: 20px;
}

.distillation__plant-part {
  font-size: 12px;
}

.distillation__buttons {
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: flex-end;
  width: 25%;
  font-size: 11px;
}

.distillation__button-details {
  display: flex;
  color: var(--secondary-color-distillation);
}

.distillation__button-details:hover {
  color: var(--primary-color-distillation);
}

.distillation__button-delete:hover {
  color: red;
}

.distillation__pagination {
  margin-top: 20px;
}

@media (max-width: 900px) {
  .distillation__sort {
    flex-direction: column;
    gap: 20px;
  }

  .distillation__sorting {
    width: 250px;
  }
}

@media (max-width: 600px) {
  .distillation__item {
    flex-direction: column;
    padding: 10px;
    border: 1px solid var(--primary-color-distillation);
  }

  .distillation__container {
    flex-direction: column-reverse;
    gap: 10px;
  }

  .distillation__buttons {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 10px;
  }

  .distillation__button-details,
  .distillation__button-delete {
    flex: 1;
    text-align: center;
  }

  .distillation__button-details {
    margin-left: 10px;
  }

  .distillation__button-delete {
    margin-right: 10px;
    text-align: right;
  }

  .distillation__data {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-inline: 20px;
    gap: 10px;
    width: 100%;
  }

  .distillation__identification {
    width: 100%;
  }

  .distillation__type,
  .distillation__date {
    flex: 1;
    text-align: left;
  }

  .distillation__date {
    text-align: right;
  }

  .distillation__date-state {
    margin-right: 0px;
  }

  .distillation__type-state {
    font-size: 11px;
  }
}
</style>
