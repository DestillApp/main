<template>
  <!-- Title for the add destillation page -->
  <h2>Dodaj surowiec</h2>
  <!-- Carousel component for navigating between forms -->
  <v-carousel class="carousel" height="1300" :show-arrows="false" v-model="currentSlide">
    <!-- Carousel item containing the plant form -->
    <v-carousel-item>
      <plant-form></plant-form>
    </v-carousel-item>
    <!-- Carousel item containing the destillation form -->
    <v-carousel-item>
      <destillation-form></destillation-form>
    </v-carousel-item>
  </v-carousel>
</template>

<script>
import PlantForm from "@/components/plant/form/PlantForm.vue";
import DestillationForm from "@/components/destillation/DistillationForm.vue";

/**
 * @component AddDestillation
 * @description This component provides a carousel interface for adding a new distillation.
 */
export default {
  name: 'AddDestillation',
  components: { PlantForm, DestillationForm },
  data() {
    return {
      currentSlide: 0,
    };
  },
};
</script>

<style scoped>
.carousel :deep(.v-carousel__controls) {
  background: none;
  color: var(--secondary-color);
}
</style>


