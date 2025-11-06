<template>
  <base-card class="login__card">
    <!-- Title for the login form -->
    <h3>Logowanie</h3>
    <!-- Login form -->
    <form @submit.prevent="loginUser(false)" class="login__form">
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
        <!-- Error message for invalid login -->
        <template v-slot:message>
          <span v-if="isLoginFormValid === false"
            >Niepoprawny adres e-mail i/lub hasło.</span
          >
          <span v-else>&nbsp;</span>
        </template></base-text-input
      >
      <!-- Button to submit the login form -->
      <base-button class="login__button" type="submit">Zaloguj się</base-button>
      <base-button class="login__button login__demo" @click="loginUser(true)"
        >Wypróbuj demo</base-button
      >
    </form>
    <div class="login__links">
      <!-- Link to the password help -->
      <span>Nie pamiętam hasła</span>
      <!-- Link to the registration page -->
      <span
        >Nie masz konta?
        <router-link
          @click="scrollToTop"
          class="login__link-register"
          to="/register"
          >Zarejestruj się </router-link
        >w Distill It!</span
      >
    </div>
  </base-card>
</template>

<script lang="ts">
import { ref, Ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "@/store/useStore";
import { scrollToTop } from "../helpers/displayHelpers.js";
import { LoginForm } from "@/types/forms/loginForm";
import * as Sentry from "@sentry/vue";

/**
 * @component LoginForm
 * @description Login page component that handles user authentication and redirects after login.
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
    const isLoginFormValid = ref<boolean | null>(null);

    // Reactive reference to store login form data
    const loginForm = ref<LoginForm>({
      email: "",
      password: "",
    });

    /**
     * Validates the login form data.
     * @async
     * @function loginFormValidation
     * @returns {Promise<void>}
     */
    const loginFormValidation = async (): Promise<void> => {
      if (loginForm.value.email === "" || loginForm.value.password === "") {
        isLoginFormValid.value = false;
      } else {
        isLoginFormValid.value = true;
      }
    };

    /**
     * Handles the submission of the login form and user authentication.
     * @async
     * @function loginUser
     * @returns {Promise<void>} Resolves when the login process is complete.
     * @throws {Error} Throws an error if the login fails.
     */
    const loginUser = async (isDemo: boolean = false): Promise<void> => {
      if (isDemo) {
        isLoginFormValid.value = true;
      } else {
        await loginFormValidation();
      }
      if (isLoginFormValid.value) {
        try {
          const form = loginForm.value;

          const isAuthenticated = await store.dispatch("auth/login", {
            email: isDemo ? "demoUser@mail.com" : form.email,
            password: isDemo ? "demoPassword123" : form.password,
          });

          if (isAuthenticated === true) {
            const fetchSettingsResult = await store.dispatch(
              "settings/fetchSettings"
            );

            if (fetchSettingsResult === "Unauthorized") {
              await store.dispatch("auth/logout");
              router.push("/login");
            } else {
              const redirectPath =
                router.currentRoute.value.query.redirect || "/my-account";
              router.push(redirectPath as string);
            }
          } else if (isAuthenticated === "Invalid credentials") {
            isLoginFormValid.value = false;
          }
        } catch (error) {
          Sentry.captureException(error);
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
.login__card {
  width: 50%;
  margin-right: 25vw;
  margin-left: 25vw;
  margin-top: 100px;
  margin-bottom: 40px;
  padding-right: 50px;
  padding-left: 50px;
}

.login__form {
  display: flex;
  flex-direction: column;
  gap: 5px;
  justify-content: center;
}

.login__button {
  width: 30%;
  align-self: center;
  color: var(--secondary-color);
}

.login__button:hover,
.login__button:active {
  color: var(--primary-color);
}

.login__demo {
  width: 50%;
}

.login__links {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  font-size: 12px;
  margin-top: 20px;
  gap: 5px;
}

.login__link-register {
  color: var(--primary-color);
}

@media (max-width: 1024px) {
  .login__card {
    width: 70%;
    margin-top: 70px;
    margin-right: 15vw;
    margin-left: 15vw;
  }

  .login__button {
    width: 40%;
  }

  .login__demo {
    width: 50%;
  }
}

@media (max-width: 600px) {
  .login__card {
    width: 80%;
    margin-top: 50px;
    margin-right: 10vw;
    margin-left: 10vw;
  }

  .login__button {
    width: 50%;
  }

  .login__demo {
    width: 60%;
  }
}
</style>
