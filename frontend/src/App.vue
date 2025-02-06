<template>
  <!-- Main application layout -->
  <the-header></the-header>
  <router-view></router-view>
  <the-footer></the-footer>
</template>

<script>
import { onMounted } from "vue";
import { useStore } from "vuex";
import TheHeader from './layout/TheHeader.vue';
import TheFooter from './layout/TheFooter.vue';

/**
 * Main application component.
 * @component App
 * @description The root component of the application layout, including the header, footer, and router view.
 */
export default {
  name: 'App',
  components: {
    TheHeader, TheFooter
  },
  setup() {
    const store = useStore();

    onMounted(() => {
      store.dispatch("settings/fetchLocalStorageData", { key: "isDarkTheme" });
    });
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--text-color);
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
