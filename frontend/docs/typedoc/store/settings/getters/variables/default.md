[**destillationapp-frontend v0.1.0**](../../../../README.md)

***

[destillationapp-frontend](../../../../modules.md) / [store/settings/getters](../README.md) / default

# Variable: default

> **default**: `object`

Defined in: [store/settings/getters.ts:17](https://github.com/DestillApp/main/blob/76aba95a5d8c1d9174ebde73d7b50f0ea64b491a/frontend/src/store/settings/getters.ts#L17)

## Type declaration

### distillerList()

> **distillerList**(`state`): [`Distiller`](../../interfaces/Distiller.md)[]

Gets the distiller list from the settings form data.

#### Parameters

##### state

`State`

The Vuex state.

#### Returns

[`Distiller`](../../interfaces/Distiller.md)[]

The distiller list.

### isDarkTheme()

> **isDarkTheme**(`state`): `boolean`

Gets the dark theme status from the settings form data.

#### Parameters

##### state

`State`

The Vuex state.

#### Returns

`boolean`

Whether dark theme is enabled.

### settingsForm()

> **settingsForm**(`state`): [`SettingsForm`](../../interfaces/SettingsForm.md)

Gets the settings form data from the state.

#### Parameters

##### state

`State`

The Vuex state.

#### Returns

[`SettingsForm`](../../interfaces/SettingsForm.md)

The settings form data.
