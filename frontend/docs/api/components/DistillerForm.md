# DistillerForm

Modal form for adding a new distiller, including material, capacity, and heating type. Handles validation and submission.
 *

## Exposed Methods

### `setInteger()`
Sets the integer value for the capacity input.

**Parameters:**
- `value` (`string`): The value to convert to integer.

### `addDistiller()`
Handles form submission, validates input, and dispatches actions to add a distiller.

### `closeModal()`
Emits the close-modal event to close the modal.
