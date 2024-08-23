<template>
  <!-- Header section of the page -->
  <header class="header">
    <nav class="nav">
      <!-- Title of the application -->
      <h1>Distill It</h1>
      <!-- Navigation list -->
      <ul class="list">
        <!-- Link to the add plant page -->
        <li v-if="isAuthenticated">
          <router-link to="/add-plant">Dodaj surowiec</router-link>
        </li>
        <!-- Link to the add distillation page -->
        <li v-if="isAuthenticated">
          <router-link to="/add-destillation">Dodaj destylację</router-link>
        </li>
        <li v-if="isAuthenticated">
          <router-link to="/my-account">Moje konto</router-link>
        </li>
      </ul>
      <!-- Link to the login page -->
      <router-link to="/login" v-if="!isAuthenticated">
        <base-button>Zaloguj się
          <!-- SVG icon for the login button -->
          <svg-icon type="mdi" :path="path" size="18" class="icon"></svg-icon>
        </base-button>
      </router-link>
      <!-- Logout button -->
        <base-button v-if="isAuthenticated" @click="handleLogout">Wyloguj się</base-button>
    </nav>
  </header>
</template>

<script>
import { ref } from "vue";
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from "vue-router";
import BaseButton from "@/ui/BaseButton.vue";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiAccount } from "@mdi/js";

/**
 * @component TheHeader
 * @description This component renders the header section of the application, including navigation links and a login button.
 */
export default {
  name: "TheHeader",
  components: { BaseButton, SvgIcon },
  setup() {
    // Path for the SVG icon
    const path = ref(mdiAccount);

    //useRouter hook
    const router = useRouter();

      // Vuex store instance
      const store = useStore();

      //Checking user authentication state in vuex store
    const isAuthenticated = computed(() => store.getters["auth/isAuthenticated"]);

    //Handling user logout
    const handleLogout = async () => {
      await store.dispatch('auth/logout');
      console.log('logout');
      router.push('/login');
    }

    return { path, isAuthenticated, handleLogout };
  },
};
</script>

<style scoped>
.header {
  background-color: var(--primary-color);
  box-shadow: var(--box-shadow);
}

.nav {
  display: flex;
  flex-direction: row;
  padding: 10px;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.list {
  display: flex;
  flex-direction: row;
  gap: 20px;
}

.icon {
  margin-left: 5px;
}
</style>