<template>
  <div class="results-distillation">
    <!-- Display distillation details -->
    <div class="results-distillation__details">
      <div class="results-distillation__details-process">
        <p>
          <strong>data destylacji:</strong>
          {{ resultsForm.distillationData.distillationDate }}
        </p>
        <p>
          <strong>typ destylacji:</strong>
          {{ resultsForm.distillationData.distillationType }}
        </p>
        <p>
          <strong>ilość wody użyta do destylacji:</strong>
          {{ resultsForm.distillationData.waterForDistillation }} l
        </p>
      </div>
      <div class="results-distillation__details-plant">
        <p>
          <strong class>destylowany surowiec:</strong>
          {{ resultsForm.distilledPlant.plantName }}
        </p>
        <p>
          <strong>część surowca:</strong>
          {{ resultsForm.distilledPlant.plantPart }}
        </p>
        <p>
          <strong>ilość surowca użyta do destylacji:</strong>
          {{ resultsForm.distillationData.weightForDistillation }} kg
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed } from "vue";
import { useStore } from "@/store/useStore";
import { ResultsForm } from "@/types/forms/resultsForm";

export default {
  name: "ResultsDistillation",
  setup() {
    const store = useStore();

    // Computed property to get the results form data from Vuex store
    const resultsForm = computed<ResultsForm>(
      () => store.getters["results/resultsForm"]
    );

    return {
      resultsForm,
    };
  },
};
</script>

<style scoped>
.results-distillation__details {
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.results-distillation__details-process,
.results-distillation__details-plant {
  width: 50%;
}

.results-distillation__details-plant p strong {
  color: var(--primary-color);
}

.results-distillation__details-process p strong {
  color: var(--primary-color-distillation);
}

@media (max-width: 1024px) {
  .results-distillation__details {
    flex-direction: column;
    gap: 30px;
  }
  .results-distillation__details-process,
  .results-distillation__details-plant {
    width: 100%;
  }
}
</style>
