/**
 * Vue router instance for managing navigation within the application.
 * @module router
 */
import { createRouter, createWebHistory } from "vue-router";
import store from "@/store/index.js";

// Regularly imported pages
import MainPage from "./pages/MainPage.vue";

// Lazy-loaded pages
const AddPlantPage = () => import("./pages/plant/AddPlantPage.vue");
const AddDistillationPage = () => import("./pages/AddDistillationPage.vue");
const AddResultsPage = () => import("./pages/AddResultsPage.vue");
const EditPlantPage = () => import("./pages/plant/EditPlantPage.vue");
const LoginPage = () => import("./pages/LoginPage.vue");
const RegistrationPage = () => import("./pages/RegistrationPage.vue");
const MyAccountPage = () => import("./pages/my-account/MyAccountPage.vue");
const MyDataPage = () => import("./pages/my-account/MyDataPage.vue");
const InProgressDistillationsPage = () =>
  import("./pages/my-account/InProgressDistillationsPage.vue");
const PlantListPage = () => import("./pages/my-account/PlantListPage.vue");
const SavedDistillationsPage = () =>
  import("./pages/my-account/SavedDistillationsPage.vue");
const PlantDetailsPage = () => import("./pages/plant/PlantDetailsPage.vue");

// Create the router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "MainPage",
      component: MainPage,
      meta: { public: true },
    },
    {
      path: "/login",
      name: "LoginPage",
      component: LoginPage,
      meta: { public: true },
    },
    {
      path: "/register",
      name: "RegistrationPage",
      component: RegistrationPage,
      meta: { public: true },
    },
    {
      path: "/add-plant",
      name: "AddPlantPage",
      component: AddPlantPage,
      meta: { requiresAuth: true },
    },
    {
      path: "/edit-plant/:page/:id",
      name: "EditPlantPage",
      component: EditPlantPage,
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: "/add-distillation",
      name: "AddDistillationPage",
      component: AddDistillationPage,
      meta: { requiresAuth: true },
    },
    {
      path: "/add-results",
      name: "AddResultsPage",
      component: AddResultsPage,
      meta: { requiresAuth: true },
    },
    {
      path: "/my-account",
      name: "MyAccountPage",
      component: MyAccountPage,
      meta: { requiresAuth: true },
      children: [
        {
          path: "distillations-in-progress",
          name: "InProgressDistillationsPage",
          component: InProgressDistillationsPage,
          meta: { requiresAuth: true },
        },
        {
          path: "plant-list/:page",
          name: "PlantListPage",
          component: PlantListPage,
          props: true,
          meta: { requiresAuth: true },
        },
        {
          path: "plant-details/:page/:id",
          name: "PlantDetailsPage",
          component: PlantDetailsPage,
          props: true,
          meta: { requiresAuth: true },
        },
        {
          path: "saved-distillations",
          name: "SavedDistillationsPage",
          component: SavedDistillationsPage,
          meta: { requiresAuth: true },
        },
        {
          path: "my-data",
          name: "MyDataPage",
          component: MyDataPage,
          meta: { requiresAuth: true },
        },
      ],
    },
  ],
});

let authInitialized = false;

router.beforeEach(async (to, from, next) => {
  if (!authInitialized) {
    console.log("Initializing auth status");
    await store.dispatch("auth/fetchUserAuthenticationStatus");
    authInitialized = true;
  }

  try {
    // const isAuthenticated = await checkAuthStatus();
    const isAuthenticated = store.getters["auth/isAuthenticated"];
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    const isPublicRoute = to.matched.some((record) => record.meta.public);

    if (requiresAuth && !isAuthenticated && !isPublicRoute) {
      next({
        path: "/login",
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  } catch (error) {
    console.error("Error in navigation guard:", error);
    next(false);
  }
});

export default router;
