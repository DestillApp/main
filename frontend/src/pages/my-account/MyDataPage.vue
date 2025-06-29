<template>
  <div>
    <h3>Moje dane</h3>
    <!-- User info section -->
    <div class="my-data__user-info">
      <p>nazwa użytkownika: {{ username }}</p>
      <p>adres e-mail: {{ email }}</p>
    </div>
    <!-- Distillers section -->
    <div class="my-data__distillers">
      <h4 class="my-data__distillers-title">Moje destylatory:</h4>
      <!-- List of distillers -->
      <ul v-if="distillers.length > 0" class="my-data__distiller-list">
        <li
          v-for="distiller in distillers"
          :key="distiller.id"
          class="my-data__distiller-item"
        >
          <h5 class="my-data__distiller-title">Destylator</h5>
          <div class="my-data__distiller-columns">
            <div class="my-data__distiller-info">
              <p>Materiał: {{ distiller.material }}</p>
              <p>Pojemność: {{ distiller.capacity }} l</p>
              <p>Ogrzewanie: {{ distiller.heating }}</p>
            </div>
            <!-- Button to delete distiller -->
            <button
              @click="openDeleteModal(distiller.id)"
              class="my-data__distiller-delete"
            >
              Usuń
            </button>
          </div>
        </li>
      </ul>
      <!-- Message if no distillers -->
      <p v-else class="my-data__distiller-none">
        Brak zapisanych destylatorów.
      </p>
      <base-button class="my-data__distillers-button" @click="openDistillerForm"
        >Dodaj nowy destylator</base-button
      >
    </div>
    <!-- Settings section -->
    <div class="my-data__settings">
      <h4 class="my-data__settings-title">Ustawienia:</h4>
      <div class="my-data__settings-theme">
        <!-- Theme switch info -->
        <p v-if="isDarkTheme">Motyw ciemny aplikacji włączony</p>
        <p v-if="!isDarkTheme">Motyw ciemny aplikacji wyłączony</p>
        <!-- Theme switch -->
        <v-switch
          v-model="isDarkTheme"
          hide-details
          color="var(--secondary-color)"
        ></v-switch>
      </div>
      <!-- Button to open password change form -->
      <base-button
        class="my-data__settings-button"
        @click="openPasswordChangeForm"
        >Zmień hasło</base-button
      >
    </div>
    <!-- Distiller form modal -->
    <distiller-form
      v-if="isDistillerFormOpen"
      @close-modal="closeDistillerForm"
    ></distiller-form>
    <!-- Delete item modal -->
    <delete-item-modal
      v-if="isDeleteModalOpen"
      @close-delete-modal="closeDeleteModal"
      @delete-item="deleteDistiller"
      :distiller="selectedDistillerId"
    ></delete-item-modal>
    <!-- Password change form modal -->
    <password-change-form
      v-if="isPasswordChangeFormOpen"
      @close-modal="closePasswordChangeForm"
    ></password-change-form>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, computed, onBeforeMount, watch } from "vue";
import { useApolloClient } from "@vue/apollo-composable";
import { useRouter } from "vue-router";
import { useStore } from "@/store/useStore";
import { GET_USER_DETAILS } from "@/graphql/queries/auth";
import { UPDATE_DARK_THEME } from "@/graphql/mutations/settings";
import BaseButton from "@/ui/BaseButton.vue";
import DistillerForm from "@/components/DistillerForm.vue";
import DeleteItemModal from "@/components/plant/DeleteItemModal.vue";
import PasswordChangeForm from "@/components/PasswordChangeForm.vue";
import type { Distiller } from "@/store/settings/index";
import { handleUserError } from "@/helpers/errorHandling";
import * as Sentry from "@sentry/vue";

/**
 * @component MyDataPage
 * @description Displays user data, list of distillers, theme settings, and allows managing distillers and password. Handles fetching user info, theme switching, and modal dialogs.
 * @see fetchUserDetails
 * @see openDistillerForm
 * @see closeDistillerForm
 * @see openDeleteModal
 * @see closeDeleteModal
 * @see deleteDistiller
 * @see openPasswordChangeForm
 * @see closePasswordChangeForm
 */

