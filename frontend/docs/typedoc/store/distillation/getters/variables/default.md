[**destillationapp-frontend v0.1.0**](../../../../README.md)

***

[destillationapp-frontend](../../../../modules.md) / [store/distillation/getters](../README.md) / default

# Variable: default

> **default**: `object`

Defined in: [store/distillation/getters.ts:17](https://github.com/DestillApp/main/blob/be94b1d93681946bd573e84cd8381ba32cee62b9/frontend/src/store/distillation/getters.ts#L17)

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
