[**destillationapp-frontend v0.1.0**](../../../README.md)

***

[destillationapp-frontend](../../../modules.md) / [store/plant](../README.md) / default

# Variable: default

> **default**: `object`

Defined in: [store/plant/index.ts:10](https://github.com/DestillApp/main/blob/76aba95a5d8c1d9174ebde73d7b50f0ea64b491a/frontend/src/store/plant/index.ts#L10)

## Type declaration

### actions

> **actions**: `object` = `plantActions`

Actions for performing asynchronous tasks in the plant module.

#### actions.fetchLocalStorageData()

> **fetchLocalStorageData**(`context`, `key`): `void`

Fetches data from local storage and commits it to the state.

##### Parameters

###### context

`Context`

The Vuex context.

###### key

`string`

The key to fetch from local storage.

##### Returns

`void`

#### actions.setEndTime()

> **setEndTime**(`context`): `void`

Commits the end time format change.

##### Parameters

###### context

`Context`

The Vuex context.

##### Returns

`void`

#### actions.setHarvestRange()

> **setHarvestRange**(`context`): `void`

Commits the harvest range change.

##### Parameters

###### context

`Context`

The Vuex context.

##### Returns

`void`

#### actions.setIntegerValue()

> **setIntegerValue**(`context`, `payload`): `void`

Sets an integer value in the state.

##### Parameters

###### context

`Context`

The Vuex context.

###### payload

The payload containing the input and value.

###### input

`string`

###### value

`number`

##### Returns

`void`

#### actions.setNumberFormat()

> **setNumberFormat**(`context`, `payload`): `void`

Sets the number format in the state.

##### Parameters

###### context

`Context`

The Vuex context.

###### payload

The payload containing the input and value.

###### input

`string`

###### value

`number`

##### Returns

`void`

#### actions.setPlantForm()

> **setPlantForm**(`context`): `void`

Sets the plantForm in the state and localStorage.

##### Parameters

###### context

`Context`

The Vuex context.

##### Returns

`void`

#### actions.setStartTime()

> **setStartTime**(`context`): `void`

Commits the start time format change.

##### Parameters

###### context

`Context`

The Vuex context.

##### Returns

`void`

#### actions.setValue()

> **setValue**(`context`, `payload`): `void`

Sets a value in the state.

##### Parameters

###### context

`Context`

The Vuex context.

###### payload

The payload containing the input and value.

###### input

`string`

###### value

`any`

##### Returns

`void`

### getters

> **getters**: `object` = `plantGetters`

Getters for accessing plant state data.

#### getters.harvestRange()

> **harvestRange**(`state`): \[`number`, `number`\]

Gets the harvest range from the plant form data.

##### Parameters

###### state

`State`

The Vuex state.

##### Returns

\[`number`, `number`\]

The harvest range.

#### getters.plantForm()

> **plantForm**(`state`): [`PlantForm`](../../../types/forms/plantForm/interfaces/PlantForm.md)

Gets the plant form data from the state.

##### Parameters

###### state

`State`

The Vuex state.

##### Returns

[`PlantForm`](../../../types/forms/plantForm/interfaces/PlantForm.md)

The plant form data.

#### getters.plantOrigin()

> **plantOrigin**(`state`): `string`

Gets the plant origin from the plant form data.

##### Parameters

###### state

`State`

The Vuex state.

##### Returns

`string`

The plant origin.

#### getters.plantState()

> **plantState**(`state`): `string`

Gets the plant state from the plant form data.

##### Parameters

###### state

`State`

The Vuex state.

##### Returns

`string`

The plant state.

### mutations

> **mutations**: `object` = `plantMutations`

Mutations for updating the plant state.

#### mutations.changeEndTimeFormat()

> **changeEndTimeFormat**(`state`): `void`

Mutation to change the format of the end time for harvesting.

##### Parameters

###### state

`State`

The current state object.

##### Returns

`void`

#### mutations.changeHarvestRange()

> **changeHarvestRange**(`state`): `void`

Mutation to change the harvest range by formatting the harvestStartTime and harvestEndTime.

##### Parameters

###### state

`State`

The current state object.

##### Returns

`void`

#### mutations.changeIntegerNumber()

> **changeIntegerNumber**(`state`, `payload`): `void`

Mutation to change a value to an integer value in the plant form.

##### Parameters

###### state

`State`

The current state object.

###### payload

Payload containing the input field name and its new integer value.

###### input

`"harvestTemperature"` \| `"dryingTime"` \| `"plantAge"`

###### value

`number`

##### Returns

`void`

#### mutations.changeNumberFormat()

> **changeNumberFormat**(`state`, `payload`): `void`

Mutation to change the format of a number value in the plant form.

##### Parameters

###### state

`State`

The current state object.

###### payload

Payload containing the input field name and its new number value.

###### input

`"plantWeight"` \| `"availableWeight"`

###### value

`number`

##### Returns

`void`

#### mutations.changeStartTimeFormat()

> **changeStartTimeFormat**(`state`): `void`

Mutation to change the format of the start time for harvesting.

##### Parameters

###### state

`State`

The current state object.

##### Returns

`void`

#### mutations.changeValue()

> **changeValue**\<`K`\>(`state`, `payload`): `void`

Mutation to change the value of a field in the plant form.

##### Type Parameters

###### K

`K` *extends* keyof [`PlantForm`](../../../types/forms/plantForm/interfaces/PlantForm.md)

##### Parameters

###### state

`State`

The current state object.

###### payload

`ChangeValuePayload`\<`K`\>

Payload containing the input field name and its new value.

##### Returns

`void`

#### mutations.resetPlantForm()

> **resetPlantForm**(`state`): `void`

Mutation to reset the plantForm and remove plantForm from localStorage.

##### Parameters

###### state

`State`

The current state object.

##### Returns

`void`

### namespaced

> **namespaced**: `boolean` = `true`

### state()

> **state**(): `object`

**`Function`**

State object representing the plant form data.
 state

#### Returns

`object`

The initial state object.

##### plantForm

> **plantForm**: [`PlantForm`](../../../types/forms/plantForm/interfaces/PlantForm.md)
