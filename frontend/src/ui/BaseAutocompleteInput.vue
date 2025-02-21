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
        <!-- Input field -->
        <input
          class="autocomplete-input__input"
          :class="{
            'autocomplete-input__input--dark': isDarkTheme,
          }"
          :id="id"
          :value="inputValue"
          :disabled="disabled"
           :placeholder="id === 'distillationApparatus' && results.length === 0 ? 'brak zapisanych destylatorów' : placeholder"
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
          :style="{ cursor: id === 'distillationApparatus' && results.length === 0 ? 'not-allowed' : 'pointer' }"
          type="mdi"
          :path="path"
          size="36"
          @click="openList"
        ></svg-icon>
        <!-- Slot for optional unit display -->
        <slot name="unit"></slot>
      </div>
      <div v-if="!choose" class="autocomplete-input__input-container">
        <!-- Input field -->
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
      <ul
        v-if="results.length && modelValue !== '' && id === 'countryOfOrigin'"
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
      <ul
        v-if="results.length && modelValue !== '' && id === 'choosedPlant'"
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

<script>
import { ref, computed, watch } from "vue";
import { useStore } from "vuex";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiArrowDownBoldBox } from "@mdi/js";

/**
 * @component BaseTextInput
 * @description A customizable text input component.
 * @props {string} label - The label for the input field.
 * @props {string} modelValue - The model value bound to the input field.
 * @props {string} id - The id for the input field.
 * @props {boolean} disabled - Flag to indicate if the input is disabled.
 * @props {string} placeholder - The placeholder text for the input field.
 * @props {string} classType - The class type for conditional styling (e.g., "number" or "time").
 * @props {boolean} invalidInput - Flag to indicate if the input is invalid.
 * @emits update:modelValue - Emitted when the input value changes.
 * @emits choose:item - Emitted when the user click on the list item
 * @emits update:onBlur - Emitted when the input loose its focus and disableBlur is false
 * @see updateValue
 * @see chooseItem
 * @see handleBlur
 */
export default {
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
  setup(props, context) {
    const store = useStore();

    const isDarkTheme = computed(() => store.getters["settings/isDarkTheme"]);
    const disableBlur = ref(false);
    const choose = ref(props.toChoose || false);
    const isOpen = ref(false);
    const inputValue = ref(props.modelValue);
    const path = ref(mdiArrowDownBoldBox);

    watch(
      () => props.modelValue,
      (newValue) => {
        inputValue.value = newValue;
      }
    );

    /**
     * @function updateValue
     * @description Updates the model value when input changes
     * @returns {void}
     */
    const updateValue = (e) => {
      context.emit("update:modelValue", e.target.value, props.id);
    };

    /**
     * @function chooseItem
     * @description Updates the model value after click on the list item. It temporarily disables the blur event to prevent unintended triggers when the user clicks on an item. After emitting the chosen item, blur is re-enabled after a short delay.
     * @param {Event} e - The click event triggered when the user selects an item from the list.
     * @emits choose:item - Emits the selected item value and id to the parent component.
     * @returns {void}
     */
    const chooseItem = (result) => {
      disableBlur.value = true;
      context.emit("choose:item", result, props.id);
      setTimeout(() => {
        disableBlur.value = false; // Re-enable blur after a short delay
      }, 500);
      if (props.toChoose) {
        isOpen.value = false;
      }
    };

    /**
     * @function handleBlur
     * @description Handles the blur event for the input field. It checks whether the blur event is disabled (when selecting an item). If blur is not disabled, it emits the onBlur event to the parent component.
     * @emits update:onBlur - Emits the blur event to notify the parent component that the input has lost focus.
     * @returns {void}
     */
    const handleBlur = () => {
      if (!disableBlur.value) {
        context.emit("update:onBlur");
      }
    };

    const openList = () => {
      if (props.id === "distillationApparatus" && props.results.length === 0) {
        return;
      }
      if (!isOpen.value) {
        isOpen.value = true;
      } else {
        isOpen.value = false;
      }
    };

    const distillationColor = computed(() => {
      if (props.color === "distillation") {
        return true;
      } else {
        return false;
      }
    });

    const plantColor = computed(() => {
      if (props.color === "plant") {
        return true;
      } else {
        return false;
      }
    });

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
