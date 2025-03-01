<template>
  <div class="my-account">
    <nav v-if="!isTabletView" class="my-account__nav">
      <h3 class="my-account__title">Moje konto</h3>
      <ul class="my-account__list">
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
        <li>
          <router-link to="/my-account/my-data" class="my-account__link"
            >Moje dane</router-link
          >
        </li>
      </ul>
    </nav>
    <base-card :class="{ 'my-account__card--isList': isList }" class="my-account__card">
      <router-view></router-view>
    </base-card>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useRoute } from "vue-router";

export default {
  setup() {
    // Reactive reference for tablet view
    const isTabletView = ref(window.innerWidth <= 1024);

    // Function to handle window resize
    const handleResize = () => {
      isTabletView.value = window.innerWidth <= 1024;
    };

    // Add event listener for window resize
    onMounted(() => {
      window.addEventListener("resize", handleResize);
    });

    // Remove event listener for window resize
    onBeforeUnmount(() => {
      window.removeEventListener("resize", handleResize);
    });

    // Use route to get the current path
    const route = useRoute();

    // Computed property to check if the current path includes specific routes
    const isList = computed(() =>
      ["/my-account/plant-list", "/my-account/distillation-archives", "/my-account/distillations-in-progress"].some(path =>
        route.path.includes(path)
      )
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
