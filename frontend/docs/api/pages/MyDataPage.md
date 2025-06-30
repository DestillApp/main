# MyDataPage

## Exposed Methods

### `async()`
Fetches user details (username and email) from the server.

```ts
const fetchUserDetails = async (): Promise<void> => {
      try {
        const { data } = await apolloClient.query({
          query: GET_USER_DETAILS,
          fetchPolicy: "network-only",
        });
        username.value = data.getUserDetails.username;
        email.value = data.getUserDetails.email;
      } catch (error: any) {
        await handleUserError(error);
      }
    };
```

### `function()`
Opens the distiller form modal.

```ts
const openDistillerForm = (): void => {
      isDistillerFormOpen.value = true;
    };
```

### `function()`
Closes the distiller form modal.

```ts
const closeDistillerForm = (): void => {
      isDistillerFormOpen.value = false;
    };
```

### `function()`
Opens the delete distiller modal for a given distiller id.

```ts
const openDeleteModal = (id: string): void => {
      selectedDistillerId.value = id;
      isDeleteModalOpen.value = true;
    };
```

### `function()`
Closes the delete distiller modal.

```ts
const closeDeleteModal = (): void => {
      isDeleteModalOpen.value = false;
      selectedDistillerId.value = "";
    };
```

### `async()`
Deletes the selected distiller by id.

```ts
const deleteDistiller = async (): Promise<void> => {
      try {
        const deleteDistiller = await store.dispatch(
          "settings/deleteDistillerById",
          selectedDistillerId.value
        );
        if (deleteDistiller === "Unauthorized") {
          await store.dispatch("auth/logout");
          router.push("/login");
          return;
        } else {
          closeDeleteModal();
        }
      } catch (error) {
        Sentry.captureException(error);
        console.error("Failed to delete distiller:", error);
      }
    };
```

### `function()`
Opens the password change form modal.

```ts
const openPasswordChangeForm = (): void => {
      isPasswordChangeFormOpen.value = true;
    };
```

### `function()`
Closes the password change form modal.

```ts
const closePasswordChangeForm = (): void => {
      isPasswordChangeFormOpen.value = false;
    };
```
