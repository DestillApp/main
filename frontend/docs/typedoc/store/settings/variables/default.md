[**destillationapp-frontend v0.1.0**](../../../README.md)

***

[destillationapp-frontend](../../../modules.md) / [store/settings](../README.md) / default

# Variable: default

> **default**: `object`

Defined in: [store/settings/index.ts:48](https://github.com/DestillApp/main/blob/be94b1d93681946bd573e84cd8381ba32cee62b9/frontend/src/store/settings/index.ts#L48)

## Type declaration

### actions

> **actions**: `object` = `settingsActions`

Actions for performing asynchronous tasks in the settings module.

#### actions.addDistiller()

> **addDistiller**(`context`, `distiller`): `Promise`\<`string` \| `void`\>

Adds a distiller to the distillerList.

##### Parameters

###### context

`Context`

The Vuex context.

###### distiller

[`Distiller`](../interfaces/Distiller.md)

The distiller object to add.

##### Returns

`Promise`\<`string` \| `void`\>

#### actions.deleteDistillerById()

> **deleteDistillerById**(`context`, `id`): `Promise`\<`string` \| `void`\>

Deletes a distiller from the distillerList by its ID.

##### Parameters

###### context

`Context`

The Vuex context.

###### id

`string`

The ID of the distiller to delete.

##### Returns

`Promise`\<`string` \| `void`\>

#### actions.fetchLocalStorageData()

> **fetchLocalStorageData**(`context`, `payload`): `void`

Fetches data from local storage and commits it to the state.

##### Parameters

###### context

`Context`

The Vuex context.

###### payload

The payload containing the key.

###### key

keyof [`SettingsForm`](../interfaces/SettingsForm.md)

##### Returns

`void`

#### actions.fetchSettings()

> **fetchSettings**(`context`): `Promise`\<`string` \| `void`\>

Fetches user settings from the database.

##### Parameters

###### context

`Context`

The Vuex context.

##### Returns

`Promise`\<`string` \| `void`\>

#### actions.setInitialSettings()

> **setInitialSettings**(`context`, `userId`): `Promise`\<`void`\>

Creates initial settings in the database.

##### Parameters

###### context

`Context`

The Vuex context.

###### userId

`string`

The user ID for which to create settings.

##### Returns

`Promise`\<`void`\>

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

`string` \| `number` \| `boolean` \| `any`[]

##### Returns

`void`

### getters

> **getters**: `object` = `settingsGetters`

Getters for accessing settings state data.

#### getters.distillerList()

> **distillerList**(`state`): [`Distiller`](../interfaces/Distiller.md)[]

Gets the distiller list from the settings form data.

##### Parameters

###### state

`State`

The Vuex state.

##### Returns

[`Distiller`](../interfaces/Distiller.md)[]

The distiller list.

#### getters.isDarkTheme()

> **isDarkTheme**(`state`): `boolean`

Gets the dark theme status from the settings form data.

##### Parameters

###### state

`State`

The Vuex state.

##### Returns

`boolean`

Whether dark theme is enabled.

#### getters.settingsForm()

> **settingsForm**(`state`): [`SettingsForm`](../interfaces/SettingsForm.md)

Gets the settings form data from the state.

##### Parameters

###### state

`State`

The Vuex state.

##### Returns

[`SettingsForm`](../interfaces/SettingsForm.md)

The settings form data.

### mutations

> **mutations**: `object` = `settingsMutations`

Mutations for updating the settings state.

#### mutations.changeValue()

> **changeValue**\<`K`\>(`state`, `payload`): `void`

Mutation to change the value of a field in the settings form.

##### Type Parameters

###### K

`K` *extends* keyof [`SettingsForm`](../interfaces/SettingsForm.md)

##### Parameters

###### state

`State`

The current state object.

###### payload

Payload containing the input field name and its new value.

###### input

`K`

###### value

[`SettingsForm`](../interfaces/SettingsForm.md)\[`K`\]

##### Returns

`void`

#### mutations.removeDistillerById()

> **removeDistillerById**(`state`, `id`): `void`

Mutation to remove a distiller from the distillerList by its ID.

##### Parameters

###### state

`State`

The current state object.

###### id

`string`

The ID of the distiller to remove.

##### Returns

`void`

### namespaced

> **namespaced**: `boolean` = `true`

### state()

> **state**(): `object`

**`Function`**

State object representing the settings form data.
 state

#### Returns

`object`

The initial state object.

##### settingsForm

> **settingsForm**: [`SettingsForm`](../interfaces/SettingsForm.md)
