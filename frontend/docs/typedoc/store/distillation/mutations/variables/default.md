[**destillationapp-frontend v0.1.0**](../../../../README.md)

***

[destillationapp-frontend](../../../../modules.md) / [store/distillation/mutations](../README.md) / default

# Variable: default

> **default**: `object`

Defined in: [store/distillation/mutations.ts:68](https://github.com/DestillApp/main/blob/be94b1d93681946bd573e84cd8381ba32cee62b9/frontend/src/store/distillation/mutations.ts#L68)

## Type declaration

### changeChoosedPlant()

> **changeChoosedPlant**\<`K`\>(`state`, `payload`): `void`

Mutation to change the value of a field in the distillation form choosedPlant.

#### Type Parameters

##### K

`K` *extends* keyof [`FormChoosedPlant`](../../../../types/forms/distillationForm/interfaces/FormChoosedPlant.md)

#### Parameters

##### state

`State`

The current state object.

##### payload

`ChangeChoosedPlant`\<`K`\>

Payload containing the key in the choosedPlant object and its new value.

#### Returns

`void`

### changeDistillationTime()

> **changeDistillationTime**\<`K`\>(`state`, `payload`): `void`

Mutation to change the value of a field in the distillation time object.

#### Type Parameters

##### K

`K` *extends* keyof [`DistillationTime`](../../../../types/forms/distillationForm/interfaces/DistillationTime.md)

#### Parameters

##### state

`State`

The current state object.

##### payload

`ChangeDistillationTime`\<`K`\>

Payload containing the key in the distillationTime object and its new value.

#### Returns

`void`

### changeIntegerNumber()

> **changeIntegerNumber**(`state`, `payload`): `void`

Mutation to change a value to an integer value in the distillation form.

#### Parameters

##### state

`State`

The current state object.

##### payload

Payload containing the input field name and its new integer value.

###### input

`"soakingTime"`

###### value

`number`

#### Returns

`void`

### changeNumberFormat()

> **changeNumberFormat**(`state`, `payload`): `void`

Mutation to change the format of a number value in the distillation form.

#### Parameters

##### state

`State`

The current state object.

##### payload

Payload containing the input field name and its new formatted number value.

###### input

`"weightForDistillation"` \| `"weightAfterSoaking"`

###### value

`number`

#### Returns

`void`

### changeValue()

> **changeValue**\<`K`\>(`state`, `payload`): `void`

Mutation to change the value of a field in the distillation form.

#### Type Parameters

##### K

`K` *extends* keyof [`DistillationForm`](../../../../types/forms/distillationForm/interfaces/DistillationForm.md)

#### Parameters

##### state

`State`

The current state object.

##### payload

`ChangeValuePayload`\<`K`\>

Payload containing the input field name and its new value.

#### Returns

`void`

### resetDistillationForm()

> **resetDistillationForm**(`state`): `void`

Mutation to reset the distillationForm and remove distillationForm from localStorage.

#### Parameters

##### state

`State`

The current state object.

#### Returns

`void`
