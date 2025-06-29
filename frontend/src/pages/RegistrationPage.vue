<template>
  <base-card class="registration__card">
    <!-- Title for the registration form -->
    <h3>Rejestracja</h3>
    <!-- Registration form -->
    <form @submit.prevent="saveRegistration" class="registration__form">
      <!-- Input field for entering the username -->
      <base-text-input
        v-model="registrationForm.username"
        type="text"
        label="Nazwa użytkownika"
        :invalidInput="
          (!isFormValid && !registrationForm.username) || usernameExists
        "
        @blur="checkUsername"
        @focus="resetUsernameExists"
      >
        <!-- Username validation messages -->
        <template v-slot:message>
          <span v-if="usernameExists"
            >Nazwa użytkownika już istnieje w bazie danych. Wpisz inną
            nazwę.</span
          >
          <span v-if="!isFormValid && !registrationForm.username"
            >Wpisz nazwę użytkownika.</span
          >
          <span v-else>&nbsp;</span>
        </template>
      </base-text-input>
      <!-- Input field for entering the email -->
      <base-text-input
        v-model="registrationForm.email"
        type="email"
        label="E-mail"
        :invalidInput="(!isFormValid && !registrationForm.email) || emailExists"
        @focus="resetEmailExists"
      >
        <!-- Email validation messages -->
        <template v-slot:message>
          <span v-if="emailExists"
            >Email już istnieje w bazie danych. Wpisz inny email.</span
          >
          <span v-if="!isFormValid && !registrationForm.email"
            >Wpisz email.</span
          >
          <span v-else>&nbsp;</span>
        </template>
      </base-text-input>
      <!-- Input field for entering the password -->
      <base-text-input
        v-model="registrationForm.password"
        :invalidInput="!isFormValid && !registrationForm.password"
        @input="checkPassword"
        type="password"
        label="Hasło"
      >
        <!-- Password validation messages -->
        <template v-slot:message>
          <span v-if="!isPasswordCorrect && registrationForm.password"
            >Wpisz poprawne hasło. Hasło musi zawierać conajmniej 8 znaków,
            jedną wielką literę i jedną liczbę.</span
          >
          <span v-if="!isFormValid && !registrationForm.password"
            >Wpisz hasło.</span
          >
          <span v-else>&nbsp;</span>
        </template>
      </base-text-input>
      <!-- Input field for confirming the password -->
      <base-text-input
        v-model="confirmPassword"
        type="password"
        label="Potwierdź hasło"
        :invalidInput="
          (!isFormValid && !confirmPassword) || isPasswordMatch === false
        "
      >
        <!-- Confirm password validation messages -->
        <template v-slot:message>
          <span v-if="isPasswordMatch === false">Hasła nie są takie same.</span>
          <span v-if="!isFormValid && !confirmPassword"
            >Powtórz wpisane hasło.</span
          >
          <span v-else>&nbsp;</span>
        </template>
      </base-text-input>
      <!-- Button to submit the registration form -->
      <base-button class="registration__button" type="submit"
        >Zarejestruj się</base-button
      >
    </form>
    <div class="registration__link">
      Masz już konto?
      <!-- Link to the login page -->
      <router-link
        @click="scrollToTop"
        class="registration__link-login"
        to="/login"
        >Zaloguj się!</router-link
      >
    </div>
  </base-card>
</template>

<script lang="ts">
import { ref, computed } from "vue";
import { useStore } from "@/store/useStore";
import { useRouter } from "vue-router";
import { useMutation } from "@vue/apollo-composable";
import { useApolloClient } from "@vue/apollo-composable";
import DOMPurify from "dompurify";
import { scrollToTop } from "../helpers/displayHelpers";
import { REGISTER_USER } from "@/graphql/mutations/auth";
import { CHECK_USERNAME_EXISTENCE } from "@/graphql/queries/auth";
import { registrationFormValidation } from "@/helpers/formsValidation";
import * as Sentry from "@sentry/vue";

/**
 * @component RegistrationForm
 * @description This component renders a registration form and handles user registration.
 * @see checkUsername
 * @see resetUsernameExists
 * @see checkPassword
 * @see submitRegistrationForm
 * @see resetEmailExists
 * @see saveRegistration
 */

/**
 * Interface for registration form data.
 * @interface
 */
interface RegistrationForm {
  username: string;
  email: string;
  password: string;
}

