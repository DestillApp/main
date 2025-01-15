//sprawdzenie w bazie danych czy nazwa użytkownika i e-mail juą są

<template>
  <base-card class="card">
    <!-- Title for the registration form -->
    <h3>Rejestracja</h3>
    <!-- Registration form -->
    <form @submit.prevent="submitRegistrationForm" class="form">
      <!-- Input field for entering the username -->
      <base-text-input
        v-model="registrationForm.username"
        type="text"
        label="Nazwa użytkownika"
      ></base-text-input>
      <!-- Input field for entering the email -->
      <base-text-input
        v-model="registrationForm.email"
        type="email"
        label="E-mail"
      >
      <template v-slot:message>
        <span v-if="emailExists"
          >Email już istnieje w bazie danych. Wpisz inny email.</span
        >
        <span v-else>&nbsp;</span>
      </template>
    </base-text-input>
      <!-- Input field for entering the password -->
      <base-text-input
        v-model="registrationForm.password"
        type="password"
        label="Hasło"
      ></base-text-input>
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
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useMutation } from "@vue/apollo-composable";
import DOMPurify from "dompurify";
import { scrollToTop } from "../helpers/displayHelpers.js";
import { REGISTER_USER } from "@/graphql/mutations/auth.js";

/**
 * @component RegistrationForm
 * @description This component renders a registration form and handles user registration.
 * @see submitRegistrationForm
 */
export default {
  name: "RegistrationForm",

  setup() {
    // Vuex store instance
    const store = useStore();

    const router = useRouter();

    const registrationForm = ref({
      username: "",
      email: "",
      password: "",
    });

    const emailExists = ref(false);

const { mutate: registerUser } = useMutation(REGISTER_USER);


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

    return { registrationForm, emailExists, scrollToTop, submitRegistrationForm };
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