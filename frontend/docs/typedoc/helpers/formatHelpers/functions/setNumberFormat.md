[**destillationapp-frontend v0.1.0**](../../../README.md)

***

[destillationapp-frontend](../../../modules.md) / [helpers/formatHelpers](../README.md) / setNumberFormat

# Function: setNumberFormat()

> **setNumberFormat**(`store`, `value`, `id`, `storeName`, `decimals?`): `void`

Defined in: [helpers/formatHelpers.ts:13](https://github.com/DestillApp/main/blob/ec2df52a50a22efb35f12a0243274f6d03fbca52/frontend/src/helpers/formatHelpers.ts#L13)

Formats the number input and dispatches the formatted value to the store.

## Parameters

### store

`any`

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
