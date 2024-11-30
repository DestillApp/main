// no docs, no arch docs
// miesiąc, miesiące, miesięcy
<template>
    <div v-if="!isLoading" class="plant_details"> 
        <div v-if="plantDetails.plantOrigin === 'kupno'">
            <div>data zakupu: {{ plantDetails.plantBuyDate }}</div>
            <div>producent: {{ plantDetails.plantProducer }}</div>
            <div>kraj pochodzenia: {{ plantDetails.countryOfOrigin }}</div>
        </div>
        <div v-if="plantDetails.plantOrigin === 'zbiór'">
            <div>data zbioru: {{ plantDetails.harvestDate }}</div>
            <div>temperatura: {{ plantDetails.harvestTemperature }} °C</div>
            <div>
                godziny zbioru: {{ plantDetails.harvestStartTime }} -
                {{ plantDetails.harvestEndTime }}
            </div>
        </div>
        <div>stan: {{ plantDetails.plantState }}</div>
        <div v-if="plantDetails.plantState === 'podsuszony'">
            czas podsuszania: {{ plantDetails.dryingTime }} h
        </div>
        <div v-if="plantDetails.plantAge">
            wiek przy zakupie: {{ plantDetails.plantAge }} miesięcy
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useApolloClient } from "@vue/apollo-composable";
import { GET_PLANT_BY_ID } from "@/graphql/queries/plant.js";

export default {
    name: "PlantDetails",
    props: ["plantId", "distilledPlant"],
    setup(props) {
        const { resolveClient } = useApolloClient();
        const apolloClient = resolveClient();
        const isLoading = ref(true);
        const plantDetails = ref(null);
        /**
 * @async
 * @function fetchPlantDetails
 * @description Fetches the plant details by plant ID from GraphQL API.
 * @returns {Promise<void>}
 */
        const fetchPlantDetails = async () => {
            try {
                isLoading.value = true;
                const { data } = await apolloClient.query({
                    query: GET_PLANT_BY_ID,
                    variables: { id: props.plantId, formatDates: true },
                });
                plantDetails.value = data.getPlantById;
            } catch (error) {
                console.error("Failed to get plant details:", error);
                plantDetails.value = null;  
            } finally {
                isLoading.value = false;
            }
         };

        onMounted(() => {
            if (props.plantId) {
                fetchPlantDetails();
            } 
            if (props.distilledPlant) {
                plantDetails.value = props.distilledPlant;
                isLoading.value = false;
            }
    });

        return { isLoading, plantDetails };
},
}
</script>

<style scoped>
.plant_details {
    font-size: 13px;
}
</style>