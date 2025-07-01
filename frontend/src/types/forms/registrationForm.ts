/**
 * Interface representing the structure of the registration form data.
 * @interface RegistrationForm
 * @property {string} username - The username chosen by the user.
 * @property {string} email - The user's email address.
 * @property {string} password - The user's password.
 */
export interface RegistrationForm {
  username: string;
  email: string;
  password: string;
}
