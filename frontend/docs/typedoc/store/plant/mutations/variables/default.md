[**destillationapp-frontend v0.1.0**](../../../../README.md)

***

[destillationapp-frontend](../../../../modules.md) / [store/plant/mutations](../README.md) / default

# Variable: default

> **default**: `object`

Defined in: [store/plant/mutations.ts:46](https://github.com/DestillApp/main/blob/be94b1d93681946bd573e84cd8381ba32cee62b9/frontend/src/store/plant/mutations.ts#L46)

## Type declaration

### changeEndTimeFormat()

> **changeEndTimeFormat**(`state`): `void`

Mutation to change the format of the end time for harvesting.

#### Parameters

##### state

`State`

The current state object.

#### Returns

`void`

### changeHarvestRange()

> **changeHarvestRange**(`state`): `void`

Mutation to change the harvest range by formatting the harvestStartTime and harvestEndTime.

#### Parameters

##### state

`State`

The current state object.

#### Returns

`void`

### changeIntegerNumber()

> **changeIntegerNumber**(`state`, `payload`): `void`

Mutation to change a value to an integer value in the plant form.

#### Parameters

##### state

`State`

The current state object.

##### payload

Payload containing the input field name and its new integer value.

###### input

`"harvestTemperature"` \| `"dryingTime"` \| `"plantAge"`

###### value

`number`

#### Returns

`void`

### changeNumberFormat()

> **changeNumberFormat**(`state`, `payload`): `void`

Mutation to change the format of a number value in the plant form.

#### Parameters

##### state

`State`

The current state object.

##### payload

Payload containing the input field name and its new number value.

###### input

`"plantWeight"` \| `"availableWeight"`

###### value

`number`

#### Returns

`void`

### changeStartTimeFormat()

> **changeStartTimeFormat**(`state`): `void`

Mutation to change the format of the start time for harvesting.

#### Parameters

##### state

`State`

The current state object.

#### Returns

`void`

### changeValue()

> **changeValue**\<`K`\>(`state`, `payload`): `void`

Mutation to change the value of a field in the plant form.

#### Type Parameters

##### K

`K` *extends* keyof [`PlantForm`](../../../../types/forms/plantForm/interfaces/PlantForm.md)

#### Parameters

##### state

`State`

The current state object.

##### payload

`ChangeValuePayload`\<`K`\>

Payload containing the input field name and its new value.

#### Returns

`void`

### resetPlantForm()

> **resetPlantForm**(`state`): `void`

Mutation to reset the plantForm and remove plantForm from localStorage.

#### Parameters

##### state

`State`

The current state object.

#### Returns

`void`
