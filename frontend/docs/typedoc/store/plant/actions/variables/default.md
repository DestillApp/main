[**destillationapp-frontend v0.1.0**](../../../../README.md)

***

[destillationapp-frontend](../../../../modules.md) / [store/plant/actions](../README.md) / default

# Variable: default

> **default**: `object`

Defined in: [store/plant/actions.ts:31](https://github.com/DestillApp/main/blob/76aba95a5d8c1d9174ebde73d7b50f0ea64b491a/frontend/src/store/plant/actions.ts#L31)

## Type declaration

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

### setEndTime()

> **setEndTime**(`context`): `void`

Commits the end time format change.

#### Parameters

##### context

`Context`

The Vuex context.

#### Returns

`void`

### setHarvestRange()

> **setHarvestRange**(`context`): `void`

Commits the harvest range change.

#### Parameters

##### context

`Context`

The Vuex context.

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

###### input

`string`

###### value

`number`

#### Returns

`void`

### setPlantForm()

> **setPlantForm**(`context`): `void`

Sets the plantForm in the state and localStorage.

#### Parameters

##### context

`Context`

The Vuex context.

#### Returns

`void`

### setStartTime()

> **setStartTime**(`context`): `void`

Commits the start time format change.

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
