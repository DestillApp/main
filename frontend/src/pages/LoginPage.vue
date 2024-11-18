<template>
  <base-card class="card">
    <!-- Title for the login form -->
    <h3>Logowanie</h3>
    <!-- Login form -->
    <form @submit.prevent="loginUser" class="form">
      <!-- Input field for entering the email -->
      <base-text-input
        v-model="loginForm.email"
        type="email"
        label="E-mail"
        id="email"
        autocomplete="email"
      ></base-text-input>
      <!-- Input field for entering the password -->
      <base-text-input
        v-model="loginForm.password"
        type="password"
        label="Hasło"
        id="password"
        autocomplete="current-password"
      >
        <template v-slot:message>
          <span v-if="isLoginFormValid === false"
            >Niepoprawny adres e-mail i/lub hasło.</span
          >
          <span v-else>&nbsp;</span>
        </template></base-text-input
      >
      <!-- Button to submit the login form -->
      <base-button class="button" type="submit">Zaloguj się</base-button>
    </form>
    <div class="links">
      <!-- Link to the password help -->
      <span>Nie pamiętam hasła</span>
      <!-- Link to the registration page -->
      <span
        >Nie masz konta?
        <router-link @click="scrollToTop" class="link_register" to="/register"
          >Zarejestruj się </router-link
        >w Distill It!</span
      >
    </div>
  </base-card>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { scrollToTop } from "../helpers/displayHelpers.js";
import DOMPurify from "dompurify";

/**
 * @component LoginForm
 * @description This component renders a login form and handles user authentication.
 * @see loginFormValidation
 * @see loginUser
 */
export default {
  name: "LoginForm",
  setup() {
    // Router object for navigation
    const router = useRouter();

    // Vuex store instance
    const store = useStore();

    // Reactive reference to track form validity
    const isLoginFormValid = ref(null);

    // Reactive reference to store login form data
    const loginForm = ref({
      email: "",
      password: "",
    });

    /**
     * Function to validate the login form data
     * @async
     * @function loginFormValidation
     */
    const loginFormValidation = async () => {
      if (loginForm.value.email === "" || loginForm.value.password === "") {
        isLoginFormValid.value = false;
      } else {
        isLoginFormValid.value = true;
      }
    };

    /**
     * Function to handle the submission of the login form.
     * @async
     * @function loginUser
     * @returns {Promise<void>} Resolves when the login process is complete.
     * @throws {Error} Throws an error if the login fails.
     */
    const loginUser = async () => {
      console.log("form:", loginForm.value);
      console.log("Email:", loginForm.value.email);
      console.log("Password:", loginForm.value.password);
      // Validate the form
      await loginFormValidation();
      if (isLoginFormValid.value) {
        try {
          const form = loginForm.value;

          //Sanitize input data from the form
          const sanitizedEmail = DOMPurify.sanitize(form.email);
          const sanitizedPassword = DOMPurify.sanitize(form.password);

          // Send the GraphQL mutation to login the user
          const isAuthenticated = await store.dispatch('auth/login', {
            email: sanitizedEmail,
            password: sanitizedPassword,
          });

          //Redirecting 
          if (isAuthenticated) {
            const redirectPath = router.currentRoute.value.query.redirect || "/my-account";
            router.push(redirectPath);
          } else {
            console.error('Authentication failed after login');
          }
        } catch (error) {
          console.error("Error occured while logging in", error);
        }
      } else {
        return;
      }
    };

    return { loginForm, isLoginFormValid, scrollToTop, loginUser };
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
  justify-content: center;
}

.button {
  width: 30%;
  align-self: center;
  color: var(--secondary-color);
}

.button:hover,
.button:active {
  color: var(--primary-color);
}

.links {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  font-size: 12px;
  margin-top: 20px;
  gap: 5px;
}

.link_register {
  color: var(--primary-color);
}
</style>