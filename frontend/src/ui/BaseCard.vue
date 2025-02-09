<template>
  <!-- The root element of the card component, providing a styled container for its content -->
  <div :class="['card', { 'dark-card': isDarkTheme }]">
    <!-- Slot to display the content passed to the card component -->
    <slot></slot>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

/**
 * @component BaseCard
 * @description A custom card component that provides a styled container for its content. The content is passed through a slot.
 */
export default {
  setup() {
    const store = useStore();
    const isDarkTheme = computed(() => store.getters["settings/isDarkTheme"]);

    return {
      isDarkTheme,
    };
  },
};
</script>

<style scoped>
.card {
    width: 80%;
    background-color: var(--background-bright);
    box-shadow: var(--box-shadow);
    border-radius: var(--card-border-radius);
    margin-top: 30px;
    margin-bottom: 30px;
    margin-right: 10vw; 
    margin-left: 10vw;
    padding-top: 20px;
    padding-bottom: 20px;
    padding-right: 30px;
    padding-left: 30px;
}

.dark-card {
  background-color: var(--background-dark);
  color: var(--text-color-dark);
  box-shadow: var(--box-shadow-dark);
}
</style>