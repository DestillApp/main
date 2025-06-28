[**destillationapp-frontend v0.1.0**](../../../../README.md)

***

[destillationapp-frontend](../../../../modules.md) / [store/auth/mutations](../README.md) / default

# Variable: default

> **default**: `object`

Defined in: [store/auth/mutations.ts:7](https://github.com/DestillApp/main/blob/76aba95a5d8c1d9174ebde73d7b50f0ea64b491a/frontend/src/store/auth/mutations.ts#L7)

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
