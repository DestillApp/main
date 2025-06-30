[**destillationapp-frontend v0.1.0**](../../../../README.md)

***

[destillationapp-frontend](../../../../modules.md) / [store/settings/actions](../README.md) / default

# Variable: default

> **default**: `object`

Defined in: [store/settings/actions.ts:38](https://github.com/DestillApp/main/blob/be94b1d93681946bd573e84cd8381ba32cee62b9/frontend/src/store/settings/actions.ts#L38)

## Type declaration

### addDistiller()

> **addDistiller**(`context`, `distiller`): `Promise`\<`string` \| `void`\>

Adds a distiller to the distillerList.

#### Parameters

##### context

`Context`

The Vuex context.

##### distiller

[`Distiller`](../../interfaces/Distiller.md)

The distiller object to add.

#### Returns

`Promise`\<`string` \| `void`\>

### deleteDistillerById()

> **deleteDistillerById**(`context`, `id`): `Promise`\<`string` \| `void`\>

Deletes a distiller from the distillerList by its ID.

#### Parameters

##### context

`Context`

The Vuex context.

##### id

`string`

The ID of the distiller to delete.

#### Returns

`Promise`\<`string` \| `void`\>

### fetchLocalStorageData()

> **fetchLocalStorageData**(`context`, `payload`): `void`

Fetches data from local storage and commits it to the state.

#### Parameters

##### context

`Context`

The Vuex context.

##### payload

The payload containing the key.

###### key

keyof [`SettingsForm`](../../interfaces/SettingsForm.md)

#### Returns

`void`

### fetchSettings()

> **fetchSettings**(`context`): `Promise`\<`string` \| `void`\>

Fetches user settings from the database.

#### Parameters

##### context

`Context`

The Vuex context.

#### Returns

`Promise`\<`string` \| `void`\>

### setInitialSettings()

> **setInitialSettings**(`context`, `userId`): `Promise`\<`void`\>

Creates initial settings in the database.

#### Parameters

##### context

`Context`

The Vuex context.

##### userId

`string`

The user ID for which to create settings.

#### Returns

`Promise`\<`void`\>

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

`string` \| `number` \| `boolean` \| `any`[]

#### Returns

`void`
