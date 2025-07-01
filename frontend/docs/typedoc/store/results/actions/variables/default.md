[**destillationapp-frontend v0.1.0**](../../../../README.md)

***

[destillationapp-frontend](../../../../modules.md) / [store/results/actions](../README.md) / default

# Variable: default

> **default**: `object`

Defined in: [store/results/actions.ts:35](https://github.com/DestillApp/main/blob/ec2df52a50a22efb35f12a0243274f6d03fbca52/frontend/src/store/results/actions.ts#L35)

## Type declaration

### fetchDistillationDataFromLocalStorage()

> **fetchDistillationDataFromLocalStorage**(`context`, `key`): `void`

Fetches distillationData from local storage and commits it to the state.

#### Parameters

##### context

`Context`

The Vuex context.

##### key

`string`

The key to fetch from local storage.

#### Returns

`void`

### fetchDistillationTimeFromLocalStorage()

> **fetchDistillationTimeFromLocalStorage**(`context`, `key`): `void`

Fetches distillation time data from local storage and commits it to the state.

#### Parameters

##### context

`Context`

The Vuex context.

##### key

`string`

The key to fetch from local storage.

#### Returns

`void`

### fetchDistilledPlantFromLocalStorage()

> **fetchDistilledPlantFromLocalStorage**(`context`, `key`): `void`

Fetches distilledPlant data from local storage and commits it to the state.

#### Parameters

##### context

`Context`

The Vuex context.

##### key

`string`

The key to fetch from local storage.

#### Returns

`void`

### fetchLocalStorageData()

> **fetchLocalStorageData**(`context`, `key`): `void`

Fetches data from local storage and commits it to the state.

#### Parameters

##### context

`Context`

The Vuex context.

##### key

`string`

The key to fetch from local storage.

#### Returns

`void`

### setDistillationDataValue()

> **setDistillationDataValue**(`context`, `payload`): `void`

Sets a value inside distillationData in the state.

#### Parameters

##### context

`Context`

The Vuex context.

##### payload

The payload containing the input and value.

###### input

`string`

###### value

`any`

#### Returns

`void`

### setDistillationTime()

> **setDistillationTime**(`context`, `payload`): `void`

Sets a value inside distillationTime in the state.

#### Parameters

##### context

`Context`

The Vuex context.

##### payload

The payload containing the input and value.

###### input

`string`

###### value

`any`

#### Returns

`void`

### setIntegerValue()

> **setIntegerValue**(`context`, `payload`): `void`

Sets an integer value in the state.

#### Parameters

##### context

`Context`

The Vuex context.

##### payload

The payload containing the input and value.

###### input

`string`

###### object?

`string`

###### value

`number`

#### Returns

`void`

### setNumberFormat()

> **setNumberFormat**(`context`, `payload`): `void`

Sets the number format in the state.

#### Parameters

##### context

`Context`

The Vuex context.

##### payload

The payload containing the input and value.

###### decimals?

`number`

###### input

`string`

###### value

`number`

#### Returns

`void`

### setPlantDataValue()

> **setPlantDataValue**(`context`, `payload`): `void`

Sets a value inside plantData in the state.

#### Parameters

##### context

`Context`

The Vuex context.

##### payload

The payload containing the input and value.

###### input

`string`

###### value

`any`

#### Returns

`void`

### setResultsForm()

> **setResultsForm**(`context`): `void`

Sets the resultsForm in the state and localStorage.

#### Parameters

##### context

`Context`

The Vuex context.

#### Returns

`void`

### setValue()

> **setValue**(`context`, `payload`): `void`

Sets a value in the state.

#### Parameters

##### context

`Context`

The Vuex context.

##### payload

The payload containing the input and value.

###### input

`string`

###### value

`any`

#### Returns

`void`
