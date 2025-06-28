[**destillationapp-frontend v0.1.0**](../../../README.md)

***

[destillationapp-frontend](../../../modules.md) / [helpers/settingsFunctions](../README.md) / updateListSettings

# Function: updateListSettings()

> **updateListSettings**(`apolloClient`, `key`, `value`): `Promise`\<`string` \| `boolean`\>

Defined in: [helpers/settingsFunctions.ts:46](https://github.com/DestillApp/main/blob/76aba95a5d8c1d9174ebde73d7b50f0ea64b491a/frontend/src/helpers/settingsFunctions.ts#L46)

Updates the list length setting for the user.

## Parameters

### apolloClient

`ApolloClient`\<`NormalizedCacheObject`\>

The Apollo Client instance.

### key

`string`

The list length setting key to update.

### value

`number`

The new list length value.

## Returns

`Promise`\<`string` \| `boolean`\>

Returns true if successful, "Unauthorized" if unauthorized, or false on error.
