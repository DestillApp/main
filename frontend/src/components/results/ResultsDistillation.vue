<template>
  <div class="results_distillation">
    <!-- Display distillation details -->
    <div class="distillation_details">
      <div class="distillation_details--process">
        <p>
          <strong class="distillation_color">data destylacji:</strong>
          {{ resultsForm.distillationData.distillationDate }}
        </p>
        <p>
          <strong class="distillation_color">typ destylacji:</strong>
          {{ resultsForm.distillationData.distillationType }}
        </p>
        <p>
          <strong class="distillation_color"
            >ilość wody użyta do destylacji:</strong
          >
          {{ resultsForm.distillationData.waterForDistillation }} l
        </p>
      </div>
      <div class="distillation_details--plant">
        <p>
          <strong class="plant_color">destylowany surowiec:</strong>
          {{ resultsForm.choosedPlantName }}
        </p>
        <p>
          <strong class="plant_color">część surowca:</strong>
          {{ resultsForm.choosedPlantPart }}
        </p>
        <p>
          <strong class="plant_color"
            >ilość surowca użyta do destylacji:</strong
          >
          {{ resultsForm.distillationData.weightForDistillation }} kg
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  name: "ResultsDistillation",
  setup() {
    const store = useStore();

    // Computed property to get the results form data from Vuex store
    const resultsForm = computed(() => store.getters["results/resultsForm"]);

    return {
      resultsForm,
    };
  },
};
</script>

<style scoped>
.distillation_details {
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.distillation_details--process,
.distillation_details--plant {
  width: 50%;
}

.plant_color {
  color: var(--primary-color);
}

.distillation_color {
  color: var(--primary-color-distillation);
}
</style>