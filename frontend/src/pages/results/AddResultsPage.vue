<template>
  <base-card>
    <!-- Results form -->
    <form @submit.prevent="saveResults" class="results_form">
      <!-- Title for the results form -->
      <h3 class="form_title">Wyniki destylacji</h3>
      <!-- -->
      <results-data :isFormValid="isFormValid"></results-data>
      <!-- Button to submit the results form -->
      <base-button class="button" type="submit">Zapisz wyniki destylacji</base-button>
    </form>
  </base-card>
</template>

<script>
import {ref} from 'vue';
import ResultsData from '@/components/results/ResultsData.vue';
export default {
    name: 'AddResultsPage',
    components: {
        ResultsData,
    },
    setup() {
            // Reactive reference to track form validity
    const isFormValid = ref(null);

    return {isFormValid}
    },
}
</script>