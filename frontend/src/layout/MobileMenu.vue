<template>
  <div class="mobile-menu">
    <div class="mobile-menu__content">
      <button class="mobile-menu__close" @click="toggleMenu">×</button>
      <ul class="mobile-menu__list">
        <li v-if="isAuthenticated">
          <router-link to="/add-plant" class="mobile-menu__link" @click="toggleMenu">Dodaj surowiec</router-link>
        </li>
        <li v-if="isAuthenticated">
          <router-link to="/add-distillation" class="mobile-menu__link" @click="toggleMenu">Dodaj destylację</router-link>
        </li>
        <li v-if="isAuthenticated">
          <div class="mobile-menu__link" :class="{'mobile-menu__link--isActive' : isMyAccount}" @click="toggleMyAccount">Moje konto</div>
        </li>
        <li v-if="isAuthenticated && isMyAccount">
          <router-link to="/my-account/distillations-in-progress/1" class="mobile-menu__link" @click="toggleMenu">Destylacje w toku</router-link>
        </li>
        <li v-if="isAuthenticated && isMyAccount">
          <router-link to="/my-account/plant-list/1" class="mobile-menu__link" @click="toggleMenu">Magazyn surowców</router-link>
        </li>
        <li v-if="isAuthenticated && isMyAccount">
          <router-link to="/my-account/distillation-archives/1" class="mobile-menu__link" @click="toggleMenu">Archiwum destylacji</router-link>
        </li>
        <li v-if="isAuthenticated && isMyAccount">
          <router-link to="/my-account/my-data" class="mobile-menu__link" @click="toggleMenu">Moje dane</router-link>
        </li>
      </ul>
      <base-button
        class="mobile-menu__button"
        v-if="isAuthenticated && !isLoadingAuthStatus"
        @click="handleLogout"
      >Wyloguj się</base-button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import BaseButton from "@/ui/BaseButton.vue";

/**
 * @component MobileMenu
 * @description This component renders a side menu for mobile view, including navigation links and a logout button.
 */
export default {
  name: "MobileMenu",
  components: { BaseButton },
  props: ["isOpen"],
  setup(props, { emit }) {
    // Vuex store instance
    const store = useStore();

    // useRouter and useRoute hooks
    const router = useRouter();
    const route = useRoute();

    // Checking user authentication and loading state in vuex store
    const isAuthenticated = computed(
      () => store.getters["auth/isAuthenticated"]
    );
    const isLoadingAuthStatus = computed(
      () => store.getters["auth/isLoadingAuthStatus"]
    );

    // Reactive reference for "Moje konto" section
    const isMyAccount = ref(false);

    const toggleMenu = () => {
      emit("toggle-menu");
    };

    const toggleMyAccount = () => {
      isMyAccount.value = !isMyAccount.value;
    };

    // Set isMyAccount to true if the route path includes "my-account"
    onMounted(() => {
      if (route.path.includes("my-account")) {
        isMyAccount.value = true;
      }
    });

    // Handling user logout
    const handleLogout = async () => {
      await store.dispatch("auth/logout");
      console.log("logout");
      router.push("/login");
      emit("toggle-menu");
    };

    return { isAuthenticated, isLoadingAuthStatus, toggleMenu, handleLogout, isMyAccount, toggleMyAccount };
  },
};
</script>

<style scoped>
.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.mobile-menu__content {
  position: fixed;
  top: 0;
  left: 0;
  width: 70%;
  max-width: 300px;
  height: 100%;
  background-color: var(--primary-color);
  box-shadow: var(--box-shadow);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.mobile-menu__close {
  align-self: flex-end;
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--header-text-color);
}

.mobile-menu__list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.mobile-menu__link {
  text-decoration: none;
  font-size: 18px;
  color: var(--header-text-color);
  cursor: pointer;
}

.mobile-menu__link--isActive {
  font-weight: 700;
}

.mobile-menu__button {
  color: var(--header-text-color);
  align-self: center;
  margin-top: 30px;
}
</style>