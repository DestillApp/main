[**destillationapp-frontend v0.1.0**](../../../../README.md)

***

[destillationapp-frontend](../../../../modules.md) / [store/results/mutations](../README.md) / default

# Variable: default

> **default**: `object`

Defined in: [store/results/mutations.ts:70](https://github.com/DestillApp/main/blob/ec2df52a50a22efb35f12a0243274f6d03fbca52/frontend/src/store/results/mutations.ts#L70)

## Type declaration

### changeDistillationDataValue()

> **changeDistillationDataValue**\<`K`\>(`state`, `payload`): `void`

Mutation to change the value of a field inside distillationData in the results form.

#### Type Parameters

##### K

`K` *extends* keyof [`ResultsDistillation`](../../../../types/forms/resultsForm/interfaces/ResultsDistillation.md)

#### Parameters

##### state

`State`

The current state object.

##### payload

`ChangeDistillationDataPayload`\<`K`\>

Payload containing the input field name and its new value for distillationData.

#### Returns

`void`

### changeDistillationTimeValue()

> **changeDistillationTimeValue**(`state`, `payload`): `void`

Mutation to change the value of distillationHours and distillationMinutes inside distillationTime in the results form.

#### Parameters

##### state

`State`

The current state object.

##### payload

`ChangeDistillationTimePayload`

Payload containing the input field name and its new value for distillationTime.

#### Returns

`void`

### changeIntegerNumber()

> **changeIntegerNumber**(`state`, `payload`): `void`

Mutation to change a value to an integer value in the results form.

#### Parameters

##### state

`State`

The current state object.

##### payload

Payload containing the input field name, its new integer value, and the object type.

###### input

`string`

###### object?

`"isTime"` \| `"isDistillation"`

###### value

`number`

#### Returns

`void`

### changeNumberFormat()

> **changeNumberFormat**(`state`, `payload`): `void`

Mutation to change the format of a number value in the results form.

#### Parameters

##### state

`State`

The current state object.

##### payload

Payload containing the input field name, its new number value, and optional decimals.

###### decimals?

`number`

###### input

`string`

###### value

`number`

#### Returns

`void`

### changePlantDataValue()

> **changePlantDataValue**\<`K`\>(`state`, `payload`): `void`

Mutation to change the value of a field inside distilledPlant in the results form.

#### Type Parameters

##### K

`K` *extends* keyof [`ResultsPlant`](../../../../types/forms/resultsForm/interfaces/ResultsPlant.md)

#### Parameters

##### state

`State`

The current state object.

##### payload

`ChangePlantDataPayload`\<`K`\>

Payload containing the input field name and its new value for distilledPlant.

#### Returns

`void`

### changeValue()

> **changeValue**\<`K`\>(`state`, `payload`): `void`

Mutation to change the value of a field in the results form.

#### Type Parameters

##### K

`K` *extends* keyof [`ResultsForm`](../../../../types/forms/resultsForm/interfaces/ResultsForm.md)

#### Parameters

##### state

`State`

The current state object.

##### payload

`ChangeValuePayload`\<`K`\>

Payload containing the input field name and its new value.

#### Returns

`void`

### resetResultsForm()

> **resetResultsForm**(`state`): `void`

Mutation to reset the resultsForm and remove resultsForm from localStorage.

#### Parameters

##### state

`State`

The current state object.

#### Returns

`void`
