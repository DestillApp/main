<template>
  <!-- Container for the input field -->
  <div class="autocomplete-input">
    <!-- Label for the input field -->
    <label class="autocomplete-input__label" :for="id">{{ label }}</label>
    <!-- Container for the input element and optional unit slot -->
    <div class="autocomplete-input__container">
      <div
        v-if="choose"
        class="autocomplete-input__input-container autocomplete-input__input-container--choose"
      >
        <!-- Input field with dropdown icon for selection -->
        <input
          class="autocomplete-input__input"
          :class="{
            'autocomplete-input__input--dark': isDarkTheme,
          }"
          :id="id"
          :value="inputValue"
          :disabled="disabled"
          :placeholder="
            id === 'distillationApparatus' && results?.length === 0
              ? 'brak zapisanych destylatorów'
              : placeholder
          "
          @input="updateValue"
          v-bind="$attrs"
        />
        <svg-icon
          v-if="choose"
          class="autocomplete-input__icon"
          :class="{
            'autocomplete-input__icon--plant': plantColor,
            'autocomplete-input__icon--distillation': distillationColor,
            'autocomplete-input__icon--invalid': invalidInput,
          }"
          :style="{
            cursor:
              id === 'distillationApparatus' && results?.length === 0
                ? 'not-allowed'
                : 'pointer',
          }"
          type="mdi"
          :path="path"
          size="36"
          @click="openList"
        ></svg-icon>
        <!-- Slot for optional unit display -->
        <slot name="unit"></slot>
      </div>
      <div v-if="!choose" class="autocomplete-input__input-container">
        <!-- Input field for standard input mode -->
        <input
          class="autocomplete-input__input"
          :class="{
            'autocomplete-input__input--plant': plantColor,
            'autocomplete-input__input--distillation': distillationColor,
            'autocomplete-input__input--invalid': invalidInput,
            'autocomplete-input__input--dark': isDarkTheme,
          }"
          :id="id"
          :value="modelValue"
          :disabled="disabled"
          :placeholder="placeholder"
          @input="updateValue"
          v-bind="$attrs"
          @blur="handleBlur"
        />
        <!-- Slot for optional unit display -->
        <slot name="unit"></slot>
      </div>
      <!-- Dropdown list for distillation type or apparatus -->
      <ul
        v-if="
          (isOpen && id === 'distillationType') ||
          (isOpen && id === 'distillationApparatus')
        "
        class="autocomplete-input__list autocomplete-input__list--choose"
        :class="{
          'autocomplete-input__list--plant': plantColor,
          'autocomplete-input__list--distillation': distillationColor,
          'autocomplete-input__list--dark': isDarkTheme,
        }"
      >
        <li
          class="autocomplete-input__list-item autocomplete-input__list-item--choose"
          @mousedown="() => chooseItem(result)"
          v-for="result in results"
          :key="result.id"
        >
          {{ result }}
        </li>
      </ul>
      <!-- Dropdown list for country of origin -->
      <ul
        v-if="results?.length && modelValue !== '' && id === 'countryOfOrigin'"
        class="autocomplete-input__list"
        :class="{
          'autocomplete-input__list--plant': plantColor,
          'autocomplete-input__list--distillation': distillationColor,
          'autocomplete-input__list--dark': isDarkTheme,
        }"
      >
        <li
          class="autocomplete-input__list-item"
          @mousedown="() => chooseItem(result)"
          v-for="result in results"
          :key="result.id"
        >
          {{ result }}
        </li>
      </ul>
      <!-- Dropdown list for plant selection -->
      <ul
        v-if="results?.length && modelValue !== '' && id === 'choosedPlant'"
        class="autocomplete-input__list"
        :class="{
          'autocomplete-input__list--plant': plantColor,
          'autocomplete-input__list--distillation': distillationColor,
          'autocomplete-input__list--dark': isDarkTheme,
        }"
      >
        <li
          class="autocomplete-input__list-item"
          @mousedown="() => chooseItem(result)"
          v-for="result in results"
          :key="result._id"
        >
          <div class="autocomplete-input__plant-item">
            <div class="autocomplete-input__plant-identification">
              <span>{{ result.plantName }}</span>
              <span class="autocomplete-input__plant-small"
                >({{ result.plantPart }})</span
              >
            </div>
            <div
              class="autocomplete-input__plant-small"
              v-if="result.plantBuyDate"
            >
              kupno: <span>{{ result.plantBuyDate }}</span>
            </div>
            <div
              class="autocomplete-input__plant-small"
              v-if="result.harvestDate"
            >
              zbiór: <span>{{ result.harvestDate }}</span>
            </div>
            <div class="autocomplete-input__plant-small">
              na stanie: <span>{{ result.availableWeight }} kg</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!-- Slot for optional message display -->
    <div class="autocomplete-input__message">
      <slot name="message"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, watch } from "vue";
