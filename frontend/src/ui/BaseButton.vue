<template>
  <!-- Custom button component using Vuetify's v-btn -->
  <v-btn class="button" variant="outlined">
    <!-- Slot for button content -->
    <slot></slot>
  </v-btn>
</template>

<script lang="ts">
/**
 * @component BaseButton
 * @description A custom button component that uses Vuetify's v-btn component with an outlined variant. It accepts and displays content passed through a slot.
 */

export default {
  name: "BaseButton",
  setup(props: Props) {},
};
</script>

<style scoped>
.button {
  border: solid 2px;
}
</style>
