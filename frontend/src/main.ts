/**
 * Entry point of the Vue application.
 * @module main
 */

import { createApp, provide, h } from "vue";
import "./assets/styles/global.css";
import router from "./router";
import store from "./store/index.js";
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client/core";
import { DefaultApolloClient } from "@vue/apollo-composable";
import { setContext } from "@apollo/client/link/context";
import Cookies from "js-cookie";

import App from "./App.vue";
import BaseButton from "./ui/BaseButton.vue";
import BaseCard from "./ui/BaseCard.vue";
import BaseTextInput from "./ui/BaseTextInput.vue";
import BaseRadioInput from "./ui/BaseRadioInput.vue";
import BaseModal from "./ui/BaseModal.vue";
import DeleteItemModal from "./components/plant/DeleteItemModal.vue";
import AskModal from "./components/AskModal.vue";

/**
 * HTTP connection to the GraphQL API.
 *
 * @type {import("@apollo/client/core").HttpLink}
 */
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URI,
  credentials: "include",
});

/**
 * Middleware to add authentication token to headers.
 *
 * @type {import("@apollo/client/link/context").ApolloLink}
 */
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from cookies
  const token = Cookies.get("authToken");

  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

/**
 * Apollo Client instance for GraphQL queries and mutations.
 *
 * @type {ApolloClient<any>}
 */
const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getPlants: {
            keyArgs: false,
            merge(_, incoming) {
              return incoming;
            },
          },
          getPlantById: {
            keyArgs: ["id", "formatDates"],
            merge(_, incoming) {
              return incoming;
            },
          },
          getDistillationById: {
            keyArgs: ["id", "formatDates"],
            merge(_, incoming) {
              return incoming;
            },
          },
          getDistillations: {
            keyArgs: false,
            merge(_, incoming) {
              return incoming;
            },
          },
          getDistillationArchives: {
            keyArgs: false,
            merge(_, incoming) {
              return incoming;
            },
          },
          getArchiveDistillationById: {
            keyArgs: ["id", "formatDistillDate"],
            merge(_, incoming) {
              return incoming;
            },
          },
          getUserDetails: {
            merge(_, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
});

// Vuetify framework
import "vuetify/styles";
import { createVuetify } from "vuetify";
import "@mdi/font/css/materialdesignicons.css";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { en, pl } from "vuetify/locale";

/**
 * Vuetify instance with localization and components.
 *
 * @type {ReturnType<typeof createVuetify>}
 */
const vuetify = createVuetify({
  components,
  directives,
  locale: {
    locale: "pl",
    fallback: "en",
    messages: { pl, en },
  },
});

/**
 * Vue application instance.
 *
 * @type {import("vue").App}
 */
const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },
  render: () => h(App),
});

import * as Sentry from "@sentry/vue";
/**
 * Initializes Sentry error tracking for the Vue application.
 */
Sentry.init({
  app,
  dsn: import.meta.env.VITE_SENTRY_DSN,
  sendDefaultPii: true,
  integrations: [Sentry.browserTracingIntegration({ router })],
});

// Use Vuetify, router, and store
app.use(vuetify);
app.use(router);
app.use(store);

// Register custom components globally
app.component("base-button", BaseButton);
app.component("base-card", BaseCard);
app.component("base-text-input", BaseTextInput);
app.component("base-radio-input", BaseRadioInput);
app.component("base-modal", BaseModal);
app.component("delete-item-modal", DeleteItemModal);
app.component("ask-modal", AskModal);

/**
 * Mounts the Vue application to the DOM.
 * @returns {void}
 */
app.mount("#app");

export { apolloClient };
