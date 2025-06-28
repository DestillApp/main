[**destillationapp-frontend v0.1.0**](../../../README.md)

***

[destillationapp-frontend](../../../modules.md) / [helpers/formsNormalize](../README.md) / normalizeSelectedFields

# Function: normalizeSelectedFields()

> **normalizeSelectedFields**\<`T`\>(`data`, `keysToNormalize`): `T`

Defined in: [helpers/formsNormalize.ts:8](https://github.com/DestillApp/main/blob/76aba95a5d8c1d9174ebde73d7b50f0ea64b491a/frontend/src/helpers/formsNormalize.ts#L8)

Normalizes selected fields in an object by converting null or undefined string fields to empty strings.

## Type Parameters

### T

`T` *extends* `Record`\<`string`, `any`\>

The type of the input object.

## Parameters

### data

`T`

The input object to normalize.

### keysToNormalize

keyof `T`[]

The keys of the fields to normalize.

## Returns

`T`

The normalized object with selected fields set to empty strings if they were null or undefined.
