//no docs // edytuj button, router-link to edditing the plant data // button
destyluj, router-link to add destilation form with plant ID? // miesiąc,
miesiące, miesięcy // redirecting to the previous plant list page (now it is 1)
//spinner
<template>
  <div>
    <v-progress-circular
    v-if="isLoading"
    class="spinner"
      color="var(--secondary-color)"
      :size="60"
      :width="6"
      indeterminate
    ></v-progress-circular>
    <div v-if="plantDetails && !isLoading" class="plant">
      <div class="plant_container--one">
        <div class="plant_instock">
          <p class="plant_instock--state">na stanie:</p>
          <br />{{ plantDetails.plantWeight }} kg
        </div>
        <div class="plant_identification">
          <h3>{{ plantDetails.plantName }}</h3>
          <div>{{ plantDetails.plantPart }}</div>
        </div>
        <div class="plant_buttons">
          <button class="plant_button--edit">Edytuj</button>
          <button class="plant_button--delete" @click="openDeleteModal">
            Usuń
          </button>
          <plant-delete-modal
            v-if="isModalOpen"
            :plantName="plantDetails.plantName"
            :plantPart="plantDetails.plantPart"
            @close-modal="closeDeleteModal"
            @close-delete-modal="closeDeleteModal"
            @delete-plant="deletePlant"
          ></plant-delete-modal>
        </div>
      </div>
      <div class="plant_container--two">
        <div v-if="plantDetails.plantOrigin === 'zbiór'" class="plant_info">
          <h5 class="plant_title">warunki zbioru</h5>
          <div class="plant_data">
            data zbioru: {{ plantDetails.harvestDate }}
          </div>
          <div class="plant_data">
            temperatura: {{ plantDetails.harvestTemperature }} °C
          </div>
          <div class="plant_data">
            godziny zbioru: {{ plantDetails.harvestStartTime }} -
            {{ plantDetails.harvestEndTime }}
          </div>
        </div>
        <div v-if="plantDetails.plantOrigin === 'kupno'" class="plant_info">
          <h5 class="plant_title">dane zakupu</h5>
          <div class="plant_data">
            data zakupu: {{ plantDetails.plantBuyDate }}
          </div>
          <div class="plant_data">
            producent: {{ plantDetails.plantProducer }}
          </div>
          <div class="plant_data">
            kraj pochodzenia: {{ plantDetails.countryOfOrigin }}
          </div>
        </div>
        <div class="plant_info">
          <h5 class="plant_title">informacje o surowcu</h5>
          <div class="plant_data">
            początkowa ilość: {{ plantDetails.plantWeight }} kg
          </div>
          <div class="plant_data" v-if="plantDetails.plantOrigin === 'kupno'">
            wiek przy zakupie: {{ plantDetails.plantAge }} miesięcy
          </div>
          <div class="plant_data">stan: {{ plantDetails.plantState }}</div>
          <div
            v-if="plantDetails.plantState === 'podsuszony'"
            class="plant_data"
          >
            czas podsuszania: {{ plantDetails.dryingTime }} h
          </div>
        </div>
      </div>
      <router-link to="/add-destillation" class="plant_distill"
        ><base-button class="destill_button">Destyluj</base-button></router-link
      >
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { gql } from "@apollo/client/core";
import { useRoute, useRouter } from "vue-router";
import { useApolloClient } from "@vue/apollo-composable";

import PlantDeleteModal from "@/components/plant/PlantDeleteModal.vue";
import BaseButton from "@/ui/BaseButton.vue";

const GET_PLANT_BY_ID = gql`
  query GetPlantById($id: ID!) {
    getPlantById(id: $id) {
      _id
      plantName
      plantPart
      plantOrigin
      plantBuyDate
      plantProducer
      countryOfOrigin
      harvestDate
      harvestTemperature
      harvestStartTime
      harvestEndTime
      plantWeight
      plantState
      dryingTime
      plantAge
    }
  }
`;

const DELETE_PLANT = gql`
  mutation DeletePlant($id: ID!) {
    deletePlant(id: $id)
  }
`;

export default {
  name: "PlantDetailsPage",
  components: { PlantDeleteModal, BaseButton },
  setup() {
    const { resolveClient } = useApolloClient();
    const apolloClient = resolveClient();

    const route = useRoute();
    const router = useRouter();

    const plantId = ref(route.params.id);
    const plantDetails = ref(null);
    const isModalOpen = ref(false);

    const isLoading = ref(true);

    const fetchPlantDetails = async () => {
      try {
        isLoading.value = true;
        const { data } = await apolloClient.query({
          query: GET_PLANT_BY_ID,
          variables: { id: plantId.value },
        });
        plantDetails.value = data.getPlantById;
        console.log(plantDetails.value, plantDetails.value.plantName);
      } catch (error) {
        console.error("Failed to get plant details:", error);
        plantDetails.value = null;
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(() => {
      fetchPlantDetails();
    });

    const openDeleteModal = () => {
      isModalOpen.value = true;
    };

    const closeDeleteModal = () => {
      isModalOpen.value = false;
    };

    const deletePlant = async () => {
      try {
        const { data } = await apolloClient.mutate({
          mutation: DELETE_PLANT,
          variables: { id: plantId.value },
        });
        console.log(data.deletePlant);
        if (data.deletePlant) {
          await apolloClient.resetStore();
          router.push({ name: "PlantListPage", params: { id: 1 } });
        }
        closeDeleteModal();
      } catch (error) {
        console.error("Failed to delete plant:", error);
      }
    };

    return {
      plantDetails,
      isModalOpen,
      isLoading,
      openDeleteModal,
      closeDeleteModal,
      deletePlant,
    };
  },
};
</script>

<style scoped>
.spinner {
  margin-block: 20px;
}

.plant {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.plant_container--one {
  display: flex;
  flex-direction: row;
}

.plant_instock {
  width: 20%;
  display: flex;
  justify-content: flex-start;
}

.plant_instock--state {
  font-size: 11px;
}

.plant_identification {
  width: 60%;
  padding-top: 20px;
}

.plant_buttons {
  display: flex;
  flex-direction: row;
  width: 20%;
  font-size: 11px;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 10px;
}

.plant_button--edit {
  color: var(--secondary-color);
}

.plant_button--edit:hover {
  color: var(--primary-color);
}

.plant_button--delete:hover {
  color: red;
}

.plant_container--two {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

.plant_info {
  width: 50%;
}

.plant_title {
  color: var(--secondary-color);
  padding-bottom: 10px;
}

.plant_data {
  display: flex;
  justify-content: flex-start;
  font-size: 13px;
  padding-left: 20%;
  padding-right: 10%;
}

.plant_distill {
  padding-block: 10px;
}

.destill_button:hover {
  color: var(--secondary-color);
}
</style>
