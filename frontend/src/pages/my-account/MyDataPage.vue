<template>
  <div>
    <h3>Moje dane</h3>
    <div class="my-data_user-info">
      <p>nazwa użytkownika: {{ username }}</p>
      <p>adres e-mail: {{ email }}</p>
    </div>
    <div class="my-distillers">
      <h4 class="my-distillers-title">Moje destylatory:</h4>
      <ul v-if="distillers.length > 0" class="distiller-list">
        <li
          v-for="distiller in distillers"
          :key="distiller.id"
          class="distiller-item"
        >
          <h5 class="distiller-title">Destylator</h5>
          <div class="distiller-columns">
            <div class="distiller-info">
              <p>Materiał: {{ distiller.material }}</p>
              <p>Pojemność: {{ distiller.capacity }} l</p>
              <p>Ogrzewanie: {{ distiller.heating }}</p>
            </div>
            <button
              @click="openDeleteModal(distiller.id)"
              class="distiller-delete"
            >
              Usuń
            </button>
          </div>
        </li>
      </ul>
      <p v-else class="distiller-none">Brak zapisanych destylatorów.</p>
      <base-button class="my-distillers-button" @click="openDistillerForm"
        >Dodaj nowy destylator</base-button
      >
    </div>
    <div class="settings">
      <h4 class="settings-title">Ustawienia:</h4>
      <div class="settings-theme">
      <p v-if="isDarkTheme">Motyw ciemny aplikacji włączony</p>
      <p v-if="!isDarkTheme">Motyw ciemny aplikacji wyłączony</p>
      <v-switch v-model="isDarkTheme" hide-details color="var(--secondary-color)"></v-switch>
      </div>
      <base-button class="settings-button" @click="openPasswordChangeForm">Zmień hasło</base-button>
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
      :distiller="true"
    ></delete-item-modal>
    <!-- Password change form modal -->
    <password-change-form
      v-if="isPasswordChangeFormOpen"
      @close-modal="closePasswordChangeForm"
    ></password-change-form>
  </div>
</template>

<script>
import { ref, onMounted, computed, onBeforeMount, watch } from "vue";
import { useApolloClient } from "@vue/apollo-composable";
import { useStore } from "vuex";
import { GET_USER_DETAILS } from "@/graphql/queries/auth.js";
import { UPDATE_DARK_THEME } from "@/graphql/mutations/settings.js";
import BaseButton from "@/ui/BaseButton.vue";
import DistillerForm from "@/components/DistillerForm.vue";
import DeleteItemModal from "@/components/plant/DeleteItemModal.vue";
import PasswordChangeForm from "@/components/PasswordChangeForm.vue";

export default {
  components: { BaseButton, DistillerForm, DeleteItemModal, PasswordChangeForm },
  setup() {
    const { resolveClient } = useApolloClient();
    const apolloClient = resolveClient();
    const store = useStore();

    const username = ref("");
    const email = ref("");
    const distillers = computed(() => store.getters["settings/distillerList"]);

    const isDeleteModalOpen = ref(false);
    const selectedDistillerId = ref(null);

    const isDistillerFormOpen = ref(false);
    const isPasswordChangeFormOpen = ref(false);
    const isDarkTheme = ref(false);
const isDarkThemeStored = computed(() => store.getters["settings/isDarkTheme"]);

    const fetchUserDetails = async () => {
      try {
        const { data } = await apolloClient.query({
          query: GET_USER_DETAILS,
          fetchPolicy: "network-only",
        });
        username.value = data.getUserDetails.username;
        email.value = data.getUserDetails.email;
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };

    const openDistillerForm = () => {
      isDistillerFormOpen.value = true;
    };

    const closeDistillerForm = () => {
      isDistillerFormOpen.value = false;
    };

    const openDeleteModal = (id) => {
      selectedDistillerId.value = id;
      isDeleteModalOpen.value = true;
    };

    const closeDeleteModal = () => {
      isDeleteModalOpen.value = false;
      selectedDistillerId.value = null;
    };

    const deleteDistiller = async () => {
      try {
        await store.dispatch(
          "settings/deleteDistillerById",
          selectedDistillerId.value
        );
        closeDeleteModal();
      } catch (error) {
        console.error("Failed to delete distiller:", error);
      }
    };

    const openPasswordChangeForm = () => {
      isPasswordChangeFormOpen.value = true;
    };

    const closePasswordChangeForm = () => {
      isPasswordChangeFormOpen.value = false;
    };

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

      } catch (error) {
        console.error("Failed to update theme:", error);
      }
    });

    onBeforeMount(() => {
      store.dispatch("settings/fetchLocalStorageData", {
        key: "distillerList",
      });
    });

    onMounted(() => {
      fetchUserDetails();
        isDarkTheme.value = isDarkThemeStored.value;
      console.log("distillers in MyDataPage", distillers.value);
    });

    return {
      username,
      email,
      distillers,
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
.my-data_user-info {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 20px;
  margin-bottom: 50px;
}

.my-distillers {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
  margin-bottom: 50px;
}

.my-distillers-title {
    margin-left: 5%;
  text-align: left;
}

.distiller-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.distiller-item {
  border: 2px solid var(--secondary-color);
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
  width: 50%;
}

.distiller-title {
  margin-bottom: 5px;
}

.distiller-columns {
  display: flex;
  flex-direction: row;
  font-size: 13px;
  justify-content: space-around;
}

.distiller-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.distiller-delete {
  font-size: 11px;
}

.distiller-delete:hover {
  color: var(--error-color);
}

.distiller-none {
  margin-left: 5%;
  text-align: left;
}

.my-distillers-button {
  width: 300px;
  margin: 0 auto;
  margin-top: 20px;
}

.settings {
  display: flex;
  flex-direction: column;
  justify-content: left;
  margin-left: 5%;
}

.settings-title {
  text-align: left;
}

.settings-theme {
  display: flex;
  flex-direction: row;
  gap: 30px;
  align-items: center;
}

.settings-button {
  width: 150px;
}
</style>
