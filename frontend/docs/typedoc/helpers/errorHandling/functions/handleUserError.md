[**destillationapp-frontend v0.1.0**](../../../README.md)

***

[destillationapp-frontend](../../../modules.md) / [helpers/errorHandling](../README.md) / handleUserError

# Function: handleUserError()

> **handleUserError**(`error`): `Promise`\<`void`\>

Defined in: [helpers/errorHandling.ts:11](https://github.com/DestillApp/main/blob/ec2df52a50a22efb35f12a0243274f6d03fbca52/frontend/src/helpers/errorHandling.ts#L11)

Handles user errors by reporting them to Sentry, logging out the user if unauthorized,
redirecting to the login page, or logging the error to the console.

## Parameters

### error

`any`

The error object to handle.

## Returns

`Promise`\<`void`\>

A promise that resolves when the error has been handled.
