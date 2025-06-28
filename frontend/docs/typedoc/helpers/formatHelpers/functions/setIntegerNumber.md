[**destillationapp-frontend v0.1.0**](../../../README.md)

***

[destillationapp-frontend](../../../modules.md) / [helpers/formatHelpers](../README.md) / setIntegerNumber

# Function: setIntegerNumber()

> **setIntegerNumber**(`store`, `value`, `id`, `storeName`): `void`

Defined in: [helpers/formatHelpers.ts:40](https://github.com/DestillApp/main/blob/76aba95a5d8c1d9174ebde73d7b50f0ea64b491a/frontend/src/helpers/formatHelpers.ts#L40)

Formats the number input to an integer and dispatches the value to the store.

## Parameters

### store

`Store`\<[`RootState`](../../../types/store/interfaces/RootState.md)\>

The Vuex store instance.

### value

The value to be formatted and set.

`string` | `number`

### id

`string`

The input identifier.

### storeName

`string`

The Vuex module name.

## Returns

`void`
