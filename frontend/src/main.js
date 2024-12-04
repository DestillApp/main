/**
 * Entry point of the Vue application.
 * @module main
 */
import { createApp, provide, h } from "vue";
import "./assets/styles/global.css";
import router from "./router.js";
import store from "./store/index.js";
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client/core";
import { DefaultApolloClient } from "@vue/apollo-composable";

import App from "./App.vue";
import BaseButton from "./ui/BaseButton.vue";
import BaseCard from "./ui/BaseCard.vue";
import BaseTextInput from "./ui/BaseTextInput.vue";
import BaseRadioInput from "./ui/BaseRadioInput.vue";
import BaseModal from "./ui/BaseModal.vue";
import DeleteItemModal from "./components/plant/DeleteItemModal.vue";
import AskModal from "./components/AskModal.vue";

// Apollo for graphql
// HTTP connection to the API
const httpLink = createHttpLink({
  uri: "http://localhost:3000/graphql",
  credentials: "include",
});

const apolloClient = new ApolloClient({
  link: httpLink,
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

const vuetify = createVuetify({
  components,
  directives,
  locale: {
    locale: "pl",
    fallback: "en",
    messages: { pl, en },
  },
});

// Create the Vue application
const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },
  render: () => h(App),
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

// Mount the Vue application to the DOM
app.mount("#app");

export { apolloClient };
