<template>
  <base-card>
    <!-- Loading spinner while data is being fetched -->
    <v-progress-circular
      v-if="isLoading"
      class="spinner"
      color="var(--secondary-color-results)"
      :size="60"
      :width="6"
      indeterminate
    ></v-progress-circular>
    <!-- Distillation form -->
    <form
      v-if="!isLoading"
      @submit.prevent="editDistillationArchive"
      class="archivedistillation_form"
    >
      <!-- Title for the plant information form -->
      <h3 class="form_title">
        Edytuj informacje o procesie destylacji i wynikach
      </h3>
      <!-- Distillation plan component -->
      <results-plant :isFormValid="isFormValid" :isEditing="isEditing"></results-plant>
      <!-- Distillation process component -->
      <distillation-process
        :isFormValid="isFormValid"
        :isEditing="isEditing"
      ></distillation-process>
      <!-- Distillation data component -->
      <distillation-data
        :isFormValid="isFormValid"
        :isEditing="isEditing"
      ></distillation-data>
      <div class="results_components">
      <!-- Results data component -->
      <results-data :isFormValid="isFormValid" :isEditing="isEditing"></results-data>
            <!-- Results descriptions component -->
      <results-descriptions :isFormValid="isFormValid"></results-descriptions>
      </div>
      <!-- Button to submit the distilation form -->
      <base-button class="button" type="submit">Edytuj</base-button>
    </form>
  </base-card>
</template>

<script>
import ResultsPlant from "../../components/results/ResultsPlant.vue";
import DistillationProcess from "../../components/destillation/DistillationProcess.vue";
import DistillationData from "../../components/destillation/DistillationData.vue";
import ResultsData from "@/components/results/ResultsData.vue";
import ResultsDescriptions from "@/components/results/ResultsDescriptions.vue";
import { distillationFormValidation } from "@/helpers/formsValidation";
import store from "@/store/index";

import { GET_ARCHIVE_DISTILLATION_BY_ID } from "@/graphql/queries/results";
import { useStore } from "vuex";
import { ref, computed, onMounted } from "vue";
import { useApolloClient } from "@vue/apollo-composable";
import { useRoute } from "vue-router";
// import DOMPurify from "dompurify";

/**
 * @module EditArchiveDistillationPage
 * @description This component renders a distillation form and handles sending distillation data.
 */
