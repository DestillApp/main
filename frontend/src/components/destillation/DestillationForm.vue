<template>
  <base-card>
    <!-- Title for the plant information form -->
    <h3 class="plant_title">Informacje o procesie destylacji</h3>
    <!-- Destillation form -->
    <form>
      <!-- Button to submit the destilation form -->
      <base-button type="submit">Zapisz</base-button>
      <!-- Button to submit and go to the distillation results form -->
      <base-button type="submit"
        >Zapisz i przejdź do formularza wyników destylacji</base-button
      >
    </form>
  </base-card>
</template>

<script>
export default {
  name: "DestillationForm",

  /**
* @module DestillationForm
* @description This component renders a destillation form and handles sending destillation data.
*/
  setup() {},
};
</script>