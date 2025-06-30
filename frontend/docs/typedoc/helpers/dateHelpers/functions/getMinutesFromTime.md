[**destillationapp-frontend v0.1.0**](../../../README.md)

***

[destillationapp-frontend](../../../modules.md) / [helpers/dateHelpers](../README.md) / getMinutesFromTime

# Function: getMinutesFromTime()

> **getMinutesFromTime**(`timeString`): `number`

Defined in: [helpers/dateHelpers.ts:24](https://github.com/DestillApp/main/blob/be94b1d93681946bd573e84cd8381ba32cee62b9/frontend/src/helpers/dateHelpers.ts#L24)

Converts a formatted time string (HH:MM) to the total number of minutes.

## Parameters

### timeString

`string`

The time string in "HH:MM" format.

## Returns

`number`

The total number of minutes.

## Example

```ts
getMinutesFromTime("01:15"); // 75
```
