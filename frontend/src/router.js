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
const AddDistillationPage = () =>
  import("./pages/distillation/AddDistillationPage.vue");
const AddResultsPage = () => import("./pages/results/AddResultsPage.vue");
const EditArchiveDistillationPage = () =>
  import("./pages/results/EditArchiveDistillationPage.vue");
const EditPlantPage = () => import("./pages/plant/EditPlantPage.vue");
const EditDistillationPage = () =>
  import("./pages/distillation/EditDistillationPage.vue");
const LoginPage = () => import("./pages/LoginPage.vue");
const RegistrationPage = () => import("./pages/RegistrationPage.vue");
const MyAccountPage = () => import("./pages/my-account/MyAccountPage.vue");
const MyDataPage = () => import("./pages/my-account/MyDataPage.vue");
const InProgressDistillationsPage = () =>
  import("./pages/my-account/InProgressDistillationsPage.vue");
const PlantListPage = () => import("./pages/my-account/PlantListPage.vue");
const DistillationArchivesPage = () =>
  import("./pages/my-account/DistillationArchivesPage.vue");
const PlantDetailsPage = () => import("./pages/plant/PlantDetailsPage.vue");
const DistillationDetailsPage = () =>
  import("./pages/distillation/DistillationDetailsPage.vue");
const ArchiveDistillationDetailsPage = () =>
  import("./pages/results/ArchiveDistillationDetailsPage.vue");

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
      path: "/add-distillation/:id?",
      name: "AddDistillationPage",
      component: AddDistillationPage,
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: "/edit-distillation/:page/:distillId/:id?",
      name: "EditDistillationPage",
      component: EditDistillationPage,
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: "/add-results/:distillId",
      name: "AddResultsPage",
      component: AddResultsPage,
      meta: { requiresAuth: true },
    },
    {
      path: "/edit-archive-distillation/:page/:archiveId",
      name: "EditArchiveDistillationPage",
      component: EditArchiveDistillationPage,
      meta: { requiresAuth: true },
    },
    {
      path: "/my-account",
      name: "MyAccountPage",
      component: MyAccountPage,
      meta: { requiresAuth: true },
      children: [
        {
          path: "distillations-in-progress/:page",
          name: "InProgressDistillationsPage",
          component: InProgressDistillationsPage,
          props: true,
          meta: { requiresAuth: true },
        },
        {
          path: "distillation-details/:page/:distillId",
          name: "DistillationDetailsPage",
          component: DistillationDetailsPage,
          props: true,
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
          path: "distillation-archives/:page",
          name: "DistillationArchivesPage",
          component: DistillationArchivesPage,
          meta: { requiresAuth: true },
        },
        {
          path: "archive-distillation/:page/:archiveId",
          name: "ArchiveDistillationDetailsPage",
          component: ArchiveDistillationDetailsPage,
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
    store.dispatch("auth/setLoadingAuthStatus", false);
  }

  try {
    console.log("all paths");
    // const isAuthenticated = await checkAuthStatus();
    const isAuthenticated = store.getters["auth/isAuthenticated"];
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    const isPublicRoute = to.matched.some((record) => record.meta.public);

    if (requiresAuth && !isAuthenticated && !isPublicRoute) {
      localStorage.removeItem("plantListLength");
      localStorage.removeItem("distillationListLength");
      localStorage.removeItem("distillationArchivesListLength");
      localStorage.removeItem("searchQuery");
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
