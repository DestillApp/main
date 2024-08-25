//pagination
// no docs
<template>
  <h3 class="plant_list-title">Zapisane surowce</h3>
  <ul v-if="plantList.length >= 1" class="plant_list">
    <li
      v-for="plant in plantList"
      :key="plant._id"
      id="plant._id"
      class="plant"
    >
      <div class="plant_data">
        <div class="plant_weight">
          <p class="plant_weight_state">na stanie:</p>
          {{ plant.plantWeight }} kg
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
        <button @click="openPlantDetails" class="plant_button-details">
          Zobacz szczegóły
        </button>
        <button @click="openDeleteModal" class="plant_button-delete">
          Usuń
        </button>
      </div>
      <plant-delete-modal
        v-if="isModalOpen"
        :id="plant._id"
        @close-modal="closeDeleteModal"
        @close-delete-modal="closeDeleteModal"
      ></plant-delete-modal>
    </li>
  </ul>
  <div v-else>magazyn jest pusty...</div>
</template>

<script>
import { ref, onMounted, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { useApolloClient } from "@vue/apollo-composable";
import { gql } from "@apollo/client/core";

import PlantDeleteModal from "@/components/plant/PlantDeleteModal.vue";

const GET_PLANTS = gql`
  query GetPlants($fields: [String]!) {
    getPlants(fields: $fields) {
      plantName
      plantPart
      plantWeight
      harvestDate
      plantBuyDate
      _id
    }
  }
`;

export default {
  name: "PlantListPage",
  components: { PlantDeleteModal },
  setup() {
    const { resolveClient } = useApolloClient();
    const apolloClient = resolveClient();
    const route = useRoute();

    const plantList = ref([]);
    const isModalOpen = ref(false);

    const fetchPlantList = async () => {
      try {
        const { data } = await apolloClient.query({
          query: GET_PLANTS,
          variables: {
            fields: [
              "plantName",
              "plantPart",
              "plantWeight",
              "harvestDate",
              "plantBuyDate",
              "_id",
            ],
          },
        });
        plantList.value = data.getPlants;
        console.log("plantList", plantList.value);
      } catch (error) {
        console.error("Failed to get plant list:");
        plantList.value = [];
      }
    };

    onMounted(() => {
      fetchPlantList();
    });

    watchEffect(() => {
      if (route.name === "PlantListPage") {
        fetchPlantList();
      }
    });

    const openPlantDetails = () => {
      console.log("Plant details!");
    };

    const openDeleteModal = () => {
      isModalOpen.value = true;
      console.log("Open modal!");
    };

    const closeDeleteModal = () => {
      isModalOpen.value = false;
    };
    return {
      plantList,
      isModalOpen,
      openPlantDetails,
      openDeleteModal,
      closeDeleteModal,
    };
  },
};
</script>

<style scoped>
.plant_list-title {
  margin-bottom: 20px;
}

.plant_list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.plant {
  display: flex;
  flex-direction: row;
  padding: 10px 20px;
  border: 2px solid var(--primary-color);
  border-radius: var(--input-border-radius);
}

.plant_data {
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex-grow: 1;
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
  flex-grow: 3;
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
  flex-grow: 1;
  font-size: 11px;
}

.plant_button-details {
  color: var(--secondary-color);
}

.plant_button-details:hover {
  color: var(--primary-color);
}

.plant_button-delete:hover {
  color: red;
}
</style>