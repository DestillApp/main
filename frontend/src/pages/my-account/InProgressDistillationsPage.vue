//no arch docs no code docs
<template>
  <div>
    <!-- Title for the distillation list -->
    <h3 class="distillation_list--title">Destylacje w toku</h3>
    <!-- Loading spinner while data is being fetched -->
    <v-progress-circular
      v-if="isLoading"
      color="var(--secondary-color-distillation)"
      :size="60"
      :width="6"
      indeterminate
    ></v-progress-circular>
    <!-- Search item component for searching distillations by name -->
    <base-search-item
      label="Szukaj destylacji po nazwie rośliny"
      @search="handleSearch"
      @clear="handleSearch"
    ></base-search-item>
    <!-- Distillation list -->
    <ul
      v-if="!isLoading && distillationsList.length >= 1"
      class="distillation_list"
    >
      <!-- Iterate through distillationList and display each distillation's data -->
      <li
        v-for="distillation in distillationsList"
        :key="distillation.id"
        class="distillation"
      >
        <div class="distillation_container">
          <div class="distillation_data">
            <div class="distillation_type">
              <p class="distillation_type_state">typ destylacji:</p>
              {{ distillation.distillationType }}
            </div>
            <div class="distillation_date">
              data destylacji: {{ distillation.distillationDate }}
            </div>
          </div>
          <div class="plant_identification">
            <div class="plant_name">{{ distillation.choosedPlant.name }}</div>
            <div class="plant_part">{{ distillation.choosedPlant.part }}</div>
          </div>
          <div class="distillation_buttons">
            <router-link
              :to="{
                name: 'DistillationDetailsPage',
                params: { page: page, distillId: distillation._id },
              }"
              class="distillation_button--details"
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
              class="distillation_button--delete"
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
          class="distillation_button--results"
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
    <div v-if="!isLoading && distillationsList.length < 1">
      brak destylacji w toku...
    </div>
    <!-- Pagination for navigating distillation list -->
    <v-pagination
      v-if="!isLoading && distillationsAmount > distillationsPerPage"
      v-model="page"
      :length="paginationLength"
      rounded="circle"
      :total-visible="4"
      :active-color="`var(--secondary-color-distillation)`"
      class="distillation_pagination"
    ></v-pagination>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { useApolloClient } from "@vue/apollo-composable";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { scrollToTop } from "@/helpers/displayHelpers";
import DeleteItemModal from "@/components/plant/DeleteItemModal.vue";
import BaseButton from "@/ui/BaseButton.vue";
import BaseSearchItem from "@/ui/BaseSearchItem.vue";
import { GET_DISTILLATIONS } from "@/graphql/queries/distillation";
import { DELETE_DISTILLATION } from "@/graphql/mutations/distillation";
import { CHANGE_AVAILABLE_WEIGHT } from "@/graphql/mutations/plant";

export default {
  name: "InProgressDistillationsPage",
  components: { DeleteItemModal, BaseButton, BaseSearchItem },
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
    const distillationsPerPage = ref(5);

    // Reactive reference for loading state
    const isLoading = ref(true);

    // Computed property for pagination length
    const paginationLength = computed(() => {
      return Math.ceil(distillationsAmount.value / distillationsPerPage.value);
    });

    // Computed property to get searchQuery from Vuex store
    const searchQuery = computed(() => store.getters.searchQuery);

    /**
     * @async
     * @function fetchDistillationList
     * @description Fetch the list of distillations from the GraphQL server.
     * @returns {Promise<void>}
     */
    const fetchDistillationList = async (name) => {
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
            page: page.value,
            limit: distillationsPerPage.value,
          },
        });
        distillationsAmount.value = data.getDistillations.length;

        const start = (page.value - 1) * distillationsPerPage.value;
        const end = page.value * distillationsPerPage.value;

        distillationsList.value = data.getDistillations.slice(start, end);
        console.log(distillationsList.value);
      } catch (error) {
        console.error("Failed to get plant list:", error);
        distillationsAmount.value = null;
        distillationsList.value = [];
      } finally {
        isLoading.value = false;
      }
    };

    /**
     * @function handleSearch
     * @description Handle the search query emitted from the BaseSearchItem component.
     * @param {String} query - The search query.
     */
    const handleSearch = () => {
      console.log("Search query from Vuex:", searchQuery.value);
      fetchDistillationList(searchQuery.value);
    };

    // Fetch distillation list when the component is mounted
    onMounted(() => {
      store.dispatch("fetchSearchQueryFromLocalStorage");
      if (searchQuery.value) {
        fetchDistillationList(searchQuery.value);
      } else {
        fetchDistillationList();
      }
    });

    // Watch for changes in the page number and refetch plant list.
    watch(page, (newPage) => {
      router.push({
        name: "InProgressDistillationsPage",
        params: { page: newPage },
      });
      fetchDistillationList();
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
            await fetchDistillationList();
          }
        }
        closeDeleteModal();
      } catch (error) {
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
        const { data } = await apolloClient.mutate({
          mutation: CHANGE_AVAILABLE_WEIGHT,
          variables: {
            input: {
              id: selectedPlantId.value,
              availableWeight: distillationWeight.value,
            },
          },
        });
        console.log("Changed available weight:", data.changeAvailableWeight);
      } catch (error) {
        console.error("Failed to update awailable weight:", error);
      }
    };

    const handleYes = async () => {
      await addPlantWeight();
      closeAskModal();
    };

    return {
      distillationsList,
      isLoading,
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
      openDeleteModal,
      closeDeleteModal,
      closeAskModal,
      deleteDistillation,
      handleYes,
      handleSearch,
    };
  },
};
</script>

<style scoped>
.distillation_list--title {
  margin-bottom: 20px;
}

.distillation_list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.distillation {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px 20px;
  border: 2px solid var(--primary-color-distillation);
  border-radius: var(--input-border-radius);
}

.distillation_container {
  display: flex;
  flex-direction: row;
}

.distillation_data {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 25%;
}

.distillation_type {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.distillation_type_state {
  display: flex;
  font-size: 11px;
  justify-content: flex-start;
}

.distillation_date {
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

.distillation_buttons {
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: flex-end;
  width: 25%;
  font-size: 11px;
}

.distillation_button--details {
  display: flex;
  color: var(--secondary-color-distillation);
}

.distillation_button--details:hover {
  color: var(--primary-color-distillation);
}

.distillation_button--delete:hover {
  color: red;
}

.distillation_pagination {
  margin-top: 20px;
}
</style>
