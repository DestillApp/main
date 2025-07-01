[**destillationapp-frontend v0.1.0**](../../../README.md)

***

[destillationapp-frontend](../../../modules.md) / [store/distillation](../README.md) / default

# Variable: default

> **default**: `object`

Defined in: [store/distillation/index.ts:10](https://github.com/DestillApp/main/blob/ec2df52a50a22efb35f12a0243274f6d03fbca52/frontend/src/store/distillation/index.ts#L10)

## Type declaration

### actions

> **actions**: `object` = `distillationActions`

Actions for performing asynchronous tasks in the distillation module.

#### actions.fetchLocalStorageData()

> **fetchLocalStorageData**(`context`, `param1`): `void`

Fetches data from local storage and commits it to the state.

##### Parameters

###### context

`Context`

The Vuex context.

###### param1

The payload with key and isPlant.

###### isPlant

`boolean`

###### key

`string`

##### Returns

`void`

#### actions.fetchTimeFromLocalStorageData()

> **fetchTimeFromLocalStorageData**(`context`, `key`): `void`

Fetches time data from local storage and commits it to the state.

##### Parameters

###### context

`Context`

The Vuex context.

###### key

`string`

The key to fetch from local storage.

##### Returns

`void`

#### actions.setChoosedPlant()

> **setChoosedPlant**(`context`, `param1`): `void`

Sets a value in the choosed plant state.

##### Parameters

###### context

`Context`

The Vuex context.

###### param1

The payload containing the key and value.

###### key

`string`

###### value

`any`

##### Returns

`void`

#### actions.setDistillationForm()

> **setDistillationForm**(`context`): `void`

Sets the distillationForm in the state and localStorage.

##### Parameters

###### context

`Context`

The Vuex context.

##### Returns

`void`

#### actions.setDistillationTime()

> **setDistillationTime**(`context`, `param1`): `void`

Sets a value in the distillation time state.

##### Parameters

###### context

`Context`

The Vuex context.

###### param1

The payload containing the key and value.

###### key

`string`

###### value

`null` \| `number`

##### Returns

`void`

#### actions.setIntegerValue()

> **setIntegerValue**(`context`, `param1`): `void`

Sets an integer value in the state.

##### Parameters

###### context

`Context`

The Vuex context.

###### param1

The payload containing the input and value.

###### input

`string`

###### value

`number`

##### Returns

`void`

#### actions.setNumberFormat()

> **setNumberFormat**(`context`, `param1`): `void`

Sets the number format in the state.

##### Parameters

###### context

`Context`

The Vuex context.

###### param1

The payload containing the input and value.

###### input

`string`

###### value

`number`

##### Returns

`void`

#### actions.setValue()

> **setValue**(`context`, `param1`): `void`

Sets a value in the state.

##### Parameters

###### context

`Context`

The Vuex context.

###### param1

The payload with input and value.

###### input

`string`

###### value

`any`

##### Returns

`void`

### getters

> **getters**: `object` = `distillationGetters`

Getters for accessing distillation state data.

#### getters.distillationDate()

> **distillationDate**(`state`): `string`

Gets the distillation date from the distillation form data.

##### Parameters

###### state

`State`

The Vuex state.

##### Returns

`string`

Distillation date.

#### getters.distillationForm()

> **distillationForm**(`state`): [`DistillationForm`](../../../types/forms/distillationForm/interfaces/DistillationForm.md)

Gets the distillation form data from the state.

##### Parameters

###### state

`State`

The Vuex state.

##### Returns

[`DistillationForm`](../../../types/forms/distillationForm/interfaces/DistillationForm.md)

The distillation form data.

#### getters.isPlantShredded()

> **isPlantShredded**(`state`): `boolean`

Gets the shredded status of the plant from the distillation form data.

##### Parameters

###### state

`State`

The Vuex state.

##### Returns

`boolean`

Whether the plant is shredded.

#### getters.isPlantSoaked()

> **isPlantSoaked**(`state`): `boolean`

Gets the soaked status of the plant from the distillation form data.

##### Parameters

###### state

`State`

The Vuex state.

##### Returns

`boolean`

Whether the plant is soaked.

### mutations

> **mutations**: `object` = `distillationMutations`

Mutations for updating the distillation state.

#### mutations.changeChoosedPlant()

> **changeChoosedPlant**\<`K`\>(`state`, `payload`): `void`

Mutation to change the value of a field in the distillation form choosedPlant.

##### Type Parameters

###### K

`K` *extends* keyof [`FormChoosedPlant`](../../../types/forms/distillationForm/interfaces/FormChoosedPlant.md)

##### Parameters

###### state

`State`

The current state object.

###### payload

`ChangeChoosedPlant`\<`K`\>

Payload containing the key in the choosedPlant object and its new value.

##### Returns

`void`

#### mutations.changeDistillationTime()

> **changeDistillationTime**\<`K`\>(`state`, `payload`): `void`

Mutation to change the value of a field in the distillation time object.

##### Type Parameters

###### K

`K` *extends* keyof [`DistillationTime`](../../../types/forms/distillationForm/interfaces/DistillationTime.md)

##### Parameters

###### state

`State`

The current state object.

###### payload

`ChangeDistillationTime`\<`K`\>

Payload containing the key in the distillationTime object and its new value.

##### Returns

`void`

#### mutations.changeIntegerNumber()

> **changeIntegerNumber**(`state`, `payload`): `void`

Mutation to change a value to an integer value in the distillation form.

##### Parameters

###### state

`State`

The current state object.

###### payload

Payload containing the input field name and its new integer value.

###### input

`"soakingTime"`

###### value

`number`

##### Returns

`void`

#### mutations.changeNumberFormat()

> **changeNumberFormat**(`state`, `payload`): `void`

Mutation to change the format of a number value in the distillation form.

##### Parameters

###### state

`State`

The current state object.

###### payload

Payload containing the input field name and its new formatted number value.

###### input

`"weightForDistillation"` \| `"weightAfterSoaking"`

###### value

`number`

##### Returns

`void`

#### mutations.changeValue()

> **changeValue**\<`K`\>(`state`, `payload`): `void`

Mutation to change the value of a field in the distillation form.

##### Type Parameters

###### K

`K` *extends* keyof [`DistillationForm`](../../../types/forms/distillationForm/interfaces/DistillationForm.md)

##### Parameters

###### state

`State`

The current state object.

###### payload

`ChangeValuePayload`\<`K`\>

Payload containing the input field name and its new value.

##### Returns

`void`

#### mutations.resetDistillationForm()

> **resetDistillationForm**(`state`): `void`

Mutation to reset the distillationForm and remove distillationForm from localStorage.

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

State object representing the distillation form data.

#### Returns

`object`

The initial state object.

##### distillationForm

> **distillationForm**: [`DistillationForm`](../../../types/forms/distillationForm/interfaces/DistillationForm.md)
