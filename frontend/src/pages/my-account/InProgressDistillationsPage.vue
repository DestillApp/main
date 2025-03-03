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
        :options="options"
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
        :key="distillation.id"
        class="distillation__item"
      >
        <div class="distillation__container">
          <div class="distillation__data">
            <div class="distillation__type">
              <p class="distillation__type-state">typ destylacji:</p>
              {{ distillation.distillationType }}
            </div>
            <div class="distillation__date">
              data destylacji: {{ distillation.distillationDate }}
            </div>
          </div>
          <div class="distillation__plant-identification">
            <div class="distillation__plant-name">
              {{ distillation.choosedPlant.name }}
            </div>
            <div class="distillation__plant-part">
              {{ distillation.choosedPlant.part }}
            </div>
          </div>
          <div class="distillation__buttons">
            <router-link
              :to="{
                name: 'DistillationDetailsPage',
                params: { page: page, distillId: distillation._id },
              }"
              class="distillation__button-details"
            >
              <button>Zobacz szczegóły</button>
            </router-link>
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
      v-if="!isLoading && distillationsAmount > distillationsPerPage"
      v-model="page"
      :length="paginationLength"
      rounded="circle"
      :total-visible="4"
      :active-color="`var(--secondary-color-distillation)`"
      class="distillation__pagination"
    ></v-pagination>
  </div>
</template>

<script>
import { ref, computed, onBeforeMount, onMounted, watch } from "vue";
import { useApolloClient } from "@vue/apollo-composable";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import { useStore } from "vuex";

import DeleteItemModal from "@/components/plant/DeleteItemModal.vue";
import BaseButton from "@/ui/BaseButton.vue";
import BaseSearchItem from "@/ui/BaseSearchItem.vue";
import ListLengthSettings from "@/components/ListLengthSettings.vue";
import ListSorting from "@/components/ListSorting.vue";

import {
  updateListSorting,
  updateListSettings,
} from "@/graphql/mutations/settingsFunctions.js";
import { scrollToTop } from "@/helpers/displayHelpers";

import { GET_DISTILLATIONS } from "@/graphql/queries/distillation";
import { DELETE_DISTILLATION } from "@/graphql/mutations/distillation";
import { CHANGE_AVAILABLE_WEIGHT } from "@/graphql/mutations/plant";

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

    // Route object to access route params
    const route = useRoute();
    const router = useRouter();

    // Reactive references for distillation data
    const distillationsList = ref([]);
    const selectedDistillationId = ref(null);
    const selectedPlantId = ref(null);
    const plantName = ref(null);
    const plantPart = ref(null);
    const distillationWeight = ref(null);
    const distillationDate = ref(null);

    // Reactive reference to track if the delete modal is open
    const isModalOpen = ref(false);
    const isAskModalOpen = ref(false);

    const distillationsAmount = ref(null);
    const page = ref(Number(route.params.page));
    const distillationsPerPage = computed(
      () => store.getters["settings/settingsForm"].distillationListLength
    );

    // Reactive reference for loading state
    const isLoading = ref(true);

    // Reactive reference for searching state
    const isSearching = computed(() => {
      return searchQuery.value ? true : false;
    });

    // Computed property for pagination length
    const paginationLength = computed(() => {
      return Math.ceil(distillationsAmount.value / distillationsPerPage.value);
    });

    // Computed property to get searchQuery from Vuex store
    const searchQuery = computed(() => store.getters.searchQuery);

    const options = ref([
      "nazwy rośliny alfabetycznie",
      "daty dodania destylacji",
      "najnowszej daty destylacji",
      "najstarszej daty destylacji",
    ]);

    const sortingOption = computed(() => {
      const sortingValue =
        store.getters["settings/settingsForm"].distillationListSorting;
      if (sortingValue === "plantName") return "nazwy rośliny alfabetycznie";
      if (sortingValue === "createdAt") return "daty dodania destylacji";
      if (sortingValue === "oldDate") return "najstarszej daty destylacji";
      if (sortingValue === "youngDate") return "najnowszej daty destylacji";
      return "";
    });

    const sorting = computed(
      () => store.getters["settings/settingsForm"].distillationListSorting
    );

    /**
     * @async
     * @function fetchDistillationList
     * @description Fetch the list of distillations from the GraphQL server.
     * @returns {Promise<void>}
     */
    const fetchDistillationList = async (name, sorting) => {
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
      } catch (error) {
        if (error.message === "Unauthorized") {
          await store.dispatch("auth/logout");
          router.push("/login");
        }
        console.error("Failed to get plant list:", error);
        distillationsAmount.value = null;
        distillationsList.value = [];
      } finally {
        isLoading.value = false;
      }
    };

    const handleSearch = async () => {
      await fetchDistillationList(searchQuery.value, sorting.value);
    };

    /**
     * @function handleSelectLength
     * @description Handle the selection of list length.
     * @param {Number} length - The selected length.
     */
    const handleSelectLength = async (length) => {
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
        console.log("Updated distillation list length");
        store.dispatch("settings/setValue", {
          input: "distillationListLength",
          value: length,
        });
        page.value = 1;
      }
    };

    /**
     * @function updateSorting
     * @description Update the sorting option and fetch the distillation list.
     * @param {String} sortingKey - The sorting key.
     * @param {String} sortingValue - The sorting value.
     */
    const updateSorting = async (sortingKey, sortingValue) => {
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
     * @function handleSorting
     * @description Handle the sorting of the distillation list.
     * @param {String} sorting - The sorting option.
     */
    const handleSorting = async (option) => {
      if (option === "nazwy rośliny alfabetycznie") {
        await updateSorting("plantName", "plantName");
      }
      if (option === "daty dodania destylacji") {
        await updateSorting("createdAt", "createdAt");
      }
      if (option === "najstarszej daty destylacji") {
        await updateSorting("oldDate", "oldDate");
      }
      if (option === "najnowszej daty destylacji") {
        await updateSorting("youngDate", "youngDate");
      }
      page.value = 1;
    };

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

    // Watch for changes in the page number and refetch plant list.
    watch(page, async (newPage) => {
      console.log("Changing page!");
      router.push({
        name: "InProgressDistillationsPage",
        params: { page: newPage },
      });
      await fetchDistillationList(searchQuery.value, sorting.value);
      scrollToTop();
    });

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
     * @function
     * @description Remove the deleted plant from the plant list.
     * @param {String} id - The ID of the deleted plant.
     */
    const deleteDistillationFromList = (id) => {
      distillationsList.value = distillationsList.value.filter(
        (plant) => plant._id !== id
      );
    };

    const openAskModal = () => {
      isAskModalOpen.value = true;
    };

    /**
     * @async
     * @function deleteDistillation
     * @description Delete the selected distillation from the list.
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
      } catch (error) {
        if (error.message === "Unauthorized") {
          await store.dispatch("auth/logout");
          router.push("/login");
        }
        console.error("Failed to delete plant:", error);
      }
    };

    const closeAskModal = () => {
      isAskModalOpen.value = false;
      selectedDistillationId.value = null;
      selectedPlantId.value = null;
      distillationWeight.value = null;
      plantName.value = null;
      plantPart.value = null;
    };

    const addPlantWeight = async () => {
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
      } catch (error) {
        if (error.message === "Unauthorized") {
          await store.dispatch("auth/logout");
          router.push("/login");
        }
        console.error("Failed to update awailable weight:", error);
      }
    };

    const handleYes = async () => {
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
  font-size: 11px;
  justify-content: flex-start;
}

.distillation__plant-identification {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding-block: 10px;
  width: 50%;
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
</style>
