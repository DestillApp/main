<template>
  <base-modal @close-modal="closeModal">
    <base-card class="card">
      <div class="modal-content">
        <h3 class="title">Ustaw nowe hasło</h3>
        <form @submit.prevent="changePassword" class="form">
          <!-- Input for old password -->
          <base-text-input
            v-model="oldPassword"
            label="Stare hasło"
            id="oldPassword"
            type="password"
            placeholder="Wprowadź stare hasło"
          ></base-text-input>
          <!-- Input for new password -->
          <base-text-input
            v-model="newPassword"
            label="Nowe hasło"
            id="newPassword"
            type="password"
            placeholder="Wprowadź nowe hasło"
          ></base-text-input>
          <!-- Input for confirm new password -->
          <base-text-input
            v-model="confirmNewPassword"
            label="Powtórz nowe hasło"
            id="confirmNewPassword"
            type="password"
            placeholder="Powtórz nowe hasło"
          ></base-text-input>
          <!-- Submit button -->
          <base-button type="submit" class="button">Zmień hasło</base-button>
        </form>
      </div>
    </base-card>
  </base-modal>
</template>

<script>
import { ref } from "vue";
import BaseModal from "@/ui/BaseModal.vue";
import BaseTextInput from "@/ui/BaseTextInput.vue";
import BaseButton from "@/ui/BaseButton.vue";

export default {
  components: {
    BaseModal,
    BaseTextInput,
    BaseButton,
  },
  setup(_, { emit }) {
    const oldPassword = ref("");
    const newPassword = ref("");
    const confirmNewPassword = ref("");

    const changePassword = () => {
      console.log("Old Password:", oldPassword.value);
      console.log("New Password:", newPassword.value);
      console.log("Confirm New Password:", confirmNewPassword.value);
    };

    const closeModal = () => {
      emit("close-modal");
    };

    return {
      oldPassword,
      newPassword,
      confirmNewPassword,
      changePassword,
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
  gap: 10px;
}

.button {
  margin-top: 10px;
}
</style>
