<template>
  <div>
    <!-- Title for the distillation archives list -->
    <h3 class="distillation_archives_list--title">Archiwum destylacji</h3>
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
      class="distillation_archives_list"
    >
      <!-- Iterate through distillationArchivesList and display each distillation archive's data -->
      <li
        v-for="archive in distillationArchivesList"
        :key="archive.id"
        class="distillation_archive"
      >
        <div class="distillation_archive--one">
          <div class="distillation_data">
            <div class="distillation_type">
              <p class="distillation_type_state">typ destylacji:</p>
              {{ archive.distillationData.distillationType }}
            </div>
            <div class="distillation_date">
              data destylacji: {{ archive.distillationData.distillationDate }}
            </div>
          </div>
          <div class="plant_identification">
            <div class="plant_name">{{ archive.distilledPlant.plantName }}</div>
            <div class="plant_part">{{ archive.distilledPlant.plantPart }}</div>
          </div>
          <div class="distillation_buttons">
            <router-link
              :to="{
                name: 'ArchiveDistillationDetailsPage',
                params: { page: page, archiveId: archive._id },
              }"
              class="archive_button--details"
            >
              <button>Zobacz szczegóły</button>
            </router-link>
            <button
              @click="
                openDeleteModal(
                  archive._id,
                  archive.distilledPlant.id,
                  archive.distilledPlant.plantName,
                  archive.distilledPlant.plantPart,
                  archive.weightForDistillation,
                  archive.distillationData.distillationDate
                )
              "
              class="distillation_button--delete"
            >
              Usuń
            </button>
          </div>
        </div>
        <div class="distillation_results">
          <div class="oil_amount">
            ilość olejku eterycznego: {{ archive.oilAmount }} ml
          </div>
          <div class="hydrosol_amount">
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
    <div v-if="!isLoading && distillationArchivesList.length < 1">
      brak archiwalnych destylacji...
    </div>
    <!-- Pagination for navigating distillation archives list -->
    <v-pagination
      v-if="!isLoading && archivesAmount > archivesPerPage"
      v-model="page"
      :length="paginationLength"
      rounded="circle"
      :total-visible="4"
      :active-color="`var(--secondary-color-results)`"
      class="distillation_pagination"
    ></v-pagination>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { useApolloClient } from "@vue/apollo-composable";
import { useRoute, useRouter } from "vue-router";
import { scrollToTop } from "@/helpers/displayHelpers";
import { GET_DISTILLATION_ARCHIVES } from "@/graphql/queries/results.js";
import { DELETE_DISTILLATION_ARCHIVE } from "@/graphql/mutations/results.js";
import DeleteItemModal from "@/components/plant/DeleteItemModal.vue";

export default {
  name: "DistillationArchivesPage",
  components: {
    DeleteItemModal,
  },
  setup() {
    // Apollo client instance
    const { resolveClient } = useApolloClient();
    const apolloClient = resolveClient();

    // Route object to access route params
    const route = useRoute();
    const router = useRouter();

    // Reactive references for distillation archives data
    const distillationArchivesList = ref([]);
    const selectedArchiveId = ref(null);
    const selectedPlantId = ref(null);
    const plantName = ref(null);
    const plantPart = ref(null);
    const distillationWeight = ref(null);
    const distillationDate = ref(null);

    // Reactive reference to track if the delete modal is open
    const isModalOpen = ref(false);

    // Reactive references for pagination
    const archivesAmount = ref(null);
    const page = ref(Number(route.params.page) || 1);
    const archivesPerPage = ref(5);

    // Reactive reference for loading state
    const isLoading = ref(true);

    // Computed property for pagination length
    const paginationLength = computed(() => {
      return Math.ceil(archivesAmount.value / archivesPerPage.value);
    });

    /**
     * @async
     * @function fetchDistillationArchivesList
     * @description Fetch the list of distillation archives from the GraphQL server.
     * @returns {Promise<void>}
     */
    const fetchDistillationArchivesList = async (name = null) => {
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
            formatDates: true,
            page: page.value,
            limit: archivesPerPage.value,
          },
        });
        console.log("Fetched data:", data);
        archivesAmount.value = data.getDistillationArchives.length;

        const start = (page.value - 1) * archivesPerPage.value;
        const end = page.value * archivesPerPage.value;

        distillationArchivesList.value = data.getDistillationArchives.slice(
          start,
          end
        );
        console.log(distillationArchivesList.value);
      } catch (error) {
        console.error("Failed to get distillation archives list:", error);
        archivesAmount.value = null;
        distillationArchivesList.value = [];
      } finally {
        isLoading.value = false;
      }
    };

    // Fetch distillation archives list when the component is mounted
    onMounted(() => {
      fetchDistillationArchivesList();
    });

    // Watch for changes in the page number and refetch distillation archives list.
    watch(page, (newPage) => {
      router.push({
        name: "DistillationArchivesPage",
        params: { page: newPage },
      });
      fetchDistillationArchivesList();
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
    const openDeleteModal = (id, plantId, name, part, dWeight, date) => {
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
    const deleteDistillationArchive = async () => {
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
            await fetchDistillationArchivesList();
          }
        }
        closeDeleteModal();
      } catch (error) {
        console.error("Failed to delete distillation archive:", error);
      }
    };

    return {
      distillationArchivesList,
      isLoading,
      isModalOpen,
      plantName,
      plantPart,
      distillationDate,
      archivesAmount,
      page,
      archivesPerPage,
      paginationLength,
      openDeleteModal,
      closeDeleteModal,
      deleteDistillationArchive,
    };
  },
};
</script>

<style scoped>
.distillation_archives_list--title {
  margin-bottom: 20px;
}

.distillation_archives_list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.distillation_archive {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px 20px;
  border: 2px solid var(--primary-color-results);
  border-radius: var(--input-border-radius);
}

.distillation_archive--one {
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

.archive_button--details {
  display: flex;
  color: var(--secondary-color-results);
}

.archive_button--details:hover {
  color: var(--primary-color-results);
}

.distillation_button--delete:hover {
  color: red;
}

.distillation_results {
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 5px;
  font-size: 11px;
}

.oil_amount,
.hydrosol_amount {
  flex-grow: 1;
}

.distillation_pagination {
  margin-top: 20px;
}
</style>
