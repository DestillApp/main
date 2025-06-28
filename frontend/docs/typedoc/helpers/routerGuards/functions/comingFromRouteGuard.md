[**destillationapp-frontend v0.1.0**](../../../README.md)

***

[destillationapp-frontend](../../../modules.md) / [helpers/routerGuards](../README.md) / comingFromRouteGuard

# Function: comingFromRouteGuard()

> **comingFromRouteGuard**(`to`, `from`, `next`): `void`

Defined in: [helpers/routerGuards.ts:11](https://github.com/DestillApp/main/blob/76aba95a5d8c1d9174ebde73d7b50f0ea64b491a/frontend/src/helpers/routerGuards.ts#L11)

Navigation guard that sets a flag in the store indicating whether the user is coming from another route.

## Parameters

### to

`RouteLocationNormalizedGeneric`

The target Route object being navigated to.

### from

`RouteLocationNormalizedGeneric`

The current Route object being navigated away from.

### next

`NavigationGuardNext`

The function to resolve the navigation.

## Returns

`void`
