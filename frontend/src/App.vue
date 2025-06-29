<template>
  <!-- Main application layout -->
  <the-header></the-header>
  <!-- Route outlet for page components -->
  <router-view></router-view>
</template>

<script lang="ts">
import { onBeforeMount, computed, watch } from "vue";
import { useStore } from "@/store/useStore";
import TheHeader from "./layout/TheHeader.vue";

/**
 * @component App
 * @description The root component of the application layout, including the header and router view. Handles theme initialization and switching.
 */

export default {
  name: "App",
  components: {
    TheHeader,
  },
  setup() {
    const store = useStore();

    // Computed property for dark theme state
    const isDarkTheme = computed<boolean>(
      () => store.getters["settings/isDarkTheme"]
    );

    // Fetch dark theme setting from local storage before mount
    onBeforeMount(() => {
      store.dispatch("settings/fetchLocalStorageData", { key: "isDarkTheme" });
    });

    // Watch for changes in dark theme and update CSS variables accordingly.
    watch(isDarkTheme, (newValue) => {
      document.documentElement.style.setProperty(
        "--text-color",
        newValue ? "var(--text-color-dark)" : "var(--text-color)"
      );
      document.documentElement.style.setProperty(
        "--background-color",
        newValue ? "var(--background-dark)" : "var(--background-bright)"
      );
    });

    return {
      isDarkTheme,
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  min-height: 100vh;
  color: var(--text-color);
  background-color: var(--background-color);
  display: flex;
  flex-direction: column;
}

ul {
  list-style-type: none;
}

a,
a:visited {
  text-decoration: none;
  color: inherit;
}
</style>
