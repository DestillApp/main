[**destillationapp-frontend v0.1.0**](../../../README.md)

***

[destillationapp-frontend](../../../modules.md) / [store/results](../README.md) / default

# Variable: default

> **default**: `object`

Defined in: [store/results/index.ts:10](https://github.com/DestillApp/main/blob/be94b1d93681946bd573e84cd8381ba32cee62b9/frontend/src/store/results/index.ts#L10)

## Type declaration

### actions

> **actions**: `object` = `resultsActions`

Actions for performing asynchronous tasks in the results module.

#### actions.fetchDistillationDataFromLocalStorage()

> **fetchDistillationDataFromLocalStorage**(`context`, `key`): `void`

Fetches distillationData from local storage and commits it to the state.

##### Parameters

###### context

`Context`

The Vuex context.

###### key

`string`

The key to fetch from local storage.

##### Returns

`void`

#### actions.fetchDistillationTimeFromLocalStorage()

> **fetchDistillationTimeFromLocalStorage**(`context`, `key`): `void`

Fetches distillation time data from local storage and commits it to the state.

##### Parameters

###### context

`Context`

The Vuex context.

###### key

`string`

The key to fetch from local storage.

##### Returns

`void`

#### actions.fetchDistilledPlantFromLocalStorage()

> **fetchDistilledPlantFromLocalStorage**(`context`, `key`): `void`

Fetches distilledPlant data from local storage and commits it to the state.

##### Parameters

###### context

`Context`

The Vuex context.

###### key

`string`

The key to fetch from local storage.

##### Returns

`void`

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

#### actions.setDistillationDataValue()

> **setDistillationDataValue**(`context`, `payload`): `void`

Sets a value inside distillationData in the state.

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

#### actions.setDistillationTime()

> **setDistillationTime**(`context`, `payload`): `void`

Sets a value inside distillationTime in the state.

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

###### object?

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

###### decimals?

`number`

###### input

`string`

###### value

`number`

##### Returns

`void`

#### actions.setPlantDataValue()

> **setPlantDataValue**(`context`, `payload`): `void`

Sets a value inside plantData in the state.

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

#### actions.setResultsForm()

> **setResultsForm**(`context`): `void`

Sets the resultsForm in the state and localStorage.

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

> **getters**: `object` = `resultsGetters`

Getters for accessing results state data.

#### getters.distillationData()

> **distillationData**(`state`): [`ResultsDistillation`](../../../types/forms/resultsForm/interfaces/ResultsDistillation.md)

Gets the distillation data from the results form data.

##### Parameters

###### state

`State`

The Vuex state.

##### Returns

[`ResultsDistillation`](../../../types/forms/resultsForm/interfaces/ResultsDistillation.md)

The distillation data.

#### getters.distillationDate()

> **distillationDate**(`state`): `string`

Gets the distillation date from the distillation data.

##### Parameters

###### state

`State`

The Vuex state.

##### Returns

`string`

The distillation date.

#### getters.distilledPlant()

> **distilledPlant**(`state`): [`ResultsPlant`](../../../types/forms/resultsForm/interfaces/ResultsPlant.md)

Gets the distilled plant from the results form data.

##### Parameters

###### state

`State`

The Vuex state.

##### Returns

[`ResultsPlant`](../../../types/forms/resultsForm/interfaces/ResultsPlant.md)

The distilled plant data.

#### getters.resultsForm()

> **resultsForm**(`state`): [`ResultsForm`](../../../types/forms/resultsForm/interfaces/ResultsForm.md)

Gets the results form data from the state.

##### Parameters

###### state

`State`

The Vuex state.

##### Returns

[`ResultsForm`](../../../types/forms/resultsForm/interfaces/ResultsForm.md)

The results form data.

### mutations

> **mutations**: `object` = `resultsMutations`

Mutations for updating the results state.

#### mutations.changeDistillationDataValue()

> **changeDistillationDataValue**\<`K`\>(`state`, `payload`): `void`

Mutation to change the value of a field inside distillationData in the results form.

##### Type Parameters

###### K

`K` *extends* keyof [`ResultsDistillation`](../../../types/forms/resultsForm/interfaces/ResultsDistillation.md)

##### Parameters

###### state

`State`

The current state object.

###### payload

`ChangeDistillationDataPayload`\<`K`\>

Payload containing the input field name and its new value for distillationData.

##### Returns

`void`

#### mutations.changeDistillationTimeValue()

> **changeDistillationTimeValue**(`state`, `payload`): `void`

Mutation to change the value of distillationHours and distillationMinutes inside distillationTime in the results form.

##### Parameters

###### state

`State`

The current state object.

###### payload

`ChangeDistillationTimePayload`

Payload containing the input field name and its new value for distillationTime.

##### Returns

`void`

#### mutations.changeIntegerNumber()

> **changeIntegerNumber**(`state`, `payload`): `void`

Mutation to change a value to an integer value in the results form.

##### Parameters

###### state

`State`

The current state object.

###### payload

Payload containing the input field name, its new integer value, and the object type.

###### input

`string`

###### object?

`"isTime"` \| `"isDistillation"`

###### value

`number`

##### Returns

`void`

#### mutations.changeNumberFormat()

> **changeNumberFormat**(`state`, `payload`): `void`

Mutation to change the format of a number value in the results form.

##### Parameters

###### state

`State`

The current state object.

###### payload

Payload containing the input field name, its new number value, and optional decimals.

###### decimals?

`number`

###### input

`string`

###### value

`number`

##### Returns

`void`

#### mutations.changePlantDataValue()

> **changePlantDataValue**\<`K`\>(`state`, `payload`): `void`

Mutation to change the value of a field inside distilledPlant in the results form.

##### Type Parameters

###### K

`K` *extends* keyof [`ResultsPlant`](../../../types/forms/resultsForm/interfaces/ResultsPlant.md)

##### Parameters

###### state

`State`

The current state object.

###### payload

`ChangePlantDataPayload`\<`K`\>

Payload containing the input field name and its new value for distilledPlant.

##### Returns

`void`

#### mutations.changeValue()

> **changeValue**\<`K`\>(`state`, `payload`): `void`

Mutation to change the value of a field in the results form.

##### Type Parameters

###### K

`K` *extends* keyof [`ResultsForm`](../../../types/forms/resultsForm/interfaces/ResultsForm.md)

##### Parameters

###### state

`State`

The current state object.

###### payload

`ChangeValuePayload`\<`K`\>

Payload containing the input field name and its new value.

##### Returns

`void`

#### mutations.resetResultsForm()

> **resetResultsForm**(`state`): `void`

Mutation to reset the resultsForm and remove resultsForm from localStorage.

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

State object representing the results form data.
 state

#### Returns

`object`

The initial state object.

##### resultsForm

> **resultsForm**: [`ResultsForm`](../../../types/forms/resultsForm/interfaces/ResultsForm.md)
