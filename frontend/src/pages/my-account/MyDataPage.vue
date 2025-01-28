<template>
  <div>
    <h3>Moje dane</h3>
    <div class="my-data_user-info">
      <p>nazwa użytkownika: {{ username }}</p>
      <p>adres e-mail: {{ email }}</p>
    </div>
    <div>
        <h4>Moje destylatory:</h4>
        <base-button>Dodaj nowy destylator</base-button>
    </div>
    <div>
        <h4>Ustawienia:</h4>
        
    </div>
  </div>
</template>


<script>
import { ref, onMounted } from "vue";
import { useApolloClient } from "@vue/apollo-composable";
import { GET_USER_DETAILS } from "@/graphql/queries/auth.js";
import BaseButton from "@/ui/BaseButton.vue";

export default {
  components: { BaseButton },
  setup() {
    const { resolveClient } = useApolloClient();
    const apolloClient = resolveClient();

    const username = ref("");
    const email = ref("");

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

    onMounted(() => {
      fetchUserDetails();
    });

    return {
      username,
      email,
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
</style>