[**destillationapp-frontend v0.1.0**](../../../README.md)

***

[destillationapp-frontend](../../../modules.md) / [helpers/formsNormalize](../README.md) / normalizeSelectedFields

# Function: normalizeSelectedFields()

> **normalizeSelectedFields**\<`T`\>(`data`, `keysToNormalize`): `T`

Defined in: [helpers/formsNormalize.ts:8](https://github.com/DestillApp/main/blob/ec2df52a50a22efb35f12a0243274f6d03fbca52/frontend/src/helpers/formsNormalize.ts#L8)

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
