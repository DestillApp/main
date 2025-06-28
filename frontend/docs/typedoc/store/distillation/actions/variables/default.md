[**destillationapp-frontend v0.1.0**](../../../../README.md)

***

[destillationapp-frontend](../../../../modules.md) / [store/distillation/actions](../README.md) / default

# Variable: default

> **default**: `object`

Defined in: [store/distillation/actions.ts:31](https://github.com/DestillApp/main/blob/76aba95a5d8c1d9174ebde73d7b50f0ea64b491a/frontend/src/store/distillation/actions.ts#L31)

## Type declaration

### fetchLocalStorageData()

> **fetchLocalStorageData**(`context`, `param1`): `void`

Fetches data from local storage and commits it to the state.

#### Parameters

##### context

`Context`

The Vuex context.

##### param1

The payload with key and isPlant.

###### isPlant

`boolean`

###### key

`string`

#### Returns

`void`

### fetchTimeFromLocalStorageData()

> **fetchTimeFromLocalStorageData**(`context`, `key`): `void`

Fetches time data from local storage and commits it to the state.

#### Parameters

##### context

`Context`

The Vuex context.

##### key

`string`

The key to fetch from local storage.

#### Returns

`void`

### setChoosedPlant()

> **setChoosedPlant**(`context`, `param1`): `void`

Sets a value in the choosed plant state.

#### Parameters

##### context

`Context`

The Vuex context.

##### param1

The payload containing the key and value.

###### key

`string`

###### value

`any`

#### Returns

`void`

### setDistillationForm()

> **setDistillationForm**(`context`): `void`

Sets the distillationForm in the state and localStorage.

#### Parameters

##### context

`Context`

The Vuex context.

#### Returns

`void`

### setDistillationTime()

> **setDistillationTime**(`context`, `param1`): `void`

Sets a value in the distillation time state.

#### Parameters

##### context

`Context`

The Vuex context.

##### param1

The payload containing the key and value.

###### key

`string`

###### value

`null` \| `number`

#### Returns

`void`

### setIntegerValue()

> **setIntegerValue**(`context`, `param1`): `void`

Sets an integer value in the state.

#### Parameters

##### context

`Context`

The Vuex context.

##### param1

The payload containing the input and value.

###### input

`string`

###### value

`number`

#### Returns

`void`

### setNumberFormat()

> **setNumberFormat**(`context`, `param1`): `void`

Sets the number format in the state.

#### Parameters

##### context

`Context`

The Vuex context.

##### param1

The payload containing the input and value.

###### input

`string`

###### value

`number`

#### Returns

`void`

### setValue()

> **setValue**(`context`, `param1`): `void`

Sets a value in the state.

#### Parameters

##### context

`Context`

The Vuex context.

##### param1

The payload with input and value.

###### input

`string`

###### value

`any`

#### Returns

`void`
