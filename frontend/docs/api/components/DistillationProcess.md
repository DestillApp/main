# DistillationProcess

Handles the distillation process inputs, such as selecting the distillation type, apparatus, and setting the date.
 * Integrates with Vuex to store form data and manage state updates.
 *

## Props

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `isFormValid` | `boolean` | yes | Indicates if the form is valid. |
| `wasSubmitted` | `boolean` | yes | Indicates if the form was submitted. |
| `isEditing` | `boolean` | no | Indicates if the form is in editing mode. |

## Exposed Methods

### `fetchData()`
Fetches initial data from local storage via the Vuex store for a specified key.

**Parameters:**
- `key` (`string`): The key for the specific data to fetch.
- `value` (`boolean`): Indicates if the fetched data is related to plant information.

### `fetchArchiveData()`
Fetches archive data from local storage via the Vuex store for a specified key.

**Parameters:**
- `key` (`string`): The key for the specific data to fetch.

### `setValue()`
Updates the value of a specified input field in the Vuex store.

**Parameters:**
- `value` (`string`): The value to set for the input.
- `input` (`string`): The key for the specific input field.

### `setDistillationType()`
Handles setting the selected distillation type and updating the store.

**Parameters:**
- `value` (`string`): The selected distillation type.
- `input` (`string`): The input field triggering the event.

### `setDistillationApparatus()`
Sets the selected distillation apparatus and updates the store.

**Parameters:**
- `value` (`string`): The selected distillation apparatus.
- `input` (`string`): The input field triggering the event.
