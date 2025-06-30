# RegistrationPage

This component renders a registration form and handles user registration.
 *

## Exposed Methods

### `checkUsername()`
Checks if the username already exists in the database.

### `resetUsernameExists()`
Resets the username existence state.

### `checkPassword()`
Checks if the password is correct on input change.

### `submitRegistrationForm()`
Handles the submission of the registration form.
Sanitizes user input and sends a GraphQL mutation to register the user.

### `resetEmailExists()`
Resets the email existence state.

### `saveRegistration()`
Validates the form and calls submitRegistrationForm if valid.
