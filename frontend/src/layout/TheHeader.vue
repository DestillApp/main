<template>
  <!-- Header section of the page -->
  <header class="header">
    <nav class="header__nav">
      <!-- Title of the application -->
      <h1 class="header__title">Distill It</h1>
      <!-- Navigation list -->
      <ul class="header__list" v-if="!isMobileView">
        <!-- Link to the add plant page -->
        <li v-if="isAuthenticated">
          <router-link to="/add-plant" class="header__link"
            >Dodaj surowiec</router-link
          >
        </li>
        <!-- Link to the add distillation page -->
        <li v-if="isAuthenticated">
          <router-link to="/add-distillation" class="header__link"
            >Dodaj destylację</router-link
          >
        </li>
        <li v-if="isAuthenticated && !isTabletView">
          <router-link to="/my-account" class="header__link"
            >Moje konto</router-link
          >
        </li>
        <li v-if="isAuthenticated && isTabletView">
          <a class="header__link" :class="{ 'header__link--isActive': isMyAccountActive }" @click="toggleTabletMenu">Moje konto</a>
        </li>
      </ul>
      <!-- Link to the login page -->
      <router-link to="/login" v-if="!isAuthenticated && !isLoadingAuthStatus">
        <base-button class="header__button"
          >Zaloguj się
          <!-- SVG icon for the login button -->
          <svg-icon
            type="mdi"
            :path="path"
            size="24"
            class="header__icon"
          ></svg-icon>
        </base-button>
      </router-link>
      <!-- Logout button -->
      <base-button
        class="header__button"
        v-if="
          isAuthenticated &&
          !isLoadingAuthStatus &&
          !isMobileView &&
          !isTabletView
        "
        @click="handleLogout"
        >Wyloguj się</base-button
      >
      <!-- Menu icon for mobile view -->
      <svg-icon
        v-if="isMobileView && isAuthenticated"
        class="header__menu-icon"
        type="mdi"
        :path="mdiMenu"
        size="30"
        @click="toggleMenu"
      ></svg-icon>
      <!-- Logout icon for mobile view -->
      <svg-icon
        v-if="isTabletView && isAuthenticated"
        class="header__menu-icon"
        type="mdi"
        :path="mdiLogout"
        size="30"
        @click="handleLogout"
      ></svg-icon>
    </nav>
    <!-- Mobile menu component -->
    <mobile-menu
      v-if="isMenuOpen && isMobileView"
      @toggle-menu="toggleMenu"
    ></mobile-menu>
    <!-- Tablet menu component -->
    <tablet-account-menu
      v-if="isTabletMenuOpen && isTabletView"
      @toggle-menu="toggleTabletMenu"
    ></tablet-account-menu>
  </header>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import BaseButton from "@/ui/BaseButton.vue";
import SvgIcon from "@jamescoyle/vue-icon";
import MobileMenu from "@/layout/MobileMenu.vue";
import TabletAccountMenu from "@/layout/TabletAccountMenu.vue";
import { mdiAccount, mdiMenu, mdiLogout } from "@mdi/js";

/**
 * @component TheHeader
 * @description This component renders the header section of the application, including navigation links and a login button.
 */
export default {
  name: "TheHeader",
  components: { BaseButton, SvgIcon, MobileMenu, TabletAccountMenu },
  setup() {
    // Path for the SVG icon
    const path = ref(mdiAccount);

    //useRouter hook
    const router = useRouter();
    const route = useRoute();

    // Vuex store instance
    const store = useStore();

    //Checking user authentication and loading state in vuex store
    const isAuthenticated = computed(
      () => store.getters["auth/isAuthenticated"]
    );
    const isLoadingAuthStatus = computed(
      () => store.getters["auth/isLoadingAuthStatus"]
    );

    // Reactive reference for mobile view
    const isMobileView = ref(window.innerWidth < 600);

    // Reactive reference for tablet view
    const isTabletView = ref(
      window.innerWidth >= 600 && window.innerWidth <= 1024
    );

    // Reactive reference for menu open state
    const isMenuOpen = ref(false);

    // Reactive reference for tablet menu open state
    const isTabletMenuOpen = ref(false);

    // Computed property to check if the current path starts with /my-account
    const isMyAccountActive = computed(() => route.path.startsWith("/my-account"));

    // Function to handle window resize
    const handleResize = () => {
      isMobileView.value = window.innerWidth < 600;
      isTabletView.value =
        window.innerWidth >= 600 && window.innerWidth <= 1024;
    };

    // Add event listener for window resize
    onMounted(() => {
      window.addEventListener("resize", handleResize);
    });

    // Remove event listener for window resize
    onBeforeUnmount(() => {
      window.removeEventListener("resize", handleResize);
    });

    //Handling user logout
    const handleLogout = async () => {
      await store.dispatch("auth/logout");
      console.log("logout");
      router.push("/login");
    };

    // Function to toggle menu
    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value;
      console.log("menu", isMenuOpen.value);
    };

    // Function to toggle tablet menu
    const toggleTabletMenu = () => {
      isTabletMenuOpen.value = !isTabletMenuOpen.value;
      console.log("tablet menu", isTabletMenuOpen.value);
    };

    return {
      path,
      isAuthenticated,
      isLoadingAuthStatus,
      handleLogout,
      isMobileView,
      isTabletView,
      isMenuOpen,
      isTabletMenuOpen,
      isMyAccountActive,
      mdiMenu,
      mdiLogout,
      toggleMenu,
      toggleTabletMenu,
    };
  },
};
</script>

<style scoped>
.header {
  background-color: var(--primary-color);
  box-shadow: var(--box-shadow);
}

.header__nav {
  display: flex;
  flex-direction: row;
  padding-block: 20px;
  padding-inline: 30px;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

@media (max-width: 600px) {
  .header__nav {
    padding-block: 10px;
  }
}

.header__title {
  color: var(--header-text-color);
}

.header__list {
  display: flex;
  flex-direction: row;
  gap: 35px;
}

.header__link {
  position: relative;
  text-decoration: none;
  font-size: 18px;
  color: var(--header-text-color);
}

.header__link::after {
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

.header__link:hover::after,
.header__link--isActive::after {
  transform: scaleX(1);
  transform-origin: center;
}

.router-link-active::after {
  transform: scaleX(1);
}

.header__icon {
  margin-left: 5px;
}

.header__button {
  color: var(--header-text-color);
}

.header__menu-icon {
  cursor: pointer;
  color: var(--header-text-color);
}
</style>
