<template>
  <!-- Main application layout -->
  <the-header></the-header>
  <router-view></router-view>
</template>

<script>
import { onBeforeMount, computed, watch } from "vue";
import { useStore } from "vuex";
import TheHeader from './layout/TheHeader.vue';

/**
 * Main application component.
 * @component App
 * @description The root component of the application layout, including the header, footer, and router view.
 */
export default {
  name: 'App',
  components: {
    TheHeader
  },
  setup() {
    const store = useStore();

    const isDarkTheme = computed(() => store.getters["settings/isDarkTheme"]);

    onBeforeMount(() => {
      store.dispatch("settings/fetchLocalStorageData", { key: "isDarkTheme" });
    });

    watch(isDarkTheme, (newValue) => {
      document.documentElement.style.setProperty('--text-color', newValue ? 'var(--text-color-dark)' : 'var(--text-color)');
      document.documentElement.style.setProperty('--background-color', newValue ? 'var(--background-dark)' : 'var(--background-bright)');
    });

    return {
      isDarkTheme,
    };
  }
}
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
