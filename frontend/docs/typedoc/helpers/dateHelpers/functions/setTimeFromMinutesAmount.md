[**destillationapp-frontend v0.1.0**](../../../README.md)

***

[destillationapp-frontend](../../../modules.md) / [helpers/dateHelpers](../README.md) / setTimeFromMinutesAmount

# Function: setTimeFromMinutesAmount()

> **setTimeFromMinutesAmount**(`minutesAmount`): `string`

Defined in: [helpers/dateHelpers.ts:8](https://github.com/DestillApp/main/blob/76aba95a5d8c1d9174ebde73d7b50f0ea64b491a/frontend/src/helpers/dateHelpers.ts#L8)

Converts a number of minutes to a formatted time string (HH:MM).

## Parameters

### minutesAmount

`number`

The amount of minutes to convert.

## Returns

`string`

The formatted time string in "HH:MM" format.

## Example

```ts
setTimeFromMinutesAmount(75); // "01:15"
```
