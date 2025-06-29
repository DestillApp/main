<template>
  <base-modal @close-modal="closeModal">
    <base-card class="password-change-form__card">
      <div class="password-change-form__modal-content">
        <h3 class="password-change-form__title">Ustaw nowe hasło</h3>
        <form
          @submit.prevent="changePassword"
          class="password-change-form__form"
        >
          <!-- Input for old password -->
          <base-text-input
            v-model="oldPassword"
            label="Stare hasło"
            id="oldPassword"
            type="password"
            placeholder="Wprowadź stare hasło"
            :invalidInput="!isFormValid && !oldPassword"
          >
            <!-- Validation messages for old password -->
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
            <!-- Validation messages for new password -->
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
            <!-- Validation messages for confirm new password -->
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
          <base-button type="submit" class="password-change-form__button"
            >Zmień hasło</base-button
          >
        </form>
      </div>
    </base-card>
  </base-modal>
</template>

<script lang="ts">
import { ref } from "vue";
import { useStore } from "@/store/useStore";
import BaseModal from "@/ui/BaseModal.vue";
import BaseTextInput from "@/ui/BaseTextInput.vue";
import BaseButton from "@/ui/BaseButton.vue";
import { CloseModal } from "@/types/events";
import { changePasswordFormValidation } from "@/helpers/formsValidation";
import * as Sentry from "@sentry/vue";

/**
 * @component PasswordChangeForm
 * @description Modal form for changing the user's password. Handles validation, error display, and submission.
 * @props none
 * @emits close-modal - Event emitted when the modal is closed.
 * @see checkPassword
 * @see changePassword
 * @see closeModal
 */

/**
 * No props for PasswordChangeForm component.
 * @interface
 */
interface Props {}

export default {
  components: {
    BaseModal,
    BaseTextInput,
    BaseButton,
  },
  setup(_, context) {
    // Vuex store instance
    const store = useStore();

    // Emit function for modal events
    const emit = context.emit as CloseModal;

    // Reactive reference for the old password input
    const oldPassword = ref<string>("");
    // Reactive reference for the new password input
    const newPassword = ref<string>("");
    // Reactive reference for the confirm new password input
    const confirmNewPassword = ref<string>("");

    // Reactive reference to track form validity
    const isFormValid = ref<boolean>(true);
    // Reactive reference to track password format validity
    const isPasswordCorrect = ref<boolean>(true);
    // Reactive reference to track if the old password is correct
    const isOldPasswordCorrect = ref<boolean>(true);

    /**
     * Checks if the new password meets the required format.
     * @function checkPassword
     */
    const checkPassword = (): void => {
      const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
      isPasswordCorrect.value = passwordRegex.test(newPassword.value);
    };

    /**
     * Handles password change form submission, validates input, and dispatches the change password action.
     * @async
     * @function changePassword
     * @returns {Promise<void>}
     */
    const changePassword = async (): Promise<void> => {
      const form: {
        oldPassword: string;
        newPassword: string;
        confirmNewPassword: string;
      } = {
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
            isOldPasswordCorrect.value = true;
            closeModal();
          } else if (isAuthenticated === "Invalid old password") {
            isOldPasswordCorrect.value = false;
          }
        } catch (error) {
          Sentry.captureException(error);
          console.error("Failed to change password:", error);
        }
      } else {
        console.error("Form is invalid");
      }
    };

    /**
     * Emits the close-modal event to close the modal.
     * @function closeModal
     */
    const closeModal = (): void => {
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

@media (max-width: 1024px) {
  .password-change-form__card {
    width: 50%;
  }
}

@media (max-width: 600px) {
  .password-change-form__card {
    width: 70%;
  }
}
</style>
