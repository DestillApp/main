[**destillationapp-frontend v0.1.0**](../../../../README.md)

***

[destillationapp-frontend](../../../../modules.md) / [store/results/getters](../README.md) / default

# Variable: default

> **default**: `object`

Defined in: [store/results/getters.ts:21](https://github.com/DestillApp/main/blob/76aba95a5d8c1d9174ebde73d7b50f0ea64b491a/frontend/src/store/results/getters.ts#L21)

## Type declaration

### distillationData()

> **distillationData**(`state`): [`ResultsDistillation`](../../../../types/forms/resultsForm/interfaces/ResultsDistillation.md)

Gets the distillation data from the results form data.

#### Parameters

##### state

`State`

The Vuex state.

#### Returns

[`ResultsDistillation`](../../../../types/forms/resultsForm/interfaces/ResultsDistillation.md)

The distillation data.

### distillationDate()

> **distillationDate**(`state`): `string`

Gets the distillation date from the distillation data.

#### Parameters

##### state

`State`

The Vuex state.

#### Returns

`string`

The distillation date.

### distilledPlant()

> **distilledPlant**(`state`): [`ResultsPlant`](../../../../types/forms/resultsForm/interfaces/ResultsPlant.md)

Gets the distilled plant from the results form data.

#### Parameters

##### state

`State`

The Vuex state.

#### Returns

[`ResultsPlant`](../../../../types/forms/resultsForm/interfaces/ResultsPlant.md)

The distilled plant data.

### resultsForm()

> **resultsForm**(`state`): [`ResultsForm`](../../../../types/forms/resultsForm/interfaces/ResultsForm.md)

Gets the results form data from the state.

#### Parameters

##### state

`State`

The Vuex state.

#### Returns

[`ResultsForm`](../../../../types/forms/resultsForm/interfaces/ResultsForm.md)

The results form data.