import { useStore } from "@/store/useStore";
import { InputEvents } from "@/types/events";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiArrowDownBoldBox } from "@mdi/js";

/**
 * @component BaseAutocompleteInput
 * @description A customizable autocomplete input component with optional dropdown, validation, and theming.
 * @props {string} label - The label for the input field.
 * @props {string|number} modelValue - The model value bound to the input field.
 * @props {string} id - The id for the input field.
 * @props {boolean} disabled - Flag to indicate if the input is disabled.
 * @props {string} placeholder - The placeholder text for the input field.
 * @props {string} classType - The class type for conditional styling.
 * @props {string} color - The color context for styling (e.g., "plant", "distillation").
 * @props {boolean} invalidInput - Flag to indicate if the input is invalid.
 * @props {any[]} results - List of results for the dropdown/autocomplete.
 * @props {boolean} toChoose - If true, enables dropdown selection mode.
 * @emits update:modelValue - Emitted when the input value changes.
 * @emits choose:item - Emitted when the user clicks on a list item.
 * @emits update:onBlur - Emitted when the input loses focus and blur is not disabled.
 * @emits open:list - Emitted when the dropdown list is opened.
 * @see updateValue
 * @see chooseItem
 * @see handleBlur
 * @see openList
 */

/**
 * Props interface for BaseAutocompleteInput.
 * @interface
 * @property {string} label - The label for the input field.
 * @property {string|number} modelValue - The model value bound to the input field.
 * @property {string} id - The id for the input field.
 * @property {boolean} disabled - Flag to indicate if the input is disabled.
 * @property {string} placeholder - The placeholder text for the input field.
 * @property {string} classType - The class type for conditional styling.
 * @property {string} color - The color context for styling (e.g., "plant", "distillation").
 * @property {boolean} invalidInput - Flag to indicate if the input is invalid.
 * @property {any[]} results - List of results for the dropdown/autocomplete.
 * @property {boolean} toChoose - If true, enables dropdown selection mode.
 */
interface Props {
  label?: string;
  modelValue?: string | number;
  id?: string;
  disabled?: boolean;
  placeholder?: string;
  classType?: string;
  color?: string;
  invalidInput?: boolean;
  results?: any[];
  toChoose?: boolean;
}

