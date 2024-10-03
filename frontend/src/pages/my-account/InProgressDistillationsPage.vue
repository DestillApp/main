//no arch docs no code docs
// refreshing after deleting the distillation
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
              params: { page: page, id: distillation._id },
            }"
            class="distillation_button--details"
          >
            <button>Zobacz szczegóły</button>
          </router-link>
          <button
            @click="
              openDeleteModal(
                distillation._id,
                distillation.choosedPlant.name,
                distillation.choosedPlant.part,
                distillation.distillationDate
              )
            "
            class="distillation_button--delete"
          >
            Usuń
          </button>
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
      @delete-plant="deleteDistillation"
    ></delete-item-modal>
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
      :active-color="`var(--secondary-color)`"
      class="distillation_pagination"
    ></v-pagination>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { useApolloClient } from "@vue/apollo-composable";
import { useRoute, useRouter } from "vue-router";
import { scrollToTop } from "@/helpers/displayHelpers";
import { GET_DISTILLATIONS } from "@/graphql/queries/distillation";
import { DELETE_DISTILLATION } from "@/graphql/mutations/distillation";

export default {
  name: "InProgressDistillationsPage",
  setup() {
    // Apollo client instance
    const { resolveClient } = useApolloClient();
    const apolloClient = resolveClient();

    // Route object to access route params
    const route = useRoute();
    const router = useRouter();

    // Reactive references for distillation data
    const distillationsList = ref([]);
    const selectedDistillationId = ref(null);
    const plantName = ref(null);
    const plantPart = ref(null);
    const distillationDate = ref(null);

    // Reactive reference to track if the delete modal is open
    const isModalOpen = ref(false);

    const distillationsAmount = ref(null);
    const page = ref(Number(route.params.page));
    const distillationsPerPage = ref(10);

    // Reactive reference for loading state
    const isLoading = ref(true);

    // Computed property for pagination length
    const paginationLength = computed(() => {
      return Math.ceil(distillationsAmount.value / distillationsPerPage.value);
    });

    /**
     * @async
     * @function fetchPlantList
     * @description Fetch the list of plants from the GraphQL server.
     * @returns {Promise<void>}
     */
    const fetchDistillationList = async (name = null) => {
      try {
        isLoading.value = true;
        const { data } = await apolloClient.query({
          query: GET_DISTILLATIONS,
          fetchPolicy: "network-only",
          variables: {
            fields: [
              "choosedPlant.name",
              "choosedPlant.part",
              "distillationType",
              "distillationDate",
              "_id",
            ],
            name: name,
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

    // Fetch distillation list when the component is mounted
    onMounted(() => {
      fetchDistillationList();
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
    const openDeleteModal = (id, name, part, date) => {
      selectedDistillationId.value = id;
      plantName.value = name;
      plantPart.value = part;
      distillationDate.value = date;
      isModalOpen.value = true;
    };

    /**
     * @function closeDeleteModal
     * @description Close the delete modal.
     */
    const closeDeleteModal = () => {
      selectedDistillationId.value = null;
      plantName.value = null;
      plantPart.value = null;
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

    /**
     * @async
     * @function deletePlant
     * @description Delete the selected plant from the list.
     * @returns {Promise<void>}
     */
    const deleteDistillation = async () => {
      try {
        const { data } = await apolloClient.mutate({
          mutation: DELETE_DISTILLATION,
          variables: { id: selectedDistillationId.value },
        });
        if (data.deleteDistillation) {
            deleteDistillationFromList(selectedDistillationId.value);
        }
        closeDeleteModal();
      } catch (error) {
        console.error("Failed to delete plant:", error);
      }
    };

    return {
      distillationsList,
      isLoading,
      isModalOpen,
      plantName,
      plantPart,
      distillationDate,
      distillationsAmount,
      page,
      distillationsPerPage,
      paginationLength,
      openDeleteModal,
      closeDeleteModal,
      deleteDistillation,
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
  flex-direction: row;
  padding: 10px 20px;
  border: 2px solid var(--primary-color-distillation);
  border-radius: var(--input-border-radius);
}

.distillation_data {
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex-grow: 1;
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
  flex-grow: 3;
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
  flex-grow: 1;
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

                    <!-- <router-link :to="{ name: 'DistillationDetailsPage', params: { page: page, id: distillation._id } }"
                        class="plant_button--details">
                                            <button>Zobacz szczegóły</button>
                                        </router-link>
                    <button @click="
                                openDeleteModal(plant._id, plant.plantName, plant.plantPart)
                                " class="plant_button--delete">
                                            Usuń
                                        </button> -->