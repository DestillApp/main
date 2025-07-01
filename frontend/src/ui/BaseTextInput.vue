<template>
  <!-- Container for the input field -->
  <div class="input">
    <!-- Label for the input field -->
    <label class="input__label" :for="id">{{ label }}</label>
    <!-- Container for the input element and optional unit slot -->
    <div class="input__container">
      <!-- Input field -->
      <input
        class="input__field"
        :class="{
          'input__field--number': isNumberInput,
          'input__field--time': isTimeInput,
          'input__field--plant': isPlantInput,
          'input__field--distillation': isDistillationInput,
          'input__field--results': isResultsInput,
          'input__field--results-color': isResultsInputColor,
          'input__field--invalid': invalidInput,
          'input__field--dark': isDarkTheme,
        }"
        :id="id"
        :value="modelValue"
        :disabled="disabled"
        :placeholder="placeholder"
        @input="updateValue"
        @keypress="setKeyboard"
        @blur="changeValue"
        v-bind="$attrs"
      />
      <!-- Slot for optional unit display -->
      <slot name="unit"></slot>
    </div>
    <!-- Slot for optional message display -->
    <div class="input__message">
      <slot name="message"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { computed } from "vue";
import { useStore } from "@/store/useStore";
import { BaseTextEvents } from "@/types/events";

/**
 * @component BaseTextInput
 * @description A customizable text input component with support for validation, theming, and color context.
 * @props {string} label - The label for the input field.
 * @props {string|number|null} modelValue - The value bound to the input field.
 * @props {string} id - The id for the input field.
 * @props {boolean} disabled - Flag to indicate if the input is disabled.
 * @props {string} placeholder - The placeholder text for the input field.
 * @props {string} classType - The class type for conditional styling (e.g., "number", "time", "results").
 * @props {string} inputColor - The color context for the input (e.g., "plant", "distillation", "results").
 * @props {boolean} invalidInput - Flag to indicate if the input is invalid.
 * @props {string} storeName - The name of the store for value updates.
 * @emits update:modelValue - Emitted when the input value changes.
 * @emits change:modelValue - Emitted when the input loses focus and value changes.
 * @emits set:keyboard - Emitted on keyboard events.
 * @see updateValue
 * @see setKeyboard
 * @see changeValue
 */

/**
 * Props for BaseTextInput component.
 * @interface
 * @property {string} label - The label for the input field.
 * @property {string|number|null} modelValue - The value bound to the input field.
 * @property {string} id - The id for the input field.
 * @property {boolean} disabled - Flag to indicate if the input is disabled.
 * @property {string} placeholder - The placeholder text for the input field.
 * @property {string} classType - The class type for conditional styling (e.g., "number", "time", "results").
 * @property {string} inputColor - The color context for the input (e.g., "plant", "distillation", "results").
 * @property {boolean} invalidInput - Flag to indicate if the input is invalid.
 * @property {string} storeName - The name of the store for value updates.
 */
interface Props {
  label?: string;
  modelValue?: string | number | null;
  id?: string;
  disabled?: boolean;
  placeholder?: string;
  classType?: string;
  inputColor?: string;
  invalidInput?: boolean;
  storeName?: string;
}

export default {
  name: "BaseTextInput",
  props: [
    "label",
    "modelValue",
    "id",
    "disabled",
    "placeholder",
    "classType",
    "inputColor",
    "invalidInput",
    "storeName",
  ],
  emits: ["update:modelValue", "change:modelValue", "set:keyboard"],
  setup(props: Props, context) {
    const emit = context.emit as BaseTextEvents;
    const store = useStore();

    // Computed property for dark theme state
    const isDarkTheme = computed<boolean>(
      () => store.getters["settings/isDarkTheme"]
    );

    /**
     * Updates the model value when input changes.
     * @function updateValue
     * @param {Event} e - The input event.
     * @returns {void}
     */
    const updateValue = (e: Event): void => {
      const target = e.target as HTMLInputElement;
      emit("update:modelValue", target.value, props.id, props.storeName);
    };

    /**
     * Emits keyboard events.
     * @function setKeyboard
     * @param {Event} e - The keyboard event.
     * @returns {void}
     */
    const setKeyboard = (e: Event): void => {
      emit("set:keyboard", e);
    };

    /**
     * Emits value change events when input loses focus.
     * @function changeValue
     * @param {Event} e - The blur event.
     * @returns {void}
     */
    const changeValue = (e: Event): void => {
      const target = e.target as HTMLInputElement;
      emit("change:modelValue", target.value, props.id, props.storeName);
    };

    // Computed property for number input type
    const isNumberInput = computed<boolean>(() => props.classType === "number");
    // Computed property for time input type
    const isTimeInput = computed<boolean>(() => props.classType === "time");
    // Computed property for results input type
    const isResultsInput = computed<boolean>(
      () => props.classType === "results"
    );
    // Computed property for plant color context
    const isPlantInput = computed<boolean>(() => props.inputColor === "plant");
    // Computed property for distillation color context
    const isDistillationInput = computed<boolean>(
      () => props.inputColor === "distillation"
    );
    // Computed property for results color context
    const isResultsInputColor = computed<boolean>(
      () => props.inputColor === "results"
    );

    return {
      isDarkTheme,
      updateValue,
      setKeyboard,
      changeValue,
      isNumberInput,
      isTimeInput,
      isPlantInput,
      isDistillationInput,
      isResultsInput,
      isResultsInputColor,
    };
  },
};
</script>

<style scoped>
.input {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 5px;
}

.input__label {
  font-size: 15px;
  text-align: left;
}

.input__container {
  display: flex;
  flex-direction: row;
  gap: 7px;
  align-items: center;
}

.input__field {
  font-size: 15px;
  color: var(--text-color);
  font-family: inherit;
  border: 2px solid var(--border-color);
  border-radius: var(--input-border-radius);
  padding-block: 2px;
  padding-inline: 10px;
  width: 100%;
}

.input__field--dark {
  color: var(--text-color-dark);
  border: 2px solid var(--border-color-dark);
}

.input__field::placeholder {
  color: var(--placeholder-color);
}

.input__field--number {
  width: 70px;
  padding-right: 0px;
  padding-left: 10px;
}

.input__field--time {
  width: 60px;
  padding-right: 5px;
  padding-left: 5px;
  text-align: center;
}

.input__field--results {
  width: 100px;
  padding-right: 0px;
  padding-left: 10px;
}

.input__field--plant:focus {
  border: 2px solid var(--secondary-color);
}

.input__field--distillation:focus {
  border: 2px solid var(--secondary-color-distillation);
}

.input__field--results-color:focus {
  border: 2px solid var(--secondary-color-results);
}

.input__field:focus {
  outline: none;
}

.input__field--invalid {
  border: 2px solid var(--error-color);
}

.input__field--invalid:focus {
  border: 2px solid var(--error-color);
}

.input__message {
  color: var(--error-color);
  font-size: 12px;
  text-align: left;
  min-height: 18px;
}
</style>
