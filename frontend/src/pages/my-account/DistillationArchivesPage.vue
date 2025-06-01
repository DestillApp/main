<template>
  <div>
    <!-- List length settings component -->
    <list-length-settings
      class="distillation-archives__settings"
      title="ilość destylacji"
      listColor="results"
      :chosenLength="archivesPerPage"
      @select-length="handleSelectLength"
    ></list-length-settings>
    <!-- Title for the distillation archives list -->
    <h3 class="distillation-archives__title">Archiwum destylacji</h3>
    <div class="distillation-archives__sort">
      <!-- Search item component for searching distillation archives by name -->
      <base-search-item
        v-if="distillationArchivesList.length >= 1 || isSearching"
        label="Szukaj destylacji po nazwie rośliny"
        inputColor="results"
        @search="handleSearch"
        @clear="handleSearch"
      ></base-search-item>
      <!-- List sorting component for sorting distillation archives -->
      <list-sorting
        v-if="distillationArchivesList.length >= 1 || isSearching"
        class="distillation-archives__sorting"
        :options="Object.values(options)"
        :sorting="sortingOption"
        @choose:sorting="handleSorting"
      ></list-sorting>
    </div>
    <!-- Loading spinner while data is being fetched -->
    <v-progress-circular
      v-if="isLoading"
      color="var(--secondary-color-results)"
      :size="60"
      :width="6"
      indeterminate
    ></v-progress-circular>
    <!-- Distillation archives list -->
    <ul
      v-if="!isLoading && distillationArchivesList.length >= 1"
      class="distillation-archives__list"
    >
      <!-- Iterate through distillationArchivesList and display each distillation archive's data -->
      <li
        v-for="archive in distillationArchivesList"
        :key="archive._id"
        class="distillation-archives__item"
      >
        <div class="distillation-archives__item-container">
          <div class="distillation-archives__data">
            <div class="distillation-archives__type">
              <p class="distillation-archives__type-state">typ destylacji:</p>
              {{ archive.distillationData.distillationType }}
            </div>
            <div class="distillation-archives__date">
              <p class="distillation-archives__date-state">data destylacji:</p>
              {{ archive.distillationData.distillationDate }}
            </div>
          </div>
          <div class="distillation-archives__plant-identification">
            <div class="distillation-archives__plant-name">
              {{ archive.distilledPlant.plantName }}
            </div>
            <div class="distillation-archives__plant-part">
              {{ archive.distilledPlant.plantPart }}
            </div>
          </div>
          <div class="distillation-archives__buttons">
            <router-link
              :to="{
                name: 'ArchiveDistillationDetailsPage',
                params: { page: page, archiveId: archive._id },
              }"
              class="distillation-archives__button-details"
            >
              <button>Zobacz szczegóły</button>
            </router-link>
            <button
              @click="
                openDeleteModal(
                  archive._id,
                  archive.distilledPlant._id,
                  archive.distilledPlant.plantName,
                  archive.distilledPlant.plantPart,
                  archive.distillationData.weightForDistillation ?? 0,
                  archive.distillationData.distillationDate
                )
              "
              class="distillation-archives__button-delete"
            >
              Usuń
            </button>
          </div>
        </div>
        <div class="distillation-archives__results">
          <div class="distillation-archives__oil-amount">
            ilość olejku eterycznego: {{ archive.oilAmount }} ml
          </div>
          <div class="distillation-archives__hydrosol-amount">
            ilość hydrolatu: {{ archive.hydrosolAmount }} l
          </div>
        </div>
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
      @delete-item="deleteDistillationArchive"
    ></delete-item-modal>
    <!-- Message displayed when no archives are available -->
    <div
      v-if="!isLoading && distillationArchivesList.length < 1 && !isSearching"
    >
      brak archiwalnych destylacji...
    </div>
    <div
      v-if="!isLoading && distillationArchivesList.length < 1 && isSearching"
    >
      brak wyników...
    </div>
    <!-- Pagination for navigating distillation archives list -->
    <v-pagination
      v-if="!isLoading && (archivesAmount ?? 0) > archivesPerPage"
      v-model="page"
      :length="paginationLength"
      rounded="circle"
      :total-visible="4"
      :active-color="`var(--secondary-color-results)`"
      class="distillation-archives__pagination"
    ></v-pagination>
  </div>