export default {
  name: "RegistrationForm",

  setup() {
    // Apollo client instance
    const { resolveClient } = useApolloClient();
    const apolloClient = resolveClient();

    // Vuex store instance
    const store = useStore();

    // Router instance
    const router = useRouter();

    // Registration form state
    const registrationForm = ref<RegistrationForm>({
      username: "",
      email: "",
      password: "",
    });

    // Form validity state
    const isFormValid = ref<boolean>(true);
    // Password correctness state
    const isPasswordCorrect = ref<boolean>(true);

    // Email and username existence state
    const emailExists = ref<boolean>(false);
    const usernameExists = ref<boolean>(false);

    // Confirm password state
    const confirmPassword = ref<string>("");

    // GraphQL mutation for registering user
    const { mutate: registerUser } = useMutation(REGISTER_USER);

    // Computed property to check if passwords match
    const isPasswordMatch = computed<boolean | string>(() => {
      if (confirmPassword.value === "") {
        return "";
      }
      if (registrationForm.value.password === confirmPassword.value) {
        return true;
      } else {
        return false;
      }
    });

    /**
     * Checks if the username already exists in the database.
     * @async
     * @function checkUsername
     * @returns {Promise<void>}
     */
    const checkUsername = async (): Promise<void> => {
      try {
        const { data } = await apolloClient.query({
          query: CHECK_USERNAME_EXISTENCE,
          variables: {
            username: registrationForm.value.username,
          },
        });

        if (data.checkUsernameExistence) {
          usernameExists.value = true;
        } else {
          usernameExists.value = false;
        }
      } catch (error: any) {
        Sentry.captureException(error);
        console.error("Error checking username existence", error.message);
        usernameExists.value = false;
      }
    };

    /**
     * Resets the username existence state.
     * @function resetUsernameExists
     */
    const resetUsernameExists = (): void => {
      usernameExists.value = false;
    };

    /**
     * Checks if the password is correct on input change.
     * @function checkPassword
     */
    const checkPassword = (): void => {
      const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
      isPasswordCorrect.value = passwordRegex.test(
        registrationForm.value.password
      );
    };

    /**
     * Handles the submission of the registration form.
     * Sanitizes user input and sends a GraphQL mutation to register the user.
     * @async
     * @function submitRegistrationForm
     * @returns {Promise<void>}
     */
    const submitRegistrationForm = async (): Promise<void> => {
      try {
        const form = registrationForm.value;

        const registrationFormData = {
          username: form.username,
          email: form.email,
          password: form.password,
        };

        const result = await registerUser({
          userInput: {
            username: registrationFormData.username,
            email: registrationFormData.email,
            password: registrationFormData.password,
          },
        });

        if (result) {
          await store.dispatch(
            "settings/setInitialSettings",
            result.data.registerUser._id
          );
        }
        router.push({ name: "LoginPage" });
      } catch (error: any) {
        Sentry.captureException(error);
        console.error("Error submitting form", error.message);
        if (error.message == "Email already exists") {
          emailExists.value = true;
        }
      }
    };

    /**
     * Resets the email existence state.
     * @function resetEmailExists
     */
    const resetEmailExists = (): void => {
      emailExists.value = false;
    };

    /**
     * Validates the form and calls submitRegistrationForm if valid.
     * @async
     * @function saveRegistration
     * @returns {Promise<void>}
     */
    const saveRegistration = async (): Promise<void> => {
      const validationResults = registrationFormValidation(
        {
          ...registrationForm.value,
          confirmPassword: confirmPassword.value,
        },
        usernameExists.value
      );

      isFormValid.value = validationResults.isFormValid;
      isPasswordCorrect.value = validationResults.isPasswordCorrect;

      if (isFormValid.value) {
        await submitRegistrationForm();
      } else {
        console.log("Form is invalid");
      }
    };

    return {
      registrationForm,
      isFormValid,
      isPasswordCorrect,
      emailExists,
      usernameExists,
      confirmPassword,
      isPasswordMatch,
      scrollToTop,
      checkUsername,
      resetUsernameExists,
      checkPassword,
      saveRegistration,
      resetEmailExists,
    };
  },
};
</script>

<style scoped>
.registration__card {
  width: 50%;
  margin-right: 25vw;
  margin-left: 25vw;
  margin-top: 100px;
  margin-bottom: 40px;
  padding-right: 50px;
  padding-left: 50px;
}

.registration__form {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.registration__button {
  width: 40%;
  align-self: center;
  color: var(--secondary-color);
  margin-top: 20px;
}

.registration__button:hover,
.registration__button:active {
  color: var(--primary-color);
}

.registration__link {
  font-size: 12px;
  margin-top: 20px;
}

.registration__link-login {
  color: var(--primary-color);
}

@media (max-width: 1024px) {
  .registration__card {
    width: 70%;
    margin-top: 70px;
    margin-right: 15vw;
    margin-left: 15vw;
  }

  .registration__button {
    width: 50%;
  }
}

@media (max-width: 600px) {
  .registration__card {
    width: 80%;
    margin-top: 50px;
    margin-right: 10vw;
    margin-left: 10vw;
  }

  .registration__button {
    width: 65%;
  }
}
</style>
