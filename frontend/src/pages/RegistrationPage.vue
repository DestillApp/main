//sprawdzenie w bazie danych czy nazwa użytkownika juą jest

<template>
  <base-card class="card">
    <!-- Title for the registration form -->
    <h3>Rejestracja</h3>
    <!-- Registration form -->
    <form @submit.prevent="saveRegistration" class="form">
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
      <template v-slot:message>
        <span v-if="!isPasswordCorrect && registrationForm.password">Wpisz poprawne hasło. Hasło musi zawierać conajmniej 8 znaków, jedną wielką literę i jedną liczbę.</span>
          <span v-if="!isFormValid && !registrationForm.password">Wpisz hasło.</span>
          <span v-else>&nbsp;</span>
        </template>
    </base-text-input>
      <!-- Input field for confirming the password -->
      <base-text-input
        v-model="confirmPassword"
        type="password"
        label="Potwierdź hasło"
        :invalidInput="(!isFormValid && !confirmPassword) || isPasswordMatch === false"
      >
        <template v-slot:message>
          <span v-if="isPasswordMatch === false">Hasła nie są takie same.</span>
          <span v-if="!isFormValid && !confirmPassword">Powtórz wpisane hasło.</span>
          <span v-else>&nbsp;</span>
        </template>
      </base-text-input>
      <!-- Button to submit the registration form -->
      <base-button class="button" type="submit">Zarejestruj się</base-button>
    </form>
    <div class="link">
      Masz już konto?
      <!-- Link to the login page -->
      <router-link @click="scrollToTop" class="link_login" to="/login"
        >Zaloguj się!</router-link
      >
    </div>
  </base-card>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useMutation } from "@vue/apollo-composable";
import { useApolloClient } from "@vue/apollo-composable";
import DOMPurify from "dompurify";
import { scrollToTop } from "../helpers/displayHelpers.js";
import { REGISTER_USER } from "@/graphql/mutations/auth.js";
import { CHECK_USERNAME_EXISTENCE } from "@/graphql/queries/auth.js";
import { registrationFormValidation } from "@/helpers/formsValidation.js";

/**
 * @component RegistrationForm
 * @description This component renders a registration form and handles user registration.
 * @see submitRegistrationForm
 */
export default {
  name: "RegistrationForm",

  setup() {
    // Apollo client instance
    const { resolveClient } = useApolloClient();
    const apolloClient = resolveClient();

    // Vuex store instance
    const store = useStore();

    const router = useRouter();

    const registrationForm = ref({
      username: "",
      email: "",
      password: "",
    });

    // Reactive reference to track form validity
    const isFormValid = ref(true);
    const isPasswordCorrect = ref(true);

    const emailExists = ref(false);
    const usernameExists = ref(false);

    const confirmPassword = ref("");

    const { mutate: registerUser } = useMutation(REGISTER_USER);

    // Computed property to check if passwords match
    const isPasswordMatch = computed(() => {
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
     * Function to handle the blur event on the username input.
     * Checks if the username already exists in the database.
     * @async
     * @function checkUsername
     * @returns {Promise<void>} Resolves when the check is complete.
     * @throws {Error} Throws an error if the check fails.
     */
    const checkUsername = async () => {
      try {
        const sanitizedUsername = DOMPurify.sanitize(
          registrationForm.value.username
        );
        const { data } = await apolloClient.query({
          query: CHECK_USERNAME_EXISTENCE,
          variables: {
            username: sanitizedUsername,
          },
        });

        if (data.checkUsernameExistence) {
          usernameExists.value = true;
        } else {
          usernameExists.value = false;
        }
      } catch (error) {
        console.error("Error checking username existence", error.message);
        usernameExists.value = false;
      }
    };

    const resetUsernameExists = () => {
      usernameExists.value = false;
    };

        /**
     * Function to check if the password is correct on input change.
     */
     const checkPassword = () => {
      const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
      isPasswordCorrect.value = passwordRegex.test(registrationForm.value.password);
    };


    /**
     * Function to handle the submission of the registration form.
     * Sanitizes user input and sends a GraphQL mutation to register the user.
     * @async
     * @function submitRegistrationForm
     * @returns {Promise<void>} Resolves when the form submission process is complete.
     * @throws {Error} Throws an error if the form submission fails.
     */
    const submitRegistrationForm = async () => {
      try {
        const form = registrationForm.value;

        // Sanitize input data from the form
        const sanitizedUsername = DOMPurify.sanitize(form.username);
        const sanitizedEmail = DOMPurify.sanitize(form.email);
        const sanitizedPassword = DOMPurify.sanitize(form.password);

        // Create an object with sanitized form data
        const registrationFormData = {
          username: sanitizedUsername,
          email: sanitizedEmail,
          password: sanitizedPassword,
        };

        // Send the GraphQL mutation to register the user
        const { data } = await registerUser({
          userInput: {
            username: registrationFormData.username,
            email: registrationFormData.email,
            password: registrationFormData.password,
          },
        });
        console.log("Created user:", data.registerUser);

        store.dispatch("settings/setInitialSettings");

        router.push({ name: "LoginPage" });
      } catch (error) {
        console.error("Error submitting form", error.message);
        if (error.message == "Email already exists") {
          emailExists.value = true;
        }
      }
    };

    const resetEmailExists = () => {
      emailExists.value = false;
    };

        /**
     * Function to validate the form and call submitRegistrationForm if valid.
     * @async
     * @function saveRegistration
     * @returns {Promise<void>} Resolves when the form validation and submission process is complete.
     * @throws {Error} Throws an error if the form validation or submission fails.
     */
     const saveRegistration = async () => {
     const validationResults = registrationFormValidation({
        ...registrationForm.value,
        confirmPassword: confirmPassword.value,
      }, usernameExists.value);

      isFormValid.value = validationResults.isFormValid;
      isPasswordCorrect.value = validationResults.isPasswordCorrect;

      console.log(validationResults);

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
      resetEmailExists
    };
  },
};
</script>

<style scoped>
.card {
  width: 50%;
  margin-right: 25vw;
  margin-left: 25vw;
  margin-top: 40px;
  margin-bottom: 40px;
  padding-right: 50px;
  padding-left: 50px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.button {
  width: 40%;
  align-self: center;
  color: var(--secondary-color);
  margin-top: 20px;
}

.button:hover,
.button:active {
  color: var(--primary-color);
}

.link {
  font-size: 12px;
  margin-top: 20px;
}

.link_login {
  color: var(--primary-color);
}
</style>