export default {
  components: {
    BaseButton,
    DistillerForm,
    DeleteItemModal,
    PasswordChangeForm,
  },
  setup() {
    const { resolveClient } = useApolloClient();
    const apolloClient = resolveClient();
    const store = useStore();

    // Router object for navigation
    const router = useRouter();

    // User info refs
    const username = ref<string>("");
    const email = ref<string>("");

    // Computed property for distillers list from Vuex store
    const distillers = computed<Distiller[]>(
      () => store.getters["settings/distillerList"]
    );

    // Modal state refs
    const isDeleteModalOpen = ref<boolean>(false);
    const selectedDistillerId = ref<string>("");

    const isDistillerFormOpen = ref<boolean>(false);
    const isPasswordChangeFormOpen = ref<boolean>(false);

    // Theme state refs
    const isDarkTheme = ref<boolean>(false);
    const isDarkThemeStored = computed<boolean>(
      () => store.getters["settings/isDarkTheme"]
    );

    /**
     * Fetches user details (username and email) from the server.
     * @async
     * @function fetchUserDetails
     * @returns {Promise<void>}
     */
    const fetchUserDetails = async (): Promise<void> => {
      try {
        const { data } = await apolloClient.query({
          query: GET_USER_DETAILS,
          fetchPolicy: "network-only",
        });
        username.value = data.getUserDetails.username;
        email.value = data.getUserDetails.email;
      } catch (error: any) {
        await handleUserError(error);
      }
    };

    /**
     * Opens the distiller form modal.
     * @function openDistillerForm
     */
    const openDistillerForm = (): void => {
      isDistillerFormOpen.value = true;
    };

    /**
     * Closes the distiller form modal.
     * @function closeDistillerForm
     */
    const closeDistillerForm = (): void => {
      isDistillerFormOpen.value = false;
    };

    /**
     * Opens the delete distiller modal for a given distiller id.
     * @function openDeleteModal
     * @param {string} id - The distiller id to delete.
     */
    const openDeleteModal = (id: string): void => {
      selectedDistillerId.value = id;
      isDeleteModalOpen.value = true;
    };

    /**
     * Closes the delete distiller modal.
     * @function closeDeleteModal
     */
    const closeDeleteModal = (): void => {
      isDeleteModalOpen.value = false;
      selectedDistillerId.value = "";
    };

    /**
     * Deletes the selected distiller by id.
     * @async
     * @function deleteDistiller
     * @returns {Promise<void>}
     */
    const deleteDistiller = async (): Promise<void> => {
      try {
        const deleteDistiller = await store.dispatch(
          "settings/deleteDistillerById",
          selectedDistillerId.value
        );
        if (deleteDistiller === "Unauthorized") {
          await store.dispatch("auth/logout");
          router.push("/login");
          return;
        } else {
          closeDeleteModal();
        }
      } catch (error) {
        Sentry.captureException(error);
        console.error("Failed to delete distiller:", error);
      }
    };

    /**
     * Opens the password change form modal.
     * @function openPasswordChangeForm
     */
    const openPasswordChangeForm = (): void => {
      isPasswordChangeFormOpen.value = true;
    };

    /**
     * Closes the password change form modal.
     * @function closePasswordChangeForm
     */
    const closePasswordChangeForm = (): void => {
      isPasswordChangeFormOpen.value = false;
    };

    // Watcher for theme changes, updates backend and store
    watch(isDarkTheme, async (newValue) => {
      try {
        await apolloClient.mutate({
          mutation: UPDATE_DARK_THEME,
          variables: { isDarkTheme: newValue },
        });

        store.dispatch("settings/setValue", {
          input: "isDarkTheme",
          value: isDarkTheme.value,
        });
      } catch (error: any) {
        await handleUserError(error);
      }
    });

    // Fetch distiller list from local storage before mount
    onBeforeMount(() => {
      store.dispatch("settings/fetchLocalStorageData", {
        key: "distillerList",
      });
    });

    // Fetch user details and theme state on mount
    onMounted(() => {
      fetchUserDetails();
      isDarkTheme.value = isDarkThemeStored.value;
      console.log("distillers in MyDataPage", distillers.value);
    });

    return {
      username,
      email,
      distillers,
      selectedDistillerId,
      isDistillerFormOpen,
      isDeleteModalOpen,
      isPasswordChangeFormOpen,
      isDarkTheme,
      openDistillerForm,
      closeDistillerForm,
      openDeleteModal,
      closeDeleteModal,
      deleteDistiller,
      openPasswordChangeForm,
      closePasswordChangeForm,
    };
  },
};
</script>

<style scoped>
.my-data__user-info {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 20px;
  margin-bottom: 50px;
}

.my-data__distillers {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
  margin-bottom: 50px;
}

.my-data__distillers-title {
  margin-left: 5%;
  text-align: left;
}

.my-data__distiller-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.my-data__distiller-item {
  border: 2px solid var(--secondary-color);
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
  width: 50%;
}

.my-data__distiller-title {
  margin-bottom: 5px;
}

.my-data__distiller-columns {
  display: flex;
  flex-direction: row;
  font-size: 13px;
  justify-content: space-around;
}

.my-data__distiller-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.my-data__distiller-delete {
  font-size: 11px;
}

.my-data__distiller-delete:hover {
  color: var(--error-color);
}

.my-data__distiller-none {
  margin-left: 5%;
  text-align: left;
}

.my-data__distillers-button {
  width: 300px;
  margin: 0 auto;
  margin-top: 20px;
}

.my-data__settings {
  display: flex;
  flex-direction: column;
  justify-content: left;
  margin-left: 5%;
}

.my-data__settings-title {
  text-align: left;
}

.my-data__settings-theme {
  display: flex;
  flex-direction: row;
  gap: 30px;
  align-items: center;
}

.my-data__settings-button {
  width: 150px;
}

@media (max-width: 600px) {
  .my-data__user-info {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .my-data__distiller-item {
    width: 80%;
  }
}
</style>
