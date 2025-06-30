[**destillationapp-frontend v0.1.0**](../../../README.md)

***

[destillationapp-frontend](../../../modules.md) / [types/events](../README.md) / InputEvents

# Interface: InputEvents()

Defined in: [types/events.ts:15](https://github.com/DestillApp/main/blob/be94b1d93681946bd573e84cd8381ba32cee62b9/frontend/src/types/events.ts#L15)

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

Defined in: [types/events.ts:16](https://github.com/DestillApp/main/blob/be94b1d93681946bd573e84cd8381ba32cee62b9/frontend/src/types/events.ts#L16)

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

Defined in: [types/events.ts:17](https://github.com/DestillApp/main/blob/be94b1d93681946bd573e84cd8381ba32cee62b9/frontend/src/types/events.ts#L17)

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

Defined in: [types/events.ts:18](https://github.com/DestillApp/main/blob/be94b1d93681946bd573e84cd8381ba32cee62b9/frontend/src/types/events.ts#L18)

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

Defined in: [types/events.ts:19](https://github.com/DestillApp/main/blob/be94b1d93681946bd573e84cd8381ba32cee62b9/frontend/src/types/events.ts#L19)

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