export default {
  name: "EditArchiveDistillationPage",
  components: { ResultsPlant, DistillationProcess, DistillationData, ResultsData, ResultsDescriptions },

  // Navigation guard that handles the logic before navigating to this route
  beforeRouteEnter(to, from, next) {
    //check if the route comes from another named route, then update the store
    if (from && from.name) {
      store.dispatch("setComingFromRoute", true);
    } else {
      store.dispatch("setComingFromRoute", false);
    }
    next();
  },

  setup() {
    const { resolveClient } = useApolloClient();
    const apolloClient = resolveClient();
    // Vuex store instance
    const store = useStore();

    // Router object for navigation
    // const router = useRouter();
    const route = useRoute();

    // Reactive reference to store the distillation ID and page number from the route
    const archiveId = ref(route.params.archiveId);
    // const page = ref(Number(route.params.page));

    // Computed property to get distillation form data from Vuex store
    const distillationForm = computed(
      () => store.getters["results/resultsForm"]
    );

    // Reactive reference to store fetched distillation details
    const distillationDetails = ref(null);

    // Reactive reference to track form validity
    const isFormValid = ref(null);
    // Reactive reference for loading state
    const isLoading = ref(true);
    // Reactive reference to pass that this is an edit form
    const isEditing = ref(true);

    const isResultsForm = ref(true);

    // Computed property to get the value from Vuex store
    const comingFromRoute = computed(() => store.getters.comingFromRoute);

    const fetchDistillationDetails = async () => {
      try {
        isLoading.value = true;
        // Make a query to fetch distillation details by distillation ID from archive
        const { data } = await apolloClient.query({
          query: GET_ARCHIVE_DISTILLATION_BY_ID,
          variables: { id: archiveId.value },
        });
        // Store the fetched distillation details in the distillationDetails reference
        distillationDetails.value = data.getArchiveDistillationById;
        console.log("DATA!", data.getArchiveDistillationById);
      } catch (error) {
        console.error("Failed to get archive distillation details:", error);
        distillationDetails.value = null;
      } finally {
        // Once the process is complete, set loading to false
        isLoading.value = false;
      }
    };

    // Lifecycle hook to reset form validity on component mount
    onMounted(async () => {
      isFormValid.value = null;
      if (comingFromRoute.value) {
        await fetchDistillationDetails();
        store.dispatch("results/setValue", {
          input: "oilAmount",
          value: distillationDetails.value.oilAmount,
        });
        store.dispatch("results/setValue", {
          input: "hydrosolAmount",
          value: distillationDetails.value.hydrosolAmount,
        });
        store.dispatch("results/setValue", {
          input: "hydrosolpH",
          value: distillationDetails.value.hydrosolpH,
        });
        store.dispatch("results/setValue", {
          input: "oilDescription",
          value: distillationDetails.value.oilDescription,
        });
        store.dispatch("results/setValue", {
          input: "hydrosolDescription",
          value: distillationDetails.value.hydrosolDescription,
        });
        store.dispatch("results/setDistillationDataValue", {
          input: "weightForDistillation",
          value:
            distillationDetails.value.distillationData.weightForDistillation,
        });
        store.dispatch("results/setDistillationDataValue", {
          input: "isPlantSoaked",
          value: distillationDetails.value.distillationData.isPlantSoaked,
        });
        store.dispatch("results/setDistillationDataValue", {
          input: "soakingTime",
          value: distillationDetails.value.distillationData.soakingTime,
        });
        store.dispatch("results/setDistillationDataValue", {
          input: "weightAfterSoaking",
          value: distillationDetails.value.distillationData.weightAfterSoaking,
        });
        store.dispatch("results/setDistillationDataValue", {
          input: "isPlantShredded",
          value: distillationDetails.value.distillationData.isPlantShredded,
        });
        store.dispatch("results/setDistillationDataValue", {
          input: "distillationType",
          value: distillationDetails.value.distillationData.distillationType,
        });
        store.dispatch("results/setDistillationDataValue", {
          input: "distillationDate",
          value: distillationDetails.value.distillationData.distillationDate,
        });
        store.dispatch("results/setDistillationDataValue", {
          input: "distillationApparatus",
          value:
            distillationDetails.value.distillationData.distillationApparatus,
        });
        store.dispatch("results/setDistillationDataValue", {
          input: "waterForDistillation",
          value:
            distillationDetails.value.distillationData.waterForDistillation,
        });
        store.dispatch("results/setDistillationTime", {
          input: "distillationHours",
          value:
            distillationDetails.value.distillationData.distillationTime
              .distillationHours,
        });
        store.dispatch("results/setDistillationTime", {
          input: "distillationMinutes",
          value:
            distillationDetails.value.distillationData.distillationTime
              .distillationMinutes,
        });
        store.dispatch("results/setPlantDataValue", {
          input: "countryOfOrigin",
          value: distillationDetails.value.distilledPlant.countryOfOrigin,
        });
        store.dispatch("results/setPlantDataValue", {
          input: "dryingTime",
          value: distillationDetails.value.distilledPlant.dryingTime,
        });
        store.dispatch("results/setPlantDataValue", {
          input: "harvestDate",
          value: distillationDetails.value.distilledPlant.harvestDate,
        });
        store.dispatch("results/setPlantDataValue", {
          input: "harvestEndTime",
          value: distillationDetails.value.distilledPlant.harvestEndTime,
        });
        store.dispatch("results/setPlantDataValue", {
          input: "harvestStartTime",
          value: distillationDetails.value.distilledPlant.harvestStartTime,
        });
        store.dispatch("results/setPlantDataValue", {
          input: "harvestTemperature",
          value: distillationDetails.value.distilledPlant.harvestTemperature,
        });
        store.dispatch("results/setPlantDataValue", {
          input: "plantAge",
          value: distillationDetails.value.distilledPlant.plantAge,
        });
        store.dispatch("results/setPlantDataValue", {
          input: "plantBuyDate",
          value: distillationDetails.value.distilledPlant.plantBuyDate,
        });
        store.dispatch("results/setPlantDataValue", {
          input: "plantName",
          value: distillationDetails.value.distilledPlant.plantName,
        });
        store.dispatch("results/setPlantDataValue", {
          input: "plantOrigin",
          value: distillationDetails.value.distilledPlant.plantOrigin,
        });
        store.dispatch("results/setPlantDataValue", {
          input: "plantPart",
          value: distillationDetails.value.distilledPlant.plantPart,
        });
        store.dispatch("results/setPlantDataValue", {
          input: "plantProducer",
          value: distillationDetails.value.distilledPlant.plantProducer,
        });
        store.dispatch("results/setPlantDataValue", {
          input: "plantState",
          value: distillationDetails.value.distilledPlant.plantState,
        });

        console.log("all data!", distillationDetails.value);
      } else {
        // If not coming from another route, set loading to false
        isLoading.value = false;
      }
      console.log("vuex form", distillationForm.value);
    });

    const editDistillationArchive = async () => {
      // Validate the form
      isFormValid.value = distillationFormValidation(distillationForm.value);
      if (isFormValid.value) {
        try {
          // Logic for editing distillation archive will go here
          console.log(
            "Form is valid, proceed with editing distillation archive"
          );
        } catch (error) {
          console.log("error", isFormValid.value);
          console.error("Error editing form", error);
        }
      } else {
        console.log(isFormValid.value);
        console.log("invalid form!");
        return;
      }
    };

    return {
      editDistillationArchive,
      distillationDetails,
      isFormValid,
      isLoading,
      isEditing,
      isResultsForm,
      comingFromRoute,
    };
  },
};
</script>

<style scoped>
.form_title {
  margin-bottom: 30px;
}

.archivedistillation_form {
  display: flex;
  flex-direction: column;
}

.results_components {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.button {
  margin-top: 30px;
  margin-bottom: 20px;
}
</style>
