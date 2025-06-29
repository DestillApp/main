<template>
  <!-- Container for the text area field -->
  <div class="textarea">
    <!-- Label for the text area field -->
    <label class="textarea__label" :for="id">{{ label }}</label>
    <!-- Text area field -->
    <textarea
      class="textarea__input"
      :class="{
        'textarea__input--results': isResultsTextArea,
        'textarea__input--invalid': invalidInput,
        'textarea__input--dark': isDarkTheme,
      }"
      :id="id"
      :value="modelValue"
      :placeholder="placeholder"
      @input="updateValue"
      @keypress="setKeyboard"
      @blur="changeValue"
      v-bind="$attrs"
    ></textarea>
    <!-- Slot for optional message display -->
    <div class="textarea__message">
      <slot name="message"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { computed } from "vue";
import { useStore } from "@/store/useStore";
import { BaseTextEvents } from "@/types/events";

/**
 * @component BaseTextArea
 * @description A customizable text area component with support for validation, theming, and color context.
 * @props {string} label - The label for the text area.
 * @props {string} modelValue - The value bound to the text area.
 * @props {string} id - The id for the text area.
 * @props {string} placeholder - The placeholder text for the text area.
 * @props {boolean} invalidInput - Flag to indicate if the input is invalid.
 * @props {string} inputColor - The color context for the text area (e.g., "results").
 * @props {string} storeName - The name of the store for value updates.
 * @emits update:modelValue - Emitted when the text area value changes.
 * @emits change:modelValue - Emitted when the text area loses focus and value changes.
 * @emits set:keyboard - Emitted on keyboard events.
 * @see updateValue
 * @see setKeyboard
 * @see changeValue
 */

/**
 * Props for BaseTextArea component.
 * @interface Props
 */
interface Props {
  label?: string;
  modelValue?: string;
  id?: string;
  placeholder?: string;
  invalidInput?: boolean;
  inputColor?: string;
  storeName?: string;
}

export default {
  name: "BaseTextArea",
  props: [
    "label",
    "modelValue",
    "id",
    "placeholder",
    "invalidInput",
    "inputColor",
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
     * Updates the model value when text area changes.
     * @function updateValue
     * @param {Event} e - The input event.
     * @returns {void}
     */
    const updateValue = (e: Event): void => {
      const target = e.target as HTMLTextAreaElement;
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
     * Emits value change events when text area loses focus.
     * @function changeValue
     * @param {Event} e - The blur event.
     * @returns {void}
     */
    const changeValue = (e: Event): void => {
      const target = e.target as HTMLTextAreaElement;
      emit("change:modelValue", target.value, props.id, props.storeName);
    };

    // Computed property to determine if text area is for results
    const isResultsTextArea = computed<boolean>(
      () => props.inputColor === "results"
    );

    return {
      updateValue,
      setKeyboard,
      changeValue,
      isResultsTextArea,
      isDarkTheme,
    };
  },
};
</script>

<style scoped>
.textarea {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 5px;
}

.textarea__label {
  font-size: 15px;
  text-align: left;
}

.textarea__input {
  font-size: 15px;
  color: var(--text-color);
  font-family: inherit;
  border: 2px solid var(--border-color);
  border-radius: var(--input-border-radius);
  padding-top: 2px;
  padding-bottom: 2px;
  padding-right: 10px;
  padding-left: 10px;
  width: 100%;
  resize: vertical;
  min-height: 50px;
}

.textarea__input--dark {
  color: var(--text-color-dark);
  border: 2px solid var(--border-color-dark);
}

.textarea__input::placeholder {
  color: var(--placeholder-color);
}

.textarea__input--results {
  width: 100%;
  padding-inline: 10px;
  padding-block: 3px;
}

.textarea__input--results:focus {
  border: 2px solid var(--secondary-color-results);
}

.textarea__input:focus {
  outline: none;
}

.textarea__input--invalid {
  border: 2px solid var(--error-color);
}

.textarea__input--invalid:focus {
  border: 2px solid var(--error-color);
}

.textarea__message {
  color: var(--error-color);
  font-size: 12px;
  text-align: left;
  min-height: 18px;
}
</style>
