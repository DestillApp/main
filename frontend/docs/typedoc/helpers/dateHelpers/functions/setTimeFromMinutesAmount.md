[**destillationapp-frontend v0.1.0**](../../../README.md)

***

[destillationapp-frontend](../../../modules.md) / [helpers/dateHelpers](../README.md) / setTimeFromMinutesAmount

# Function: setTimeFromMinutesAmount()

> **setTimeFromMinutesAmount**(`minutesAmount`): `string`

Defined in: [helpers/dateHelpers.ts:8](https://github.com/DestillApp/main/blob/ec2df52a50a22efb35f12a0243274f6d03fbca52/frontend/src/helpers/dateHelpers.ts#L8)

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
