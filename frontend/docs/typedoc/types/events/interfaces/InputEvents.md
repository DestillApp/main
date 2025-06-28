[**destillationapp-frontend v0.1.0**](../../../README.md)

***

[destillationapp-frontend](../../../modules.md) / [types/events](../README.md) / InputEvents

# Interface: InputEvents()

Defined in: [types/events.ts:15](https://github.com/DestillApp/main/blob/76aba95a5d8c1d9174ebde73d7b50f0ea64b491a/frontend/src/types/events.ts#L15)

Events emitted by input components.

## Param

Update the model value.

## Param

The new value.

## Param

Optional identifier.

## Param

Choose an item from a list.

## Param

The chosen item.

## Param

Optional identifier.

## Param

Triggered on blur.

## Param

Open the list.

## Call Signature

> **InputEvents**(`e`, `value`, `id?`): `void`

Defined in: [types/events.ts:16](https://github.com/DestillApp/main/blob/76aba95a5d8c1d9174ebde73d7b50f0ea64b491a/frontend/src/types/events.ts#L16)

Events emitted by input components.

### Parameters

#### e

`"update:modelValue"`

#### value

`string` | `number`

#### id?

`string`

### Returns

`void`

### Param

Update the model value.

### Param

The new value.

### Param

Optional identifier.

### Param

Choose an item from a list.

### Param

The chosen item.

### Param

Optional identifier.

### Param

Triggered on blur.

### Param

Open the list.

## Call Signature

> **InputEvents**(`e`, `result`, `id?`): `void`

Defined in: [types/events.ts:17](https://github.com/DestillApp/main/blob/76aba95a5d8c1d9174ebde73d7b50f0ea64b491a/frontend/src/types/events.ts#L17)

Events emitted by input components.

### Parameters

#### e

`"choose:item"`

#### result

`any`

#### id?

`string`

### Returns

`void`

### Param

Update the model value.

### Param

The new value.

### Param

Optional identifier.

### Param

Choose an item from a list.

### Param

The chosen item.

### Param

Optional identifier.

### Param

Triggered on blur.

### Param

Open the list.

## Call Signature

> **InputEvents**(`e`): `void`

Defined in: [types/events.ts:18](https://github.com/DestillApp/main/blob/76aba95a5d8c1d9174ebde73d7b50f0ea64b491a/frontend/src/types/events.ts#L18)

Events emitted by input components.

### Parameters

#### e

`"update:onBlur"`

### Returns

`void`

### Param

Update the model value.

### Param

The new value.

### Param

Optional identifier.

### Param

Choose an item from a list.

### Param

The chosen item.

### Param

Optional identifier.

### Param

Triggered on blur.

### Param

Open the list.

## Call Signature

> **InputEvents**(`e`): `void`

Defined in: [types/events.ts:19](https://github.com/DestillApp/main/blob/76aba95a5d8c1d9174ebde73d7b50f0ea64b491a/frontend/src/types/events.ts#L19)

Events emitted by input components.

### Parameters

#### e

`"open:list"`

### Returns

`void`

### Param

Update the model value.

### Param

The new value.

### Param

Optional identifier.

### Param

Choose an item from a list.

### Param

The chosen item.

### Param

Optional identifier.

### Param

Triggered on blur.

### Param

Open the list.
