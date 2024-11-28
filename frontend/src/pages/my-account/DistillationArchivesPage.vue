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
    <!-- Message displayed when no archives are available -->
    <div v-if="!isLoading && distillationArchivesList.length < 1">
      brak archiwalnych destylacji...
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useApolloClient } from "@vue/apollo-composable";
import { GET_DISTILLATION_ARCHIVES } from "@/graphql/queries/results.js";

export default {
  name: "DistillationArchivesPage",
  setup() {
    // Apollo client instance
    const { resolveClient } = useApolloClient();
    const apolloClient = resolveClient();

    // Reactive references for distillation archives data
    const distillationArchivesList = ref([]);
    const isLoading = ref(true);

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
          },
        });
        distillationArchivesList.value = data.getDistillationArchives;
        console.log(distillationArchivesList.value);
      } catch (error) {
        console.error("Failed to get distillation archives list:", error);
        distillationArchivesList.value = [];
      } finally {
        isLoading.value = false;
      }
    };

    // Fetch distillation archives list when the component is mounted
    onMounted(() => {
      fetchDistillationArchivesList();
    });

    return {
      distillationArchivesList,
      isLoading,
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

.distillation_results {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 11px;
}

.oil_amount,
.hydrosol_amount,
.hydrosol_ph {
  display: flex;
  justify-content: flex-start;
}
</style>