<template>
  <!-- This is a custom button component using Vuetify's v-btn with an outlined variant. -->
  <v-btn class="button" variant="outlined">
    <!-- Slot to display the content passed to the button component. -->
    <slot></slot>
  </v-btn>
</template>

<script>
/**
 * @component BaseButton
 * @description A custom button component that uses Vuetify's v-btn component with an outlined variant. It accepts and displays content passed through a slot.
 */
export default {
  setup() {
    // The setup function is empty as this component does not require reactive data, methods, or lifecycle hooks.
  },
};
</script>

<style scoped>
.button {
  border: solid 2px;
}
</style>
