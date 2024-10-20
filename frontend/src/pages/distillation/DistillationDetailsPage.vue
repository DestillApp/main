// no code and atch docs
<template>
  <div>
    <!-- Spinner that shows when data is loading -->
    <v-progress-circular v-if="isLoading" class="spinner" color="var(--secondary-color-distillation)" :size="60"
      :width="6" indeterminate></v-progress-circular>
    <!-- Display distillation details once data is loaded and no longer loading -->
    <div v-if="distillationDetails && !isLoading" class="distillation">
      <div class="distillation_container--one">
        <!-- Display used weight of plant-->
        <div class="plant_distillation">
          <p class="plant_distillation--used">użyta ilość surowca:</p>
          <span>{{ distillationDetails.weightForDistillation }} kg</span>
        </div>
        <!-- Display plant identification information -->
        <div class="plant_identification">
          <h3>destylacja {{ distillationDetails.distillationType }}</h3>
          <div>{{ distillationDetails.choosedPlant.name }}</div>
          <div>{{ distillationDetails.choosedPlant.part }}</div>
        </div>
        <div class="distillation_buttons">
          <router-link :to="{
              name: 'EditDistillationPage',
              params: { page: page, id: distillationId },
            }"><button class="distillation_button--edit">
              Edytuj
            </button></router-link>
          <button class="distillation_button--delete" @click="openDeleteModal">
            Usuń
          </button>
          <!-- Modal for deleting the plant -->
          <delete-item-modal v-if="isModalOpen"></delete-item-modal>
        </div>
      </div>
      <div class="distillation_container--two">
        <div class="plant_info">
          <h5 class="plant_title">przygotowanie surowca</h5>
          <div v-if="distillationDetails.isPlantSoaked">
            <div class="plant_data">surowiec namaczany</div>
            <div class="plant_data">
              czas namaczania: {{ distillationDetails.soakingTime }} h
            </div>
            <div class="plant_data">
              waga po namoczeniu:
              {{ distillationDetails.weightAfterSoaking }} kg
            </div>
          </div>
          <div class="plant_data" v-if="!distillationDetails.isPlantSoaked">
            surowiec nienamaczany
          </div>
          <div class="plant_data" v-if="!distillationDetails.isPlantShredded">
            surowiec nierozdrobniony
          </div>
          <div class="plant_data" v-if="distillationDetails.isPlantShredded">
            surowiec rozdrobniony
          </div>
          <div class="plant_details">
            <button v-if="!isPlantOpen" @click="openClosePlant" class="plant_button">
              więcej o surowcu
              <svg-icon class="icon" type="mdi" :path="pathArrowDown" size="18"></svg-icon>
            </button>
            <button v-if="isPlantOpen" @click="openClosePlant" class="plant_button">
              mniej o surowcu
              <svg-icon class="icon" type="mdi" :path="pathArrowUp" size="18"></svg-icon>
            </button>
            <plant-details v-if="isPlantOpen" class="plant_details--component"
              :plantId="distillationDetails.choosedPlant.id"></plant-details>
          </div>
        </div>
        <div class="distillation_info">
          <h5 class="distillation_title">informacje o destylacji</h5>
          <div class="distillation_data">
            data destylacji: {{ distillationDetails.distillationDate }}
          </div>
          <div class="distillation_data">
            {{ distillationDetails.distillationApparatus }}
          </div>
          <div class="distillation_data">
            ilość wody do destylacji:
            {{ distillationDetails.waterForDistillation }} l
          </div>
        </div>
      </div>
      <router-link :to="{ name: 'AddResultsPage' }" class="distillation_results"><base-button
          class="results_button">Dodaj wyniki destylacji</base-button></router-link>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useApolloClient } from "@vue/apollo-composable";
