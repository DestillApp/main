[**destillationapp-frontend v0.1.0**](../../../README.md)

***

[destillationapp-frontend](../../../modules.md) / [helpers/formatHelpers](../README.md) / setNumberFormat

# Function: setNumberFormat()

> **setNumberFormat**(`store`, `value`, `id`, `storeName`, `decimals?`): `void`

Defined in: [helpers/formatHelpers.ts:13](https://github.com/DestillApp/main/blob/be94b1d93681946bd573e84cd8381ba32cee62b9/frontend/src/helpers/formatHelpers.ts#L13)

Formats the number input and dispatches the formatted value to the store.

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

### decimals?

`number`

Optional number of decimal places.

## Returns

`void`
