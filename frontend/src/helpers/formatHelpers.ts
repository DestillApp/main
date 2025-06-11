import type { Store } from "vuex";
import type { RootState } from "@/types/store/index";

/**
 * Formats the number input and dispatches the formatted value to the store.
 * @param {Store<RootState>} store - The Vuex store instance.
 * @param {string | number} value - The value to be formatted and set.
 * @param {string} id - The input identifier.
 * @param {string} storeName - The Vuex module name.
 * @param {number} [decimals] - Optional number of decimal places.
 * @returns {void}
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
 * @param {Store<RootState>} store - The Vuex store instance.
 * @param {string | number} value - The value to be formatted and set.
 * @param {string} id - The input identifier.
 * @param {string} storeName - The Vuex module name.
 * @returns {void}
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
 * Prevents keyboard input for non-integer values (e.g., dot or comma).
 * @param {KeyboardEvent} e - The keyboard event.
 * @returns {void}
 */
export const setKeyboardIntegerNumber = (e: KeyboardEvent): void => {
  if (e.key === "." || e.key === ",") {
    e.preventDefault();
  }
};

/**
 * Prevents keyboard input for minus sign.
 * @param {KeyboardEvent} e - The keyboard event.
 * @returns {void}
 */
export const preventMinusNumber = (e: KeyboardEvent): void => {
  if (e.key === "-") {
    e.preventDefault();
  }
};
