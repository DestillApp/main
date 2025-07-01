[**destillationapp-frontend v0.1.0**](../../../README.md)

***

[destillationapp-frontend](../../../modules.md) / [helpers/settingsFunctions](../README.md) / updateListSorting

# Function: updateListSorting()

> **updateListSorting**(`apolloClient`, `key`, `value`): `Promise`\<`string` \| `boolean`\>

Defined in: [helpers/settingsFunctions.ts:14](https://github.com/DestillApp/main/blob/ec2df52a50a22efb35f12a0243274f6d03fbca52/frontend/src/helpers/settingsFunctions.ts#L14)

Updates the list sorting setting for the user.

## Parameters

### apolloClient

`ApolloClient`\<`NormalizedCacheObject`\>

The Apollo Client instance.

### key

`string`

The sorting setting key to update.

### value

`string`

The new sorting value.

## Returns

`Promise`\<`string` \| `boolean`\>

Returns true if successful, "Unauthorized" if unauthorized, or false on error.
