[**destillationapp-frontend v0.1.0**](../../../../README.md)

***

[destillationapp-frontend](../../../../modules.md) / [store/plant/getters](../README.md) / default

# Variable: default

> **default**: `object`

Defined in: [store/plant/getters.ts:17](https://github.com/DestillApp/main/blob/ec2df52a50a22efb35f12a0243274f6d03fbca52/frontend/src/store/plant/getters.ts#L17)

## Type declaration

### harvestRange()

> **harvestRange**(`state`): \[`number`, `number`\]

Gets the harvest range from the plant form data.

#### Parameters

##### state

`State`

The Vuex state.

#### Returns

\[`number`, `number`\]

The harvest range.

### plantForm()

> **plantForm**(`state`): [`PlantForm`](../../../../types/forms/plantForm/interfaces/PlantForm.md)

Gets the plant form data from the state.

#### Parameters

##### state

`State`

The Vuex state.

#### Returns

[`PlantForm`](../../../../types/forms/plantForm/interfaces/PlantForm.md)

The plant form data.

### plantOrigin()

> **plantOrigin**(`state`): `string`

Gets the plant origin from the plant form data.

#### Parameters

##### state

`State`

The Vuex state.

#### Returns

`string`

The plant origin.

### plantState()

> **plantState**(`state`): `string`

Gets the plant state from the plant form data.

#### Parameters

##### state

`State`

The Vuex state.

#### Returns

`string`

The plant state.
