<template>
  <div class="my-account">
    <!-- Navigation sidebar for account sections (hidden on tablet view) -->
    <nav v-if="!isTabletView" class="my-account__nav">
      <h3 class="my-account__title">Moje konto</h3>
      <ul class="my-account__list">
        <!-- Link to in-progress distillations -->
        <li>
          <router-link
            to="/my-account/distillations-in-progress/1"
            class="my-account__link"
            :class="{
              'my-account__link--active': $route.path.includes(
                '/my-account/distillations-in-progress'
              ),
            }"
            >Destylacje w toku</router-link
          >
        </li>
        <!-- Link to plant storage -->
        <li>
          <router-link
            to="/my-account/plant-list/1"
            class="my-account__link"
            :class="{
              'my-account__link--active': $route.path.includes(
                '/my-account/plant-list'
              ),
            }"
            >Magazyn surowców</router-link
          >
        </li>
        <!-- Link to distillation archives -->
        <li>
          <router-link
            to="/my-account/distillation-archives/1"
            class="my-account__link"
            :class="{
              'my-account__link--active': $route.path.includes(
                '/my-account/distillation-archives'
              ),
            }"
            >Archiwum destylacji</router-link
          >
        </li>
        <!-- Link to user data -->
        <li>
          <router-link to="/my-account/my-data" class="my-account__link"
            >Moje dane</router-link
          >
        </li>
      </ul>
    </nav>
    <!-- Main content card, adjusts style if displaying a list -->
    <base-card
      :class="{ 'my-account__card--isList': isList }"
      class="my-account__card"
    >
      <!-- Router view for nested account pages -->
      <router-view></router-view>
    </base-card>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useRoute } from "vue-router";

/**
 * @component MyAccountPage
 * @description Main account page layout with navigation sidebar and dynamic content area. Handles responsive navigation and highlights active sections.
 * @see handleResize
 */

export default {
  setup() {
    // Reactive reference for tablet view state
    const isTabletView = ref<boolean>(window.innerWidth <= 1024);

    /**
     * Handles window resize event to update tablet view state.
     * @function handleResize
     */
    const handleResize = (): void => {
      isTabletView.value = window.innerWidth <= 1024;
    };

    // Add event listener for window resize on mount
    onMounted(() => {
      window.addEventListener("resize", handleResize);
    });

    // Remove event listener for window resize on unmount
    onBeforeUnmount(() => {
      window.removeEventListener("resize", handleResize);
    });

    // Use route to get the current path
    const route = useRoute();

    // Computed property to check if the current path is a list view
    const isList = computed<boolean>(() =>
      [
        "/my-account/plant-list",
        "/my-account/distillation-archives",
        "/my-account/distillations-in-progress",
      ].some((path) => route.path.includes(path))
    );

    return {
      isTabletView,
      isList,
    };
  },
};
</script>

<style scoped>
.my-account {
  min-height: 95vh;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}

.my-account__title {
  font-size: 20px;
}

.my-account__nav {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 25%;
  text-align: left;
  padding-left: 30px;
  padding-top: 50px;
}

.my-account__list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.my-account__link {
  text-decoration: none;
  max-height: 24px;
}
.my-account__link:hover,
.my-account__link--active,
.router-link-active {
  font-weight: 700;
}

.my-account__card {
  margin-top: 50px;
  margin-bottom: auto;
  width: 75%;
  margin-left: 5vw;
  padding-top: 30px;
  padding-bottom: 30px;
}

.my-account__card--isList {
  margin-bottom: 100px;
  padding-top: 20px;
  padding-bottom: 20px;
}

@media (max-width: 1024px) {
  .my-account__card {
    width: 80vw;
    margin-left: 10vw;
  }
}
</style>
