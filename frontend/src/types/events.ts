export interface InputEvents {
  (e: "update:modelValue", value: string | number, id?: string): void;
  (e: "choose:item", result: any, id?: string): void;
  (e: "update:onBlur"): void;
  (e: "open:list"): void;
}

export interface DeleteItemModalEvents {
  (e: "close-delete-modal"): void;
  (e: "delete-item"): void;
}

export interface CloseModal {
  (e: "close-modal"): void;
}

export interface AskModalEvents extends CloseModal {
  (e: "handle-yes"): void;
}

export interface ToggleMenu {
  (e: "toggle-menu"): void;
}

export interface BaseDatePickerEvents {
  (e: "update:value", value: Date): void;
}

export interface BaseInputDatePickerEvents {
  (e: "date:value", value: string, id?: string): void;
}

export interface BaseRadioInputEvents {
  (e: "update:modelValue", newOption: string): void;
  (e: "selectOption", newOption: string): void;
}

export interface BaseSearchEvents {
  (e: "search"): void;
  (e: "clear"): void;
}

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

export interface ListLengthSettingsEvents {
  (e: "select-length", length: number): void;
}

export interface ListSortingEvents {
  (e: "choose:sorting", option: string): void;
}
