<template>
  <base-card>
    <!-- Results form -->
    <form @submit.prevent="saveResults" class="results_form">
      <!-- Title for the results form -->
      <h3 class="form_title">Wyniki destylacji</h3>
      <!-- Results data component -->
      <results-data :isFormValid="isFormValid"></results-data>
      <!-- Results descriptions component -->
      <results-descriptions :isFormValid="isFormValid"></results-descriptions>
      <!-- Button to submit the results form -->
      <base-button class="button" type="submit"
        >Zapisz wyniki destylacji</base-button
      >
    </form>
  </base-card>
</template>

<script>
import { ref } from "vue";
import ResultsData from "@/components/results/ResultsData.vue";
import ResultsDescriptions from "@/components/results/ResultsDescriptions.vue";

export default {
  name: "AddResultsPage",
  components: {
    ResultsData,
    ResultsDescriptions,
  },
  setup() {
    // Reactive reference to track form validity
    const isFormValid = ref(null);

    return { isFormValid };
  },
};
</script>

<style scoped>
.results_form {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.button {
  margin-bottom: 20px;
}
</style>