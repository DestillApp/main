<template>
  <base-modal @close-modal="closeModal">
  <base-card class="card">
    <div class="modal-content">
      <h3 class="title">Dodaj destylator</h3>
      <form @submit.prevent="addDistiller" class="form">
        <!-- Input for material -->
        <base-text-input
          v-model="material"
          label="Materiał destylatora"
          id="material"
          placeholder="Wprowadź materiał destylatora"
        ></base-text-input>
        <!-- Input for capacity -->
        <base-text-input
          v-model="capacity"
          label="Pojemność destylatora (l)"
          id="capacity"
          type="number"
          placeholder="Wprowadź pojemność"
        ></base-text-input>
        <!-- Input for heating -->
        <base-text-input
          v-model="heating"
          label="Ogrzewanie destylatora"
          id="heating"
          placeholder="Wprowadź rodzaj ogrzewania"
        ></base-text-input>
        <!-- Submit button -->
        <base-button type="submit">Dodaj</base-button>
      </form>
    </div>
</base-card>
  </base-modal>
</template>

<script>
import { ref } from "vue";
import { useApolloClient } from "@vue/apollo-composable";
import BaseModal from "@/ui/BaseModal.vue";
import BaseTextInput from "@/ui/BaseTextInput.vue";
import BaseButton from "@/ui/BaseButton.vue";
import { ADD_DISTILLER } from "@/graphql/mutations/settings.js";

export default {
  components: {
    BaseModal,
    BaseTextInput,
    BaseButton,
  },
  setup(_, { emit }) {
    const { resolveClient } = useApolloClient();
    const apolloClient = resolveClient();

    const material = ref("");
    const capacity = ref("");
    const heating = ref("");

    const addDistiller = async () => {
      try {
        const distiller = {
          material: material.value,
          capacity: parseFloat(capacity.value),
          heating: heating.value,
        };

        const { data } = await apolloClient.mutate({
          mutation: ADD_DISTILLER,
          variables: {
            distiller,
          },
        });

        console.log("Distiller added:", data.addDistiller);
        closeModal();
      } catch (error) {
        console.error("Failed to add distiller:", error);
      }
    };

    const closeModal = () => {
      emit("close-modal");
    };

    return {
      material,
      capacity,
      heating,
      addDistiller,
      closeModal,
    };
  },
};
</script>

<style scoped>

.card {
  width: 35%;
}

.title {
    text-align: center; 
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
}
</style>