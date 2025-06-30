[**destillationapp-frontend v0.1.0**](../../../../README.md)

***

[destillationapp-frontend](../../../../modules.md) / [store/auth/actions](../README.md) / default

# Variable: default

> **default**: `object`

Defined in: [store/auth/actions.ts:25](https://github.com/DestillApp/main/blob/be94b1d93681946bd573e84cd8381ba32cee62b9/frontend/src/store/auth/actions.ts#L25)

## Type declaration

### changePassword()

> **changePassword**(`context`, `param1`): `Promise`\<`string` \| `boolean`\>

Changes the user's password.

#### Parameters

##### context

`Context`

The Vuex action context.

##### param1

The old and new passwords.

###### newPassword

`string`

###### oldPassword

`string`

#### Returns

`Promise`\<`string` \| `boolean`\>

Resolves to true if successful, "Invalid old password" if failed, or throws an error.

### fetchUserAuthenticationStatus()

> **fetchUserAuthenticationStatus**(`context`): `Promise`\<`boolean`\>

Fetches the user's authentication status from the backend.

#### Parameters

##### context

`Context`

The Vuex action context.

#### Returns

`Promise`\<`boolean`\>

Resolves to true if authenticated, otherwise false.

### login()

> **login**(`context`, `param1`): `Promise`\<`undefined` \| `string` \| `boolean`\>

Logs in the user with the provided credentials.

#### Parameters

##### context

`Context`

The Vuex action context.

##### param1

The user's email and password.

###### email

`string`

###### password

`string`

#### Returns

`Promise`\<`undefined` \| `string` \| `boolean`\>

Resolves to true if successful, "Invalid credentials" if failed, or throws an error.

### logout()

> **logout**(`context`): `Promise`\<`void`\>

Logs out the user and clears relevant local storage.

#### Parameters

##### context

`Context`

The Vuex action context.

#### Returns

`Promise`\<`void`\>

Resolves when logout is complete.

### setLoadingAuthStatus()

> **setLoadingAuthStatus**(`context`, `value`): `void`

Sets the loading status for authentication actions.

#### Parameters

##### context

`Context`

The Vuex action context.

##### value

`boolean`

The loading status value.

#### Returns

`void`