import DeleteItemModal from "@/components/plant/DeleteItemModal.vue";
import BaseButton from "@/ui/BaseButton.vue";
import SvgIcon from "@jamescoyle/vue-icon";
import PlantDetails from "@/components/plant/PlantDetails.vue";
import { mdiChevronDown } from "@mdi/js";
import { mdiChevronUp } from "@mdi/js";
import { GET_DISTILLATION_BY_ID } from "@/graphql/queries/distillation";

export default {
  name: "DistillationDetailsPage",
  components: { DeleteItemModal, BaseButton, SvgIcon, PlantDetails },
  setup() {
    const { resolveClient } = useApolloClient();
    const apolloClient = resolveClient();

    // Route object to access route params
    const route = useRoute();
    // Router object for navigation
    // const router = useRouter();

    // Reactive reference to store the plant ID and plant page number from the route
    const distillationId = ref(route.params.id);
    const page = ref(Number(route.params.page));
    // Reactive reference to store fetched plant details
    const distillationDetails = ref(null);
    // Reactive reference to track if the delete modal is open
    const isModalOpen = ref(false);
    // Reactive reference to track loading state
    const isLoading = ref(true);
    const isPlantOpen = ref(false);

    const pathArrowDown = ref(mdiChevronDown);
    const pathArrowUp = ref(mdiChevronUp);

    /**
     * @async
     * @function fetchDistillationDetails
     * @description Fetches the plant details by plant ID from GraphQL API.
     * @returns {Promise<void>}
     */
    const fetchDistillationDetails = async () => {
      try {
        isLoading.value = true;
        const { data } = await apolloClient.query({
          query: GET_DISTILLATION_BY_ID,
          variables: { id: distillationId.value, formatDates: true },
        });
        distillationDetails.value = data.getDistillationById;
        console.log(distillationDetails.value);
      } catch (error) {
        console.error("Failed to get plant details:", error);
        distillationDetails.value = null;
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(() => {
      fetchDistillationDetails();
    });

    const openClosePlant = () => {
      if (isPlantOpen.value) {
        isPlantOpen.value = false;
      } else {
        isPlantOpen.value = true;
      }
    };

    return {
      distillationId,
      page,
      isLoading,
      distillationDetails,
      isModalOpen,
      isPlantOpen,
      pathArrowDown,
      pathArrowUp,
      openClosePlant,
    };
  },
};
</script>

<style scoped>
.spinner {
  margin-block: 20px;
}

.distillation {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.distillation_container--one {
  display: flex;
  flex-direction: row;
}

.plant_distillation {
  width: 20%;
  display: flex;
  flex-direction: column;
}

.plant_distillation--used {
  font-size: 11px;
}

.plant_identification {
  width: 60%;
  padding-top: 20px;
}

.distillation_buttons {
  display: flex;
  flex-direction: row;
  width: 20%;
  font-size: 11px;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 10px;
}

.distillation_button--edit {
  color: var(--secondary-color-distillation);
}

.distillation_button--edit:hover {
  color: var(--primary-color-distillation);
}

.distillation_button--delete:hover {
  color: red;
}

.distillation_container--two {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

.plant_info,
.distillation_info {
  width: 50%;
}

.plant_title {
  color: var(--secondary-color);
  padding-bottom: 10px;
}

.plant_data,
.distillation_data {
  display: flex;
  justify-content: flex-start;
  font-size: 13px;
  padding-left: 20%;
  padding-right: 10%;
}

.distillation_title {
  color: var(--secondary-color-distillation);
  padding-bottom: 10px;
}

.plant_details {
  display: flex;
  flex-direction: column;
}

.plant_button {
  position: relative;
  color: var(--secondary-color);
  font-size: 11px;
  margin-top: 20px;
  float: left;
  margin-left: 20%;
  text-align: left;
}

.plant_button:hover {
  color: var(--primary-color);
}

.plant_details--component {
  text-align: left;
  margin-left: 20%;
}

.icon {
  position: absolute;
}

.distillation_results {
  padding-block: 10px;
  margin-inline: 30%;
}

.results_button:hover {
  color: var(--secondary-color-distillation);
}
</style>