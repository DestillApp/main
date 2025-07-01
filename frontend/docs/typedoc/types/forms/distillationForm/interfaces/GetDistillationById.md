[**destillationapp-frontend v0.1.0**](../../../../README.md)

***

[destillationapp-frontend](../../../../modules.md) / [types/forms/distillationForm](../README.md) / GetDistillationById

# Interface: GetDistillationById

Defined in: [types/forms/distillationForm.ts:108](https://github.com/DestillApp/main/blob/ec2df52a50a22efb35f12a0243274f6d03fbca52/frontend/src/types/forms/distillationForm.ts#L108)

Interface representing the structure of a distillation fetched by ID.

## Properties

### \_id

> **\_id**: `string`

Defined in: [types/forms/distillationForm.ts:109](https://github.com/DestillApp/main/blob/ec2df52a50a22efb35f12a0243274f6d03fbca52/frontend/src/types/forms/distillationForm.ts#L109)

The unique identifier of the distillation.

***

### choosedPlant

> **choosedPlant**: [`ShortPlant`](ShortPlant.md)

Defined in: [types/forms/distillationForm.ts:110](https://github.com/DestillApp/main/blob/ec2df52a50a22efb35f12a0243274f6d03fbca52/frontend/src/types/forms/distillationForm.ts#L110)

The selected plant.

***

### distillationApparatus

> **distillationApparatus**: `string`

Defined in: [types/forms/distillationForm.ts:118](https://github.com/DestillApp/main/blob/ec2df52a50a22efb35f12a0243274f6d03fbca52/frontend/src/types/forms/distillationForm.ts#L118)

The apparatus used for distillation.

***

### distillationDate

> **distillationDate**: `string`

Defined in: [types/forms/distillationForm.ts:117](https://github.com/DestillApp/main/blob/ec2df52a50a22efb35f12a0243274f6d03fbca52/frontend/src/types/forms/distillationForm.ts#L117)

The date of distillation.

***

### distillationTime

> **distillationTime**: [`DistillationTime`](DistillationTime.md)

Defined in: [types/forms/distillationForm.ts:120](https://github.com/DestillApp/main/blob/ec2df52a50a22efb35f12a0243274f6d03fbca52/frontend/src/types/forms/distillationForm.ts#L120)

The distillation time.

***

### distillationType

> **distillationType**: `string`

Defined in: [types/forms/distillationForm.ts:116](https://github.com/DestillApp/main/blob/ec2df52a50a22efb35f12a0243274f6d03fbca52/frontend/src/types/forms/distillationForm.ts#L116)

The type of distillation.

***

### isPlantShredded

> **isPlantShredded**: `boolean`

Defined in: [types/forms/distillationForm.ts:115](https://github.com/DestillApp/main/blob/ec2df52a50a22efb35f12a0243274f6d03fbca52/frontend/src/types/forms/distillationForm.ts#L115)

Whether the plant is shredded.

***

### isPlantSoaked

> **isPlantSoaked**: `boolean`

Defined in: [types/forms/distillationForm.ts:112](https://github.com/DestillApp/main/blob/ec2df52a50a22efb35f12a0243274f6d03fbca52/frontend/src/types/forms/distillationForm.ts#L112)

Whether the plant is soaked.

***

### soakingTime

> **soakingTime**: `null` \| `number`

Defined in: [types/forms/distillationForm.ts:113](https://github.com/DestillApp/main/blob/ec2df52a50a22efb35f12a0243274f6d03fbca52/frontend/src/types/forms/distillationForm.ts#L113)

The soaking time in minutes.

***

### waterForDistillation

> **waterForDistillation**: `number`

Defined in: [types/forms/distillationForm.ts:119](https://github.com/DestillApp/main/blob/ec2df52a50a22efb35f12a0243274f6d03fbca52/frontend/src/types/forms/distillationForm.ts#L119)

The amount of water used for distillation.

***

### weightAfterSoaking

> **weightAfterSoaking**: `null` \| `number`

Defined in: [types/forms/distillationForm.ts:114](https://github.com/DestillApp/main/blob/ec2df52a50a22efb35f12a0243274f6d03fbca52/frontend/src/types/forms/distillationForm.ts#L114)

The weight after soaking.

***

### weightForDistillation

> **weightForDistillation**: `number`

Defined in: [types/forms/distillationForm.ts:111](https://github.com/DestillApp/main/blob/ec2df52a50a22efb35f12a0243274f6d03fbca52/frontend/src/types/forms/distillationForm.ts#L111)

The weight used for distillation.
