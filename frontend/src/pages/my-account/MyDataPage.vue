<template>
  <div>
    <h3>Moje dane</h3>
    <div class="my-data_user-info">
      <p>nazwa użytkownika: {{ username }}</p>
      <p>adres e-mail: {{ email }}</p>
    </div>
    <div class="my-distillers">
      <h4 class="my-distillers-title">Moje destylatory:</h4>
      <ul v-if="distillers.length > 0">
        <li v-for="distiller in distillers" :key="distiller.id" class="distiller-item">
            <div>
          <p><strong>Materiał:</strong> {{ distiller.material }}</p>
          <p><strong>Pojemność:</strong> {{ distiller.capacity }} l</p>
          <p><strong>Ogrzewanie:</strong> {{ distiller.heating }}</p>
            </div>
          <button @click="deleteDistiller(distiller.id)">Usuń</button>
        </li>
      </ul>
        <p v-else class="distiller-none">Brak zapisanych destylatorów.</p>
      <base-button class="my-distillers-button" @click="openDistillerForm">Dodaj nowy destylator</base-button>
    </div>
    <div>
      <h4>Ustawienia:</h4>
    </div>
    <!-- Distiller form modal -->
    <distiller-form v-if="isDistillerFormOpen" @close-modal="closeDistillerForm"></distiller-form>
  </div>
</template>


<script>
import { ref, onMounted, computed } from "vue";
import { useApolloClient } from "@vue/apollo-composable";
import { useStore } from "vuex";
import { GET_USER_DETAILS } from "@/graphql/queries/auth.js";
import BaseButton from "@/ui/BaseButton.vue";
import DistillerForm from "@/components/DistillerForm.vue";

export default {
  components: { BaseButton, DistillerForm },
  setup() {
    const { resolveClient } = useApolloClient();
    const apolloClient = resolveClient();
    const store = useStore();

    const username = ref("");
    const email = ref("");
    const distillers = computed(() => store.getters["settings/distillerList"]);
    const isDistillerFormOpen = ref(false);

    const fetchUserDetails = async () => {
      try {
        const { data } = await apolloClient.query({
          query: GET_USER_DETAILS,
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

    const deleteDistiller = (id) => {
      console.log("Delete distiller with ID:", id);
      // Add delete logic here
    };

    onMounted(() => {
      fetchUserDetails();
      console.log("distillers in MyDataPage", distillers.value)
    });

    return {
      username,
      email,
      distillers,
      isDistillerFormOpen,
      openDistillerForm,
      closeDistillerForm,
      deleteDistiller,
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
  text-align: left;
}

.distiller-item {
  border: 1px solid black;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.distiller-none {
    text-align: left;   
}

.my-distillers-button{
width: 300px;
margin: 0 auto;
}
</style>