<template>
  <base-card>
    <!-- Loading spinner while data is being fetched -->
    <v-progress-circular
      v-if="isLoading"
      class="edit-archive-distillation__spinner"
      color="var(--secondary-color-results)"
      :size="60"
      :width="6"
      indeterminate
    ></v-progress-circular>
    <!-- Distillation form -->
    <form
      v-if="!isLoading"
      @submit.prevent="editDistillationArchive"
      class="edit-archive-distillation__form"
    >
      <!-- Title for the plant information form -->
      <h3 class="edit-archive-distillation__form-title">
        Edytuj informacje o procesie destylacji i wynikach
      </h3>
      <!-- Distillation plan component -->
      <results-plant
        :isFormValid="isFormValid"
        :isEditing="isEditing"
      ></results-plant>
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
      <div class="edit-archive-distillation__results-components">
        <!-- Results data component -->
        <results-data
          :isFormValid="isFormValid"
          :isEditing="isEditing"
        ></results-data>
        <!-- Results descriptions component -->
        <results-descriptions :isFormValid="isFormValid"></results-descriptions>
      </div>
      <!-- Button to submit the distilation form -->
      <base-button class="edit-archive-distillation__button" type="submit"
        >Edytuj</base-button
      >
    </form>
  </base-card>
</template>

<script>
import ResultsPlant from "../../components/results/ResultsPlant.vue";
import DistillationProcess from "../../components/destillation/DistillationProcess.vue";
import DistillationData from "../../components/destillation/DistillationData.vue";
import ResultsData from "@/components/results/ResultsData.vue";
import ResultsDescriptions from "@/components/results/ResultsDescriptions.vue";
import { editArchiveDistillationFormValidation } from "@/helpers/formsValidation";
import { initialResultsForm } from "@/helpers/formsInitialState";
import { GET_ARCHIVE_DISTILLATION_BY_ID } from "@/graphql/queries/results";
import { UPDATE_DISTILLATION_ARCHIVE } from "@/graphql/mutations/results";
import store from "@/store/index";

import { useStore } from "@/store/useStore";
import { ref, computed, onMounted, nextTick } from "vue";
import { useApolloClient, useMutation } from "@vue/apollo-composable";
import { useRoute, onBeforeRouteLeave, useRouter } from "vue-router";
import DOMPurify from "dompurify";

/**
 * @module EditArchiveDistillationPage
 * @description This component renders a distillation form and handles sending distillation data.
 */
