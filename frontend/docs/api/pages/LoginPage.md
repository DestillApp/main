# LoginPage

## Exposed Methods

### `async()`
Validates the login form data.

```ts
const loginFormValidation = async (): Promise<void> => {
      if (loginForm.value.email === "" || loginForm.value.password === "") {
        isLoginFormValid.value = false;
      } else {
        isLoginFormValid.value = true;
      }
    };
```

### `async()`
Handles the submission of the login form and user authentication.

```ts
const loginUser = async (): Promise<void> => {
      await loginFormValidation();
      if (isLoginFormValid.value) {
        try {
          const form = loginForm.value;

          const isAuthenticated = await store.dispatch("auth/login", {
            email: form.email,
            password: form.password,
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
```
