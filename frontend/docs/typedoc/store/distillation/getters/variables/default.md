[**destillationapp-frontend v0.1.0**](../../../../README.md)

***

[destillationapp-frontend](../../../../modules.md) / [store/distillation/getters](../README.md) / default

# Variable: default

> **default**: `object`

Defined in: [store/distillation/getters.ts:17](https://github.com/DestillApp/main/blob/ec2df52a50a22efb35f12a0243274f6d03fbca52/frontend/src/store/distillation/getters.ts#L17)

## Type declaration

### distillationDate()

> **distillationDate**(`state`): `string`

Gets the distillation date from the distillation form data.

#### Parameters

##### state

`State`

The Vuex state.

#### Returns

`string`

Distillation date.

### distillationForm()

> **distillationForm**(`state`): [`DistillationForm`](../../../../types/forms/distillationForm/interfaces/DistillationForm.md)

Gets the distillation form data from the state.

#### Parameters

##### state

`State`

The Vuex state.

#### Returns

[`DistillationForm`](../../../../types/forms/distillationForm/interfaces/DistillationForm.md)

The distillation form data.

### isPlantShredded()

> **isPlantShredded**(`state`): `boolean`

Gets the shredded status of the plant from the distillation form data.

#### Parameters

##### state

`State`

The Vuex state.

#### Returns

`boolean`

Whether the plant is shredded.

### isPlantSoaked()

> **isPlantSoaked**(`state`): `boolean`

Gets the soaked status of the plant from the distillation form data.

#### Parameters

##### state

`State`

The Vuex state.

#### Returns

`boolean`

Whether the plant is soaked.
