[**destillationapp-frontend v0.1.0**](../../../README.md)

***

[destillationapp-frontend](../../../modules.md) / [store/auth](../README.md) / default

# Variable: default

> **default**: `object`

Defined in: [store/auth/index.ts:20](https://github.com/DestillApp/main/blob/be94b1d93681946bd573e84cd8381ba32cee62b9/frontend/src/store/auth/index.ts#L20)

## Type declaration

### actions

> **actions**: `object` = `authActions`

Actions for performing asynchronous authentication tasks.

#### actions.changePassword()

> **changePassword**(`context`, `param1`): `Promise`\<`string` \| `boolean`\>

Changes the user's password.

##### Parameters

###### context

`Context`

The Vuex action context.

###### param1

The old and new passwords.

###### newPassword

`string`

###### oldPassword

`string`

##### Returns

`Promise`\<`string` \| `boolean`\>

Resolves to true if successful, "Invalid old password" if failed, or throws an error.

#### actions.fetchUserAuthenticationStatus()

> **fetchUserAuthenticationStatus**(`context`): `Promise`\<`boolean`\>

Fetches the user's authentication status from the backend.

##### Parameters

###### context

`Context`

The Vuex action context.

##### Returns

`Promise`\<`boolean`\>

Resolves to true if authenticated, otherwise false.

#### actions.login()

> **login**(`context`, `param1`): `Promise`\<`undefined` \| `string` \| `boolean`\>

Logs in the user with the provided credentials.

##### Parameters

###### context

`Context`

The Vuex action context.

###### param1

The user's email and password.

###### email

`string`

###### password

`string`

##### Returns

`Promise`\<`undefined` \| `string` \| `boolean`\>

Resolves to true if successful, "Invalid credentials" if failed, or throws an error.

#### actions.logout()

> **logout**(`context`): `Promise`\<`void`\>

Logs out the user and clears relevant local storage.

##### Parameters

###### context

`Context`

The Vuex action context.

##### Returns

`Promise`\<`void`\>

Resolves when logout is complete.

#### actions.setLoadingAuthStatus()

> **setLoadingAuthStatus**(`context`, `value`): `void`

Sets the loading status for authentication actions.

##### Parameters

###### context

`Context`

The Vuex action context.

###### value

`boolean`

The loading status value.

##### Returns

`void`

### getters

> **getters**: `object` = `authGetters`

Getters for accessing authentication state data.

#### getters.isAuthenticated()

> **isAuthenticated**(`state`): `boolean`

Returns the user's authentication status.

##### Parameters

###### state

[`AuthState`](../interfaces/AuthState.md)

The Vuex state object.

##### Returns

`boolean`

`true` if the user is authenticated, otherwise `false`.

#### getters.isLoadingAuthStatus()

> **isLoadingAuthStatus**(`state`): `boolean`

Returns the loading status of the authentication process.

##### Parameters

###### state

[`AuthState`](../interfaces/AuthState.md)

The Vuex state object.

##### Returns

`boolean`

`true` if authentication status is loading, otherwise `false`.

### mutations

> **mutations**: `object` = `authMutations`

Mutations for updating the authentication state.

#### mutations.changeLoadingAuthStatus()

> **changeLoadingAuthStatus**(`state`, `value`): `void`

Sets the loading status for authentication.

##### Parameters

###### state

[`AuthState`](../interfaces/AuthState.md)

The Vuex state object.

###### value

`boolean`

The loading status.

##### Returns

`void`

#### mutations.changeUserAuthenticationStatus()

> **changeUserAuthenticationStatus**(`state`, `value`): `void`

Sets the user's authentication status.

##### Parameters

###### state

[`AuthState`](../interfaces/AuthState.md)

The Vuex state object.

###### value

`boolean`

The authentication status.

##### Returns

`void`

### namespaced

> **namespaced**: `boolean` = `true`

### state()

> **state**(): [`AuthState`](../interfaces/AuthState.md)

**`Function`**

Returns the initial state for the auth module.

#### Returns

[`AuthState`](../interfaces/AuthState.md)

The initial authentication state.