</template>

<script lang="ts">
import { ref, reactive, computed, onBeforeMount, onMounted, watch } from "vue";
import { useApolloClient } from "@vue/apollo-composable";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import { useStore } from "@/store/useStore";
import ListLengthSettings from "@/components/ListLengthSettings.vue";
import ListSorting from "@/components/ListSorting.vue";
import { scrollToTop } from "@/helpers/displayHelpers";
import { handleUserError } from "@/helpers/errorHandling";
import { GET_DISTILLATION_ARCHIVES } from "@/graphql/queries/results";
import { DELETE_DISTILLATION_ARCHIVE } from "@/graphql/mutations/results";
import {
  updateListSorting,
  updateListSettings,
} from "@/graphql/mutations/settingsFunctions.js";
import DeleteItemModal from "@/components/plant/DeleteItemModal.vue";
import BaseSearchItem from "@/ui/BaseSearchItem.vue";
import type { DistillationArchive } from "@/types/forms/resultsForm";

export default {
  name: "DistillationArchivesPage",
  components: {
    DeleteItemModal,
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

    // Reactive references for distillation archives data
    const distillationArchivesList = ref<DistillationArchive[]>([]);
    const selectedArchiveId = ref<string>("");
    const selectedPlantId = ref<string>("");
    const plantName = ref<string>("");
    const plantPart = ref<string>("");
    const distillationWeight = ref<number | null>(null);
    const distillationDate = ref<string>("");

    // Reactive reference to track if the delete modal is open
    const isModalOpen = ref<boolean>(false);

    // Reactive references for pagination
    const archivesAmount = ref<number | null>(null);
    const page = ref<number>(Number(route.params.page) || 1);
    const archivesPerPage = computed<number>(
      () =>
        store.getters["settings/settingsForm"].distillationArchivesListLength
    );

    // Reactive reference for loading state
    const isLoading = ref<boolean>(true);

    // Reactive reference for searching state
    const isSearching = computed<boolean>(() => {
      return searchQuery.value ? true : false;
    });

    // Computed property for pagination length
    const paginationLength = computed<number>(() => {
      return Math.ceil((archivesAmount.value ?? 0) / archivesPerPage.value);
    });

    // Computed property to get searchQuery from Vuex store
    const searchQuery = computed<string>(() => store.getters.searchQuery);

    const options = reactive<Record<string, string>>({
      plantName: "nazwy rośliny alfabetycznie",
      createdAt: "daty dodania destylacji",
      youngDate: "najnowszej daty destylacji",
      oldDate: "najstarszej daty destylacji",
    });

    const sortingOption = computed<string>(() => {
      const sortingValue =
        store.getters["settings/settingsForm"].archiveDistillationListSorting;
      return options[sortingValue] || "";
    });

    const sorting = computed<string>(
      () =>
        store.getters["settings/settingsForm"].archiveDistillationListSorting
    );

    /**
     * @async
     * @function fetchDistillationArchivesList
     * @description Fetch the list of distillation archives from the GraphQL server.
     * @returns {Promise<void>}
     */
    const fetchDistillationArchivesList = async (
      name: string,
      sortingValue: string
    ): Promise<void> => {
      try {
        isLoading.value = true;
        const { data } = await apolloClient.query({
          query: GET_DISTILLATION_ARCHIVES,
          fetchPolicy: "network-only",
          variables: {
            fields: [
              "_id",
              "oilAmount",
              "hydrosolAmount",
              "distillationData.distillationType",
              "distillationData.distillationDate",
              "distilledPlant.plantName",
              "distilledPlant.plantPart",
            ],
            name: name,
            sorting: sorting.value,
            formatDates: true,
            page: page.value,
            limit: archivesPerPage.value,
          },
        });
        archivesAmount.value = data.getDistillationArchives.length;

        const start = (page.value - 1) * archivesPerPage.value;
        const end = page.value * archivesPerPage.value;

        distillationArchivesList.value = data.getDistillationArchives.slice(
          start,
          end
        );
        console.log(distillationArchivesList.value);
      } catch (error: any) {
        await handleUserError(error);
        archivesAmount.value = null;
        distillationArchivesList.value = [];
      } finally {
        isLoading.value = false;
      }
    };

    /**
     * @function handleSearch
     * @description Handle the search query emitted from the BaseSearchItem component.
     */
    const handleSearch = async (): Promise<void> => {
      await fetchDistillationArchivesList(searchQuery.value, sorting.value);
    };

    /**
     * @function handleSelectLength
     * @description Handle the selection of list length.
     * @param {Number} length - The selected length.
     */
    const handleSelectLength = async (
      length: number
    ): Promise<void | undefined> => {
      const isUpdating = await updateListSettings(
        apolloClient,
        "distillationArchivesListLength",
        length
      );
      if (isUpdating === "Unauthorized") {
        await store.dispatch("auth/logout");
        router.push("/login");
        return;
      }
      if (isUpdating === true) {
        store.dispatch("settings/setValue", {
          input: "distillationArchivesListLength",
          value: length,
        });
        page.value = 1;
      }
    };

    /**
     * @function updateSorting
     * @description Update the sorting option and fetch the distillation archives list.
     * @param {String} sortingKey - The sorting key.
     * @param {String} sortingValue - The sorting value.
     */
    const updateSorting = async (
      sortingKey: string,
      sortingValue: string
    ): Promise<void | undefined> => {
      const update = await updateListSorting(
        apolloClient,
        "archiveDistillationListSorting",
        sortingKey
      );
      if (update === "Unauthorized") {
        await store.dispatch("auth/logout");
        router.push("/login");
        return;
      } else {
        store.dispatch("settings/setValue", {
          input: "archiveDistillationListSorting",
          value: sortingKey,
        });
        await fetchDistillationArchivesList(searchQuery.value, sortingValue);
      }
    };

    /**
     * @function handleSorting
     * @description Handle the sorting of the items list.
     * @param {String} option - The sorting option.
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

    onBeforeMount(() => {
      store.dispatch("settings/fetchLocalStorageData", {
        key: "distillationArchivesListLength",
      });
      store.dispatch("settings/fetchLocalStorageData", {
        key: "archiveDistillationListSorting",
      });
      store.dispatch("fetchSearchQueryFromLocalStorage");
    });

    // Fetch distillation archives list when the component is mounted
    onMounted(async () => {
      await fetchDistillationArchivesList(searchQuery.value, sorting.value);
    });

    // Watch for changes in the page number and refetch distillation archives list.
    watch(page, async (newPage) => {
      router.push({
        name: "DistillationArchivesPage",
        params: { page: newPage },
      });
      await fetchDistillationArchivesList(searchQuery.value, sorting.value);
      scrollToTop();
    });

    /**
     * @function openDeleteModal
     * @description Open the delete modal for a specific distillation archive.
     * @param {String} id - The ID of the distillation archive to delete.
     * @param {String} plantId - The ID of the plant.
     * @param {String} name - The name of the plant.
     * @param {String} part - The part of the plant.
     * @param {String} dWeight - The weight of the distillation.
     * @param {String} date - Distillation date.
     */
    const openDeleteModal = (
      id: string,
      plantId: string,
      name: string,
      part: string,
      dWeight: number,
      date: string
    ): void => {
      selectedArchiveId.value = id;
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
    const closeDeleteModal = (): void => {
      distillationDate.value = "";
      isModalOpen.value = false;
    };

    /**
     * @function
     * @description Remove the deleted archive from the list.
     * @param {String} id - The ID of the deleted archive.
     */
    const deleteDistillationFromList = (id: string): void => {
      distillationArchivesList.value = distillationArchivesList.value.filter(
        (archive) => archive._id !== id
      );
    };

    /**
     * @async
     * @function deleteDistillationArchive
     * @description Delete the selected distillation archive from the list.
     * @returns {Promise<void>}
     */
    const deleteDistillationArchive = async (): Promise<void> => {
      try {
        const { data } = await apolloClient.mutate({
          mutation: DELETE_DISTILLATION_ARCHIVE,
          variables: { id: selectedArchiveId.value },
        });
        if (data.deleteDistillationArchive) {
          deleteDistillationFromList(selectedArchiveId.value);
          if (page.value > 1 && !distillationArchivesList.value.length) {
            page.value = page.value - 1;
            router.push({
              name: "DistillationArchivesPage",
              params: { page: page.value },
            });
          } else {
            await fetchDistillationArchivesList(
              searchQuery.value,
              sorting.value
            );
          }
        }
        closeDeleteModal();
      } catch (error: any) {
        await handleUserError(error);
      }
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
      distillationArchivesList,
      isLoading,
      isSearching,
      isModalOpen,
      plantName,
      plantPart,
      distillationDate,
      archivesAmount,
      page,
      archivesPerPage,
      paginationLength,
      searchQuery,
      options,
      sortingOption,
      handleSelectLength,
      handleSorting,
      openDeleteModal,
      closeDeleteModal,
      deleteDistillationArchive,
      handleSearch,
    };
  },
};
</script>

<style scoped>
.distillation-archives__settings {
  float: right;
}

.distillation-archives__title {
  margin-bottom: 20px;
}

.distillation-archives__sort {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
}

.distillation-archives__sorting {
  width: 300px;
}

.distillation-archives__list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.distillation-archives__item {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px 20px;
  border: 2px solid var(--primary-color-results);
  border-radius: var(--input-border-radius);
}

.distillation-archives__item-container {
  display: flex;
  flex-direction: row;
}

.distillation-archives__data {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 25%;
}

.distillation-archives__type {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.distillation-archives__type-state {
  display: flex;
  font-size: 11px;
  justify-content: flex-start;
}

.distillation-archives__date {
  display: flex;
  flex-direction: column;
  font-size: 11px;
  gap: 6px;
  justify-content: flex-start;
}

.distillation-archives__date-state {
  margin-right: 5px;
}

.distillation-archives__plant-identification {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding-block: 10px;
  width: 50%;
}

.distillation-archives__plant-name {
  font-size: 20px;
}

.distillation-archives__plant-part {
  font-size: 12px;
}

.distillation-archives__buttons {
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: flex-end;
  width: 25%;
  font-size: 11px;
}

.distillation-archives__button-details {
  display: flex;
  color: var(--secondary-color-results);
}

.distillation-archives__button-details:hover {
  color: var(--primary-color-results);
}

.distillation-archives__button-delete:hover {
  color: red;
}

.distillation-archives__results {
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 5px;
  font-size: 11px;
}

.distillation-archives__oil-amount,
.distillation-archives__hydrosol-amount {
  flex-grow: 1;
}

.distillation-archives__pagination {
  margin-top: 20px;
}

@media (max-width: 900px) {
  .distillation-archives__sort {
    flex-direction: column;
    gap: 20px;
  }

  .distillation-archives__sorting {
    width: 250px;
  }
}

@media (max-width: 600px) {
  .distillation-archives__item {
    flex-direction: column;
    padding: 10px;
    border: 1px solid var(--primary-color-results);
  }

  .distillation-archives__item-container {
    flex-direction: column-reverse;
    gap: 10px;
  }

  .distillation-archives__buttons {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 10px;
  }

  .distillation-archives__button-details,
  .distillation-archives__button-delete {
    flex: 1;
    text-align: center;
  }

  .distillation-archives__button-details {
    margin-left: 10px;
  }

  .distillation-archives__button-delete {
    margin-right: 10px;
    text-align: right;
  }

  .distillation-archives__data {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-inline: 20px;
    gap: 10px;
    width: 100%;
  }

  .distillation-archives__plant-identification {
    width: 100%;
  }

  .distillation-archives__type,
  .distillation-archives__date {
    flex: 1;
    text-align: left;
  }

  .distillation-archives__date {
    text-align: right;
  }

  .distillation-archives__date-state {
    margin-right: 0px;
  }

  .distillation-archives__type-state {
    font-size: 11px;
  }

  .distillation-archives__results {
    flex-direction: column;
  }
}
</style>
