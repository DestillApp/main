[**destillationapp-frontend v0.1.0**](../../../../README.md)

***

[destillationapp-frontend](../../../../modules.md) / [types/forms/distillationForm](../README.md) / ChoosedPlant

# Interface: ChoosedPlant

Defined in: [types/forms/distillationForm.ts:29](https://github.com/DestillApp/main/blob/be94b1d93681946bd573e84cd8381ba32cee62b9/frontend/src/types/forms/distillationForm.ts#L29)

Interface representing a selected plant with required fields.

## Extends

- `Pick`\<[`FormChoosedPlant`](FormChoosedPlant.md), `"name"` \| `"part"`\>

## Properties

### availableWeight

> **availableWeight**: `number`

Defined in: [types/forms/distillationForm.ts:31](https://github.com/DestillApp/main/blob/be94b1d93681946bd573e84cd8381ba32cee62b9/frontend/src/types/forms/distillationForm.ts#L31)

The available weight of the plant.

***

### buyDate?

> `optional` **buyDate**: `string`

Defined in: [types/forms/distillationForm.ts:33](https://github.com/DestillApp/main/blob/be94b1d93681946bd573e84cd8381ba32cee62b9/frontend/src/types/forms/distillationForm.ts#L33)

The date the plant was bought (optional).

***

### harvestDate?

> `optional` **harvestDate**: `string`

Defined in: [types/forms/distillationForm.ts:32](https://github.com/DestillApp/main/blob/be94b1d93681946bd573e84cd8381ba32cee62b9/frontend/src/types/forms/distillationForm.ts#L32)

The date the plant was harvested (optional).

***

### id

> **id**: `string`

Defined in: [types/forms/distillationForm.ts:30](https://github.com/DestillApp/main/blob/be94b1d93681946bd573e84cd8381ba32cee62b9/frontend/src/types/forms/distillationForm.ts#L30)

The unique identifier of the plant.

***

### name

> **name**: `string`

Defined in: [types/forms/distillationForm.ts:12](https://github.com/DestillApp/main/blob/be94b1d93681946bd573e84cd8381ba32cee62b9/frontend/src/types/forms/distillationForm.ts#L12)

The name of the plant.

#### Inherited from

`Pick.name`

***

### part

> **part**: `string`

Defined in: [types/forms/distillationForm.ts:13](https://github.com/DestillApp/main/blob/be94b1d93681946bd573e84cd8381ba32cee62b9/frontend/src/types/forms/distillationForm.ts#L13)

The part of the plant used.

#### Inherited from

`Pick.part`
