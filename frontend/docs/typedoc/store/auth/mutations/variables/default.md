[**destillationapp-frontend v0.1.0**](../../../../README.md)

***

[destillationapp-frontend](../../../../modules.md) / [store/auth/mutations](../README.md) / default

# Variable: default

> **default**: `object`

Defined in: [store/auth/mutations.ts:7](https://github.com/DestillApp/main/blob/ec2df52a50a22efb35f12a0243274f6d03fbca52/frontend/src/store/auth/mutations.ts#L7)

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
