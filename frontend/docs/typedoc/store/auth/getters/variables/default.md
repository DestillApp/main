[**destillationapp-frontend v0.1.0**](../../../../README.md)

***

[destillationapp-frontend](../../../../modules.md) / [store/auth/getters](../README.md) / default

# Variable: default

> **default**: `object`

Defined in: [store/auth/getters.ts:7](https://github.com/DestillApp/main/blob/ec2df52a50a22efb35f12a0243274f6d03fbca52/frontend/src/store/auth/getters.ts#L7)

## Type declaration

### isAuthenticated()

> **isAuthenticated**(`state`): `boolean`

Returns the user's authentication status.

#### Parameters

##### state

[`AuthState`](../../interfaces/AuthState.md)

The Vuex state object.

#### Returns

`boolean`

`true` if the user is authenticated, otherwise `false`.

### isLoadingAuthStatus()

> **isLoadingAuthStatus**(`state`): `boolean`

Returns the loading status of the authentication process.

#### Parameters

##### state

[`AuthState`](../../interfaces/AuthState.md)

The Vuex state object.

#### Returns

`boolean`

`true` if authentication status is loading, otherwise `false`.
