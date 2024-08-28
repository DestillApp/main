/**
 * Vue router instance for managing navigation within the application.
 * @module router
 */
import { createRouter, createWebHistory } from "vue-router";
import store from "@/store/index.js";

// Regularly imported pages
import MainPage from "./pages/MainPage.vue";

// Lazy-loaded pages
const AddPlant = () => import("./pages/plant/AddPlant.vue");
const AddDestillation = () => import("./pages/AddDestillation.vue");
const LoginPage = () => import("./pages/LoginPage.vue");
const RegistrationPage = () => import("./pages/RegistrationPage.vue");
const MyAccountPage = () => import("./pages/my-account/MyAccountPage.vue");
const MyDataPage = () => import("./pages/my-account/MyDataPage.vue");
const InProgressDestillationsPage = () =>
  import("./pages/my-account/InProgressDistillationsPage.vue");
const PlantListPage = () => import("./pages/my-account/PlantListPage.vue");
const SavedDestillationsPage = () =>
  import("./pages/my-account/SavedDestillationsPage.vue");

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
      name: AddPlant,
      component: AddPlant,
      meta: { requiresAuth: true },
    },
    {
      path: "/add-destillation",
      name: AddDestillation,
      component: AddDestillation,
      meta: { requiresAuth: true },
    },
    {
      path: "/my-account",
      name: MyAccountPage,
      component: MyAccountPage,
      meta: { requiresAuth: true },
      children: [
        {
          path: "destillations-in-progress",
          name: InProgressDestillationsPage,
          component: InProgressDestillationsPage,
          meta: { requiresAuth: true },
        },
        {
          path: "plant-list",
          name: PlantListPage,
          component: PlantListPage,
          meta: { requiresAuth: true },
        },
        {
          path: "saved-destillations",
          name: SavedDestillationsPage,
          component: SavedDestillationsPage,
          meta: { requiresAuth: true },
        },
        {
          path: "my-data",
          name: MyDataPage,
          component: MyDataPage,
          meta: { requiresAuth: true },
        },
      ],
    },
  ],
});

let authInitialized = false;

router.beforeEach(async (to, from, next) => {
  console.log("Navigation guard called");

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
    console.log(isAuthenticated);

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

// const VERIFY_AUTH = gql`
//   query VerifyAuth {
//     verifyAuth {
//       isAuthenticated
//     }
//   }
// `;

// export async function checkAuthStatus() {
//   console.log("checkAuthStatus called");
//   try {
//     const { data } = await apolloClient.query({
//       query: VERIFY_AUTH,
//     });
//     return data.verifyAuth.isAuthenticated;
//   } catch (error) {
//     return false;
//   }
// }

// Vuex store
