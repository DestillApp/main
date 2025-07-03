# MyDataPage

[View source on GitHub](https://github.com/DestillApp/main/blob/main/frontend/src/pages/my-account/MyDataPage.vue)

Displays user data, list of distillers, theme settings, and allows managing distillers and password. Handles fetching user info, theme switching, and modal dialogs.
 *

## Exposed Methods

### `fetchUserDetails()`
Fetches user details (username and email) from the server.

### `openDistillerForm()`
Opens the distiller form modal.

### `closeDistillerForm()`
Closes the distiller form modal.

### `openDeleteModal()`
Opens the delete distiller modal for a given distiller id.

**Parameters:**
- `id` (`string`): The distiller id to delete.

### `closeDeleteModal()`
Closes the delete distiller modal.

### `deleteDistiller()`
Deletes the selected distiller by id.

### `openPasswordChangeForm()`
Opens the password change form modal.

### `closePasswordChangeForm()`
Closes the password change form modal.