export default {
  name: "EditArchiveDistillationPage",
  components: {
    ResultsPlant,
    DistillationProcess,
    DistillationData,
    ResultsData,
    ResultsDescriptions,
  },

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
    const router = useRouter();
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
          variables: { id: archiveId.value, formatDistillDate: false },
        });
        // Store the fetched distillation details in the distillationDetails reference
        distillationDetails.value = data.getArchiveDistillationById;
        console.log("DATA!", data.getArchiveDistillationById);
      } catch (error) {
        if (error.message === "Unauthorized") {
          await store.dispatch("auth/logout");
          router.push("/login");
        }
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

    // Using GraphQL mutation for updating the distillation archive
    const { mutate: updateDistillationArchive } = useMutation(
      UPDATE_DISTILLATION_ARCHIVE
    );

    const editDistillationArchiveForm = async () => {
      // Validate the form
      console.log("distillationForm", distillationForm.value);
      isFormValid.value = editArchiveDistillationFormValidation(
        distillationForm.value
      );
      if (isFormValid.value) {
        try {
          const form = distillationForm.value;

          const distillationArchiveFormData = {
            oilAmount: form.oilAmount
              ? Number(DOMPurify.sanitize(form.oilAmount))
              : null,
            hydrosolAmount: form.hydrosolAmount
              ? Number(DOMPurify.sanitize(form.hydrosolAmount))
              : null,
            hydrosolpH: form.hydrosolpH
              ? Number(DOMPurify.sanitize(form.hydrosolpH))
              : null,
            oilDescription: DOMPurify.sanitize(form.oilDescription),
            hydrosolDescription: DOMPurify.sanitize(form.hydrosolDescription),
            distillationData: {
              weightForDistillation: form.distillationData.weightForDistillation
                ? Number(
                    DOMPurify.sanitize(
                      form.distillationData.weightForDistillation
                    )
                  )
                : null,
              isPlantSoaked: Boolean(
                DOMPurify.sanitize(form.distillationData.isPlantSoaked)
              ),
              soakingTime: form.distillationData.soakingTime
                ? Number(DOMPurify.sanitize(form.distillationData.soakingTime))
                : null,
              weightAfterSoaking: form.distillationData.weightAfterSoaking
                ? Number(
                    DOMPurify.sanitize(form.distillationData.weightAfterSoaking)
                  )
                : null,
              isPlantShredded: Boolean(
                DOMPurify.sanitize(form.distillationData.isPlantShredded)
              ),
              distillationType: DOMPurify.sanitize(
                form.distillationData.distillationType
              ),
              distillationDate: DOMPurify.sanitize(
                form.distillationData.distillationDate
              ),
              distillationApparatus: DOMPurify.sanitize(
                form.distillationData.distillationApparatus
              ),
              waterForDistillation: form.distillationData.waterForDistillation
                ? Number(
                    DOMPurify.sanitize(
                      form.distillationData.waterForDistillation
                    )
                  )
                : null,
              distillationTime: {
                distillationHours: form.distillationData.distillationTime
                  .distillationHours
                  ? Number(
                      DOMPurify.sanitize(
                        form.distillationData.distillationTime.distillationHours
                      )
                    )
                  : null,
                distillationMinutes: form.distillationData.distillationTime
                  .distillationMinutes
                  ? Number(
                      DOMPurify.sanitize(
                        form.distillationData.distillationTime
                          .distillationMinutes
                      )
                    )
                  : null,
              },
            },
            distilledPlant: {
              plantName: DOMPurify.sanitize(form.distilledPlant.plantName),
              plantPart: DOMPurify.sanitize(form.distilledPlant.plantPart),
              plantOrigin: DOMPurify.sanitize(form.distilledPlant.plantOrigin),
              plantBuyDate: DOMPurify.sanitize(
                form.distilledPlant.plantBuyDate
              ),
              plantProducer: DOMPurify.sanitize(
                form.distilledPlant.plantProducer
              ),
              countryOfOrigin: DOMPurify.sanitize(
                form.distilledPlant.countryOfOrigin
              ),
              harvestDate: DOMPurify.sanitize(form.distilledPlant.harvestDate),
              harvestTemperature: form.distilledPlant.harvestTemperature
                ? Number(
                    DOMPurify.sanitize(form.distilledPlant.harvestTemperature)
                  )
                : null,
              harvestStartTime: DOMPurify.sanitize(
                form.distilledPlant.harvestStartTime
              ),
              harvestEndTime: DOMPurify.sanitize(
                form.distilledPlant.harvestEndTime
              ),
              plantState: DOMPurify.sanitize(form.distilledPlant.plantState),
              dryingTime: form.distilledPlant.dryingTime
                ? Number(DOMPurify.sanitize(form.distilledPlant.dryingTime))
                : null,
              plantAge: form.distilledPlant.plantAge
                ? Number(DOMPurify.sanitize(form.distilledPlant.plantAge))
                : null,
            },
          };

          // Send the GraphQL mutation to update the distillation archive
          await updateDistillationArchive({
            id: archiveId.value,
            input: distillationArchiveFormData,
          });
        } catch (error) {
          if (error.message === "Unauthorized") {
            await store.dispatch("auth/logout");
            router.push("/login");
          }
          console.log("error", isFormValid.value);
          console.error("Error editing form", error);
        }
      } else {
        console.log(isFormValid.value);
        console.log("invalid form!");
        return;
      }
    };

    const editDistillationArchive = async () => {
      try {
        await editDistillationArchiveForm();
        if (!isFormValid.value) {
          return;
        } else {
          router.push({
            name: "DistillationArchivesPage",
            params: { page: 1 },
          });
        }
      } catch (error) {
        console.error("Error editing distillation archive:", error);
      }
    };

    // Navigation guard that resets the form data in Vuex state and local storage before navigating away from the route.
    onBeforeRouteLeave(async (to, from, next) => {
      if (to.path !== from.path) {
        // Dispatch Vuex action to reset the form in store
        store.dispatch("results/setResultsForm");
        // Wait for the next tick to ensure state updates are complete
        await nextTick();
        // Removing results form value from local storage by its key
        for (const key in initialResultsForm) {
          localStorage.removeItem(key);
        }
        for (const key in initialResultsForm.distillationData) {
          localStorage.removeItem(key);
        }
        for (const key in initialResultsForm.distillationData
          .distillationTime) {
          localStorage.removeItem(key);
        }
        for (const key in initialResultsForm.distilledPlant) {
          localStorage.removeItem(key);
        }
      }
      next();
    });

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
.edit-archive-distillation__spinner {
  margin-block: 20px;
}

.edit-archive-distillation__form-title {
  margin-bottom: 30px;
}

.edit-archive-distillation__form {
  display: flex;
  flex-direction: column;
}

.edit-archive-distillation__results-components {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.edit-archive-distillation__button {
  margin-top: 30px;
  margin-bottom: 20px;
}
</style>
