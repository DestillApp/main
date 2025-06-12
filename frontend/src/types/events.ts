/**
 * Events emitted by input components.
 * @interface
 * @param {"update:modelValue"} e - Update the model value.
 * @param {string | number} value - The new value.
 * @param {string} [id] - Optional identifier.
 *
 * @param {"choose:item"} e - Choose an item from a list.
 * @param {any} result - The chosen item.
 * @param {string} [id] - Optional identifier.
 *
 * @param {"update:onBlur"} e - Triggered on blur.
 * @param {"open:list"} e - Open the list.
 */
export interface InputEvents {
  (e: "update:modelValue", value: string | number, id?: string): void;
  (e: "choose:item", result: any, id?: string): void;
  (e: "update:onBlur"): void;
  (e: "open:list"): void;
}

/**
 * Events emitted by the delete item modal.
 * @interface
 * @param {"close-delete-modal"} e - Close the delete modal.
 * @param {"delete-item"} e - Delete the item.
 */
export interface DeleteItemModalEvents {
  (e: "close-delete-modal"): void;
  (e: "delete-item"): void;
}

/**
 * Event emitted to close a modal.
 * @interface
 * @param {"close-modal"} e - Close the modal.
 */
export interface CloseModal {
  (e: "close-modal"): void;
}

/**
 * Events emitted by the ask modal.
 * @interface
 * @augments CloseModal
 * @param {"handle-yes"} e - Confirm the action.
 */
export interface AskModalEvents extends CloseModal {
  (e: "handle-yes"): void;
}

/**
 * Event emitted to toggle a menu.
 * @interface
 * @param {"toggle-menu"} e - Toggle the menu.
 */
export interface ToggleMenu {
  (e: "toggle-menu"): void;
}

/**
 * Events emitted by the base date picker.
 * @interface
 * @param {"update:value"} e - Update the date value.
 * @param {Date} value - The new date value.
 */
export interface BaseDatePickerEvents {
  (e: "update:value", value: Date): void;
}

/**
 * Events emitted by the base input date picker.
 * @interface
 * @param {"date:value"} e - Update the date value.
 * @param {string} value - The new date value.
 * @param {string} [id] - Optional identifier.
 */
export interface BaseInputDatePickerEvents {
  (e: "date:value", value: string, id?: string): void;
}

/**
 * Events emitted by the base radio input.
 * @interface
 * @param {"update:modelValue"} e - Update the selected option.
 * @param {string} newOption - The new selected option.
 *
 * @param {"selectOption"} e - Select an option.
 * @param {string} newOption - The selected option.
 */
export interface BaseRadioInputEvents {
  (e: "update:modelValue", newOption: string): void;
  (e: "selectOption", newOption: string): void;
}

/**
 * Events emitted by the base search component.
 * @interface
 * @param {"search"} e - Perform a search.
 * @param {"clear"} e - Clear the search.
 */
export interface BaseSearchEvents {
  (e: "search"): void;
  (e: "clear"): void;
}

/**
 * Events emitted by the base text input.
 * @interface
 * @param {"update:modelValue"} e - Update the model value.
 * @param {string} value - The new value.
 * @param {string} [id] - Optional identifier.
 * @param {string} [storeName] - Optional store name.
 *
 * @param {"change:modelValue"} e - Change the model value.
 * @param {string} value - The new value.
 * @param {string} [id] - Optional identifier.
 * @param {string} [storeName] - Optional store name.
 *
 * @param {"set:keyboard"} e - Set the keyboard event.
 * @param {Event} event - The keyboard event.
 */
export interface BaseTextEvents {
  (
    e: "update:modelValue",
    value: string,
    id?: string,
    storeName?: string
  ): void;
  (
    e: "change:modelValue",
    value: string,
    id?: string,
    storeName?: string
  ): void;
  (e: "set:keyboard", event: Event): void;
}

/**
 * Events for selecting list length in settings.
 * @interface
 * @param {"select-length"} e - Select the list length.
 * @param {number} length - The selected length.
 */
export interface ListLengthSettingsEvents {
  (e: "select-length", length: number): void;
}

/**
 * Events for choosing sorting in settings.
 * @interface
 * @param {"choose:sorting"} e - Choose the sorting option.
 * @param {string} option - The selected sorting option.
 */
export interface ListSortingEvents {
  (e: "choose:sorting", option: string): void;
}
