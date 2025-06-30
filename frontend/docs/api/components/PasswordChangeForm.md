# PasswordChangeForm

## Exposed Methods

### `function()`
Checks if the new password meets the required format.

```ts
const checkPassword = (): void => {
      const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
      isPasswordCorrect.value = passwordRegex.test(newPassword.value);
    };
```

### `async()`
Handles password change form submission, validates input, and dispatches the change password action.

```ts
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
```

### `function()`
Emits the close-modal event to close the modal.

```ts
const closeModal = (): void => {
      emit("close-modal");
    };
```