export default {
  name: "BaseAutocompleteInput",
  components: { SvgIcon },
  props: [
    "label",
    "modelValue",
    "id",
    "disabled",
    "placeholder",
    "classType",
    "color",
    "invalidInput",
    "results",
    "toChoose",
  ],
  emits: ["update:modelValue", "choose:item", "update:onBlur", "open:list"],
  setup(props: Props, context) {
    const emit = context.emit as InputEvents;
    const store = useStore();

    // Computed property for dark theme state
    const isDarkTheme = computed<boolean>(
      () => store.getters["settings/isDarkTheme"]
    );
    // Ref to temporarily disable blur when selecting from dropdown
    const disableBlur = ref<boolean>(false);
    // Ref to enable dropdown selection mode
    const choose = ref<boolean>(props.toChoose || false);
    // Ref for dropdown open state
    const isOpen = ref<boolean>(false);
    // Ref for the input value (syncs with modelValue)
    const inputValue = ref<string | number>(props.modelValue ?? "");
    // Ref for the icon path
    const path = ref<string>(mdiArrowDownBoldBox);

    // Watch for changes in modelValue and update inputValue accordingly
    watch(
      () => props.modelValue,
      (newValue) => {
        inputValue.value = newValue ?? "";
      }
    );

    /**
     * Updates the model value when input changes.
     * @function updateValue
     * @param {Event} e - The input event.
     * @returns {void}
     */
    const updateValue = (e: Event): void => {
      const target = e.target as HTMLInputElement;
      emit("update:modelValue", target.value, props.id);
    };

    /**
     * Updates the model value after clicking a list item.
     * Temporarily disables blur to prevent unintended triggers.
     * @function chooseItem
     * @param {any} result - The selected result/item.
     * @returns {void}
     */
    const chooseItem = (result: any): void => {
      disableBlur.value = true;
      emit("choose:item", result, props.id);
      setTimeout(() => {
        disableBlur.value = false;
      }, 500);
      if (props.toChoose) {
        isOpen.value = false;
      }
    };

    /**
     * Handles the blur event for the input field.
     * Emits the onBlur event if blur is not disabled.
     * @function handleBlur
     * @returns {void}
     */
    const handleBlur = (): void => {
      if (!disableBlur.value) {
        emit("update:onBlur");
      }
    };

    /**
     * Opens or closes the dropdown list.
     * @function openList
     * @returns {void}
     */
    const openList = (): void => {
      if (props.id === "distillationApparatus" && props.results?.length === 0) {
        return;
      }
      isOpen.value = !isOpen.value;
    };

    // Computed property for distillation color context
    const distillationColor = computed<boolean>(
      () => props.color === "distillation"
    );
    // Computed property for plant color context
    const plantColor = computed<boolean>(() => props.color === "plant");

    return {
      isDarkTheme,
      updateValue,
      chooseItem,
      handleBlur,
      openList,
      choose,
      path,
      isOpen,
      distillationColor,
      plantColor,
      inputValue,
    };
  },
};
</script>

<style scoped>
.autocomplete-input {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 5px;
}

.autocomplete-input__label {
  font-size: 15px;
  text-align: left;
}

.autocomplete-input__container {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
}

.autocomplete-input__input-container {
  display: flex;
  flex-direction: row;
  gap: 7px;
  align-items: center;
}

.autocomplete-input__input-container--choose {
  position: relative;
  padding-right: 40px;
}

.autocomplete-input__input {
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
}

.autocomplete-input__input--dark {
  color: var(--text-color-dark);
  border: 2px solid var(--border-color-dark);
}

.autocomplete-input__input::placeholder {
  color: var(--placeholder-color);
}

.autocomplete-input__input:focus {
  outline: none;
}

.autocomplete-input__input--plant:focus {
  border: 2px solid var(--secondary-color);
}

.autocomplete-input__input--distillation:focus {
  border: 2px solid var(--secondary-color-distillation);
}

.autocomplete-input__input--invalid {
  border: 2px solid var(--error-color);
}

.autocomplete-input__input--invalid:focus {
  border: 2px solid var(--error-color);
}

.autocomplete-input__icon {
  cursor: pointer;
  position: absolute;
  right: 0;
}

.autocomplete-input__icon--plant {
  color: var(--secondary-color);
}

.autocomplete-input__icon--plant:hover {
  color: var(--primary-color);
}

.autocomplete-input__icon--distillation {
  color: var(--secondary-color-distillation);
}

.autocomplete-input__icon--distillation:hover {
  color: var(--primary-color-distillation);
}

.autocomplete-input__icon--invalid,
.autocomplete-input__icon--invalid:hover {
  color: var(--error-color);
}

.autocomplete-input__message {
  color: var(--error-color);
  font-size: 12px;
  text-align: left;
}

.autocomplete-input__list {
  position: absolute;
  background-color: var(--background-bright);
  z-index: 10;
  top: 31px;
  width: 100%;
  border-radius: var(--input-border-radius);
  padding-inline: 20px;
  padding-block: 10px;
}

.autocomplete-input__list--dark {
  background-color: var(--background-dark);
}

.autocomplete-input__list--choose {
  width: calc(100% - 40px);
}

.autocomplete-input__list--plant {
  border: 2px var(--secondary-color) solid;
}

.autocomplete-input__list--distillation {
  border: 2px var(--secondary-color-distillation) solid;
}

.autocomplete-input__list-item {
  cursor: pointer;
}

.autocomplete-input__list-item--choose {
  text-align: left;
}

.autocomplete-input__plant-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.autocomplete-input__plant-identification {
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.autocomplete-input__plant-small {
  font-size: 12px;
}
</style>
