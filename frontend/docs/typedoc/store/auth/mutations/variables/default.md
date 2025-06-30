[**destillationapp-frontend v0.1.0**](../../../../README.md)

***

[destillationapp-frontend](../../../../modules.md) / [store/auth/mutations](../README.md) / default

# Variable: default

> **default**: `object`

Defined in: [store/auth/mutations.ts:7](https://github.com/DestillApp/main/blob/be94b1d93681946bd573e84cd8381ba32cee62b9/frontend/src/store/auth/mutations.ts#L7)

## Type declaration

### changeLoadingAuthStatus()

> **changeLoadingAuthStatus**(`state`, `value`): `void`

Sets the loading status for authentication.

#### Parameters

##### state

[`AuthState`](../../interfaces/AuthState.md)

The Vuex state object.

##### value

`boolean`

The loading status.

#### Returns

`void`

### changeUserAuthenticationStatus()

> **changeUserAuthenticationStatus**(`state`, `value`): `void`

Sets the user's authentication status.

#### Parameters

##### state

[`AuthState`](../../interfaces/AuthState.md)

The Vuex state object.

##### value

`boolean`

The authentication status.

#### Returns

`void`
