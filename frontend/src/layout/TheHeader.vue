<template>
  <!-- Header section of the page -->
  <header class="header">
    <nav class="nav">
      <!-- Title of the application -->
      <h1 class="title">Distill It</h1>
      <!-- Navigation list -->
      <ul class="list">
        <!-- Link to the add plant page -->
        <li v-if="isAuthenticated">
          <router-link to="/add-plant" class="link">Dodaj surowiec</router-link>
        </li>
        <!-- Link to the add distillation page -->
        <li v-if="isAuthenticated">
          <router-link to="/add-distillation" class="link">Dodaj destylację</router-link>
        </li>
        <li v-if="isAuthenticated">
          <router-link to="/my-account" class="link">Moje konto</router-link>
        </li>
      </ul>
      <!-- Link to the login page -->
      <router-link to="/login" v-if="!isAuthenticated && !isLoadingAuthStatus">
        <base-button
          >Zaloguj się
          <!-- SVG icon for the login button -->
          <svg-icon type="mdi" :path="path" size="18" class="icon"></svg-icon>
        </base-button>
      </router-link>
      <!-- Logout button -->
      <base-button
      class="base-button"
        v-if="isAuthenticated && !isLoadingAuthStatus"
        @click="handleLogout"
        >Wyloguj się</base-button
      >
    </nav>
  </header>
</template>

<script>
import { ref } from "vue";
import { computed } from "vue";
import { useStore } from "vuex";
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

    //Checking user authentication and loading state in vuex store
    const isAuthenticated = computed(
      () => store.getters["auth/isAuthenticated"]
    );
    const isLoadingAuthStatus = computed(
      () => store.getters["auth/isLoadingAuthStatus"]
    );

    //Handling user logout
    const handleLogout = async () => {
      await store.dispatch("auth/logout");
      console.log("logout");
      router.push("/login");
    };

    return { path, isAuthenticated, isLoadingAuthStatus, handleLogout };
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

.title {
  color: var(--header-text-color);
}

.list {
  display: flex;
  flex-direction: row;
  gap: 35px;
}

.link {
  position: relative;
  text-decoration: none;
  font-size: 18px;
  color: var(--header-text-color);
}

.link::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 1px;
  background-color: var(--header-text-color);
  bottom: -3px;
  left: 0;
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.3s ease-out;
}

.link:hover::after {
  transform: scaleX(1);
  transform-origin: center;
}

.router-link-active::after{
  transform: scaleX(1);
}

.icon {
  margin-left: 5px;
}

.base-button {
  color: var(--header-text-color);
}
</style>
