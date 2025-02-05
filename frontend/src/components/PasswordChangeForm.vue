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
            :invalidInput="!isFormValid && !oldPassword"
          >
            <template v-slot:message>
              <span v-if="!isFormValid && !oldPassword">Wpisz stare hasło.</span>
              <span v-else>&nbsp;</span>
            </template>
          </base-text-input>
          <!-- Input for new password -->
          <base-text-input
            v-model="newPassword"
            label="Nowe hasło"
            id="newPassword"
            type="password"
            placeholder="Wprowadź nowe hasło"
            @input="checkPassword"
            :invalidInput="!isFormValid && !newPassword"
          >
            <template v-slot:message>
              <span v-if="!isPasswordCorrect && newPassword">Wpisz poprawne hasło. Hasło musi zawierać conajmniej 8 znaków, jedną wielką literę i jedną liczbę.</span>
              <span v-if="!isFormValid && !newPassword">Wpisz nowe hasło.</span>
              <span v-else>&nbsp;</span>
            </template>
          </base-text-input>
          <!-- Input for confirm new password -->
          <base-text-input
            v-model="confirmNewPassword"
            label="Powtórz nowe hasło"
            id="confirmNewPassword"
            type="password"
            placeholder="Powtórz nowe hasło"
            :invalidInput="!isFormValid && !confirmNewPassword"
          >
            <template v-slot:message>
              <span v-if="confirmNewPassword !== newPassword && confirmNewPassword">Hasła nie są takie same.</span>
              <span v-if="!isFormValid && !confirmNewPassword">Powtórz nowe hasło.</span>
              <span v-else>&nbsp;</span>
            </template>
          </base-text-input>
          <!-- Submit button -->
          <base-button type="submit" class="button">Zmień hasło</base-button>
        </form>
      </div>
    </base-card>
  </base-modal>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import BaseModal from "@/ui/BaseModal.vue";
import BaseTextInput from "@/ui/BaseTextInput.vue";
import BaseButton from "@/ui/BaseButton.vue";
import { changePasswordFormValidation } from "@/helpers/formsValidation.js";

export default {
  components: {
    BaseModal,
    BaseTextInput,
    BaseButton,
  },
  setup(_, { emit }) {
    const store = useStore();

    const oldPassword = ref("");
    const newPassword = ref("");
    const confirmNewPassword = ref("");

    // Reactive reference to track form validity
    const isFormValid = ref(true);
    const isPasswordCorrect = ref(true);

    const checkPassword = () => {
      const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
      isPasswordCorrect.value = passwordRegex.test(newPassword.value);
    };

    const changePassword = async () => {
      const form = {
        oldPassword: oldPassword.value,
        newPassword: newPassword.value,
        confirmNewPassword: confirmNewPassword.value,
      };

      const validationResults = changePasswordFormValidation(form);
      isFormValid.value = validationResults.isFormValid;
      isPasswordCorrect.value = validationResults.isPasswordCorrect;

      if (isFormValid.value) {
        try {
          await store.dispatch("auth/changePassword", {
            oldPassword: oldPassword.value,
            newPassword: newPassword.value,
          });
          console.log("Password changed successfully");
          closeModal();
        } catch (error) {
          console.error("Failed to change password:", error);
        }
      } else {
        console.error("Form is invalid");
      }
    };

    const closeModal = () => {
      emit("close-modal");
    };

    return {
      oldPassword,
      newPassword,
      confirmNewPassword,
      checkPassword,
      changePassword,
      closeModal,
      isFormValid,
      isPasswordCorrect,
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
