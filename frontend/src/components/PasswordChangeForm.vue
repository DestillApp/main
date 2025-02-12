<template>
  <base-modal @close-modal="closeModal">
    <base-card class="password-change-form__card">
      <div class="password-change-form__modal-content">
        <h3 class="password-change-form__title">Ustaw nowe hasło</h3>
        <form @submit.prevent="changePassword" class="password-change-form__form">
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
              <span v-if="!isFormValid && !oldPassword"
                >Wpisz stare hasło.</span
              >
              <span v-if="isFormValid && !isOldPasswordCorrect"
                >Niepoprawne stare hasło.</span
              >
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
              <span v-if="!isPasswordCorrect && newPassword"
                >Wpisz poprawne hasło. Hasło musi zawierać conajmniej 8 znaków,
                jedną wielką literę i jedną liczbę.</span
              >
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
              <span
                v-if="confirmNewPassword !== newPassword && confirmNewPassword"
                >Hasła nie są takie same.</span
              >
              <span v-if="!isFormValid && !confirmNewPassword"
                >Powtórz nowe hasło.</span
              >
              <span v-else>&nbsp;</span>
            </template>
          </base-text-input>
          <!-- Submit button -->
          <base-button type="submit" class="password-change-form__button">Zmień hasło</base-button>
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
    const isOldPasswordCorrect = ref(true);

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
          const isAuthenticated = await store.dispatch("auth/changePassword", {
            oldPassword: oldPassword.value,
            newPassword: newPassword.value,
          });
          if (isAuthenticated === true) {
            console.log("Password changed successfully");
            isOldPasswordCorrect.value = true;
            closeModal();
          } else if (isAuthenticated === "Invalid old password") {
            console.error("Wrong old password");
            isOldPasswordCorrect.value = false;
          }
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
      isOldPasswordCorrect,
    };
  },
};
</script>

<style scoped>
.password-change-form__card {
  width: 35%;
}

.password-change-form__title {
  text-align: center;
}

.password-change-form__modal-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.password-change-form__form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
}

.password-change-form__button {
  margin-top: 10px;
}
</style>
