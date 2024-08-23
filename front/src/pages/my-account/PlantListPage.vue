<template>
  <h3>Zapisane surowce</h3>
  <ul v-if="plantList.length >= 1" class="plant_list">
    <li v-for="plant in plantList" :key="plant._id" class="plant">
      <div class="plant_identification">
        <div>{{ plant.plantName }}</div>
        <div>{{ plant.plantPart }}</div>
      </div>
      <div class="plant_data">
        <div v-if="plant.harvestDate !== null">{{ plant.harvestDate }}</div>
        <div v-if="plant.plantBuyDate !== null">{{ plant.plantBuyDate }}</div>
        <div>{{ plant.plantWeight }} kg</div>
      </div>
    </li>
  </ul>
  <div v-else>magazyn jest pusty...</div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useApolloClient } from "@vue/apollo-composable";
import { gql } from "@apollo/client/core";

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
  setup() {
    const plantList = ref([]);
    const { resolveClient } = useApolloClient();
    const apolloClient = resolveClient();

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

    return { plantList };
  },
};
</script>