[**destillationapp-frontend v0.1.0**](../../../README.md)

***

[destillationapp-frontend](../../../modules.md) / [helpers/dateHelpers](../README.md) / setTimeFromMinutesAmount

# Function: setTimeFromMinutesAmount()

> **setTimeFromMinutesAmount**(`minutesAmount`): `string`

Defined in: [helpers/dateHelpers.ts:8](https://github.com/DestillApp/main/blob/be94b1d93681946bd573e84cd8381ba32cee62b9/frontend/src/helpers/dateHelpers.ts#L8)

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
