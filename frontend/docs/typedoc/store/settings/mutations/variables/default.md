[**destillationapp-frontend v0.1.0**](../../../../README.md)

***

[destillationapp-frontend](../../../../modules.md) / [store/settings/mutations](../README.md) / default

# Variable: default

> **default**: `object`

Defined in: [store/settings/mutations.ts:16](https://github.com/DestillApp/main/blob/ec2df52a50a22efb35f12a0243274f6d03fbca52/frontend/src/store/settings/mutations.ts#L16)

## Type declaration

### changeValue()

> **changeValue**\<`K`\>(`state`, `payload`): `void`

Mutation to change the value of a field in the settings form.

#### Type Parameters

##### K

`K` *extends* keyof [`SettingsForm`](../../interfaces/SettingsForm.md)

#### Parameters

##### state

`State`

The current state object.

##### payload

Payload containing the input field name and its new value.

###### input

`K`

###### value

[`SettingsForm`](../../interfaces/SettingsForm.md)\[`K`\]

#### Returns

`void`

### removeDistillerById()

> **removeDistillerById**(`state`, `id`): `void`

Mutation to remove a distiller from the distillerList by its ID.

#### Parameters

##### state

`State`

The current state object.

##### id

`string`

The ID of the distiller to remove.

#### Returns

`void`
