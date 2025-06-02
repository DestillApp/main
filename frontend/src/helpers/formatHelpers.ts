import type { Store } from "vuex";
import type { RootState } from "@/types/store/index";
/**
 * Formats the number input and dispatches the formatted value to the store.
 * @function setNumberFormat
 * @param {number} currentValue - The current value of the input.
 * @param {string} input - The input identifier.
 */
export const setNumberFormat = (
  store: Store<RootState>,
  value: string | number,
  id: string,
  storeName: string,
  decimals?: number
): void => {
  const numericValue = typeof value === "string" ? Number(value) : value;
  if (!numericValue || isNaN(numericValue)) {
    store.dispatch(`${storeName}/setValue`, { input: id, value: null });
  } else {
    store.dispatch(`${storeName}/setNumberFormat`, {
      input: id,
      value: numericValue,
      decimals,
    });
  }
};

/**
 * Formats the number input to an integer and dispatches the value to the store.
 * @function setIntegerNumber
 * @param {number} currentValue - The current value of the input.
 * @param {string} input - The input identifier.
 */
export const setIntegerNumber = (
  store: Store<RootState>,
  value: string | number,
  id: string,
  storeName: string
): void => {
  const numericValue = typeof value === "string" ? Number(value) : value;
  if (!numericValue || isNaN(numericValue)) {
    store.dispatch(`${storeName}/setValue`, { input: id, value: null });
  } else {
    store.dispatch(`${storeName}/setIntegerValue`, {
      input: id,
      value: numericValue,
    });
  }
};

/**
 * Prevents keyboard input for non-integer values.
 * @function setKeyboardIntegerNumber
 * @param {Event} e - The keyboard event.
 */
export const setKeyboardIntegerNumber = (e: KeyboardEvent): void => {
  if (e.key === "." || e.key === ",") {
    e.preventDefault();
  }
};

/**
 * Prevents keyboard input for non-formatted number values.
 * @function setKeyboardFormatedNumber
 * @param {Event} e - The keyboard event.
 */
export const setKeyboardFormatedNumber = (e: KeyboardEvent): void => {
  if (e.key === "." || e.key === "-") {
    e.preventDefault();
  }
};
