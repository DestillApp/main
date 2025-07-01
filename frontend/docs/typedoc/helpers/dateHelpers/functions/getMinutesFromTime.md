[**destillationapp-frontend v0.1.0**](../../../README.md)

***

[destillationapp-frontend](../../../modules.md) / [helpers/dateHelpers](../README.md) / getMinutesFromTime

# Function: getMinutesFromTime()

> **getMinutesFromTime**(`timeString`): `number`

Defined in: [helpers/dateHelpers.ts:24](https://github.com/DestillApp/main/blob/ec2df52a50a22efb35f12a0243274f6d03fbca52/frontend/src/helpers/dateHelpers.ts#L24)

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
