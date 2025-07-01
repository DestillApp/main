[**destillationapp-frontend v0.1.0**](../../../README.md)

***

[destillationapp-frontend](../../../modules.md) / [helpers/formsValidation](../README.md) / registrationFormValidation

# Function: registrationFormValidation()

> **registrationFormValidation**(`form`, `username`): `object`

Defined in: [helpers/formsValidation.ts:178](https://github.com/DestillApp/main/blob/ec2df52a50a22efb35f12a0243274f6d03fbca52/frontend/src/helpers/formsValidation.ts#L178)

Validates the registration form data.

## Parameters

### form

The registration form data object.

#### confirmPassword

`string`

#### email

`string`

#### password

`string`

#### username

`string`

### username

`boolean`

Indicates if the username is already taken.

## Returns

`object`

Returns an object with isFormValid and isPasswordCorrect properties.

### isFormValid

> **isFormValid**: `boolean`

### isPasswordCorrect

> **isPasswordCorrect**: `boolean`
