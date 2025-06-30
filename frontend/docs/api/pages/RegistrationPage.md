# RegistrationPage

## Exposed Methods

### `async()`
Checks if the username already exists in the database.

```ts
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
```

### `function()`
Resets the username existence state.

```ts
const resetUsernameExists = (): void => {
      usernameExists.value = false;
    };
```

### `function()`
Checks if the password is correct on input change.

```ts
const checkPassword = (): void => {
      const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
      isPasswordCorrect.value = passwordRegex.test(
        registrationForm.value.password
      );
    };
```

### `async()`
Handles the submission of the registration form.
Sanitizes user input and sends a GraphQL mutation to register the user.

```ts
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
```

### `function()`
Resets the email existence state.

```ts
const resetEmailExists = (): void => {
      emailExists.value = false;
    };
```

### `async()`
Validates the form and calls submitRegistrationForm if valid.

```ts
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
```
