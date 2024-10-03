// no arch docs and no code docs
<template>
  <!-- Container for the input field -->
  <div class="input-wrap">
    <!-- Label for the input field -->
    <label class="label" :for="id">{{ label }}</label>
    <!-- Container for the input element and optional unit slot -->
    <div class="container">
      <div v-if="choose" class="input_container input_container--choose">
        <!-- Input field -->
        <input
          class="input"
          :id="id"
          :value="modelValue"
          :disabled="disabled"
          :placeholder="placeholder"
          @input="updateValue"
          v-bind="$attrs"
        />
        <svg-icon
          v-if="choose"
          class="icon"
          type="mdi"
          :path="path"
          size="36"
          :color="
            invalidInput === true
              ? 'var(--error-color)'
              : 'var(--secondary-color)'
          "
          @click="openList"
        ></svg-icon>
        <!-- Slot for optional unit display -->
        <slot name="unit"></slot>
      </div>
      <div v-if="!choose" class="input_container">
        <!-- Input field -->
        <input
          class="input"
          :class="{
            input_invalid: invalidInput,
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
        class="list list--choose"
      >
        <li
          class="list_item list_item--choose"
          @mousedown="() => chooseItem(result)"
          v-for="result in results"
          :key="result.id"
        >
          {{ result }}
        </li>
      </ul>
      <ul
        v-if="results.length && modelValue !== '' && id === 'countryOfOrigin'"
        class="list"
      >
        <li
          class="list_item"
          @mousedown="() => chooseItem(result)"
          v-for="result in results"
          :key="result.id"
        >
          {{ result }}
        </li>
      </ul>
      <ul
        v-if="results.length && modelValue !== '' && id === 'choosedPlant'"
        class="list"
      >
        <li
          class="list_item"
          @mousedown="() => chooseItem(result)"
          v-for="result in results"
          :key="result._id"
        >
          <div class="plant_item">
            <div class="plant_identification">
              <span>{{ result.plantName }}</span>
              <span class="plant_small">({{ result.plantPart }})</span>
            </div>
            <div class="plant_small" v-if="result.plantBuyDate">
              kupno: <span>{{ result.plantBuyDate }}</span>
            </div>
            <div class="plant_small" v-if="result.harvestDate">
              zbiór: <span>{{ result.harvestDate }}</span>
            </div>
            <div class="plant_small">
              na stanie: <span>{{ result.availableWeight }} kg</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!-- Slot for optional message display -->
    <div class="message">
      <slot name="message"></slot>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
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
    "invalidInput",
    "results",
    "toChoose",
  ],
  emits: ["update:modelValue", "choose:item", "update:onBlur", "open:list"],
  setup(props, context) {
    const disableBlur = ref(false);
    const choose = ref(props.toChoose || false);
    const isOpen = ref(false);
    // Reference for the SVG icon path
    const path = ref(mdiArrowDownBoldBox);

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
      console.log("CLICK");
      if (!isOpen.value) {
        isOpen.value = true;
      } else {
        isOpen.value = false;
      }
    };

    return {
      updateValue,
      chooseItem,
      handleBlur,
      openList,
      choose,
      path,
      isOpen,
    };
  },
};
</script>

<style scoped>
.input-wrap {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 5px;
}

.label {
  font-size: 15px;
  text-align: left;
}

.container {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
}

.input_container {
  display: flex;
  flex-direction: row;
  gap: 7px;
  align-items: center;
}

.input_container--choose {
  position: relative;
  padding-right: 40px;
}

.input {
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

.input::placeholder {
  color: var(--placeholder-color);
}

.input:focus {
  outline: none;
  border: 2px solid var(--secondary-color);
}

.input_invalid {
  border: 2px solid var(--error-color);
}

.input_invalid:focus {
  border: 2px solid var(--error-color);
}

.icon {
  cursor: pointer;
  position: absolute;
  right: 0;
}

.icon:hover {
  color: var(--primary-color);
}

.message {
  color: var(--error-color);
  font-size: 12px;
  text-align: left;
}

.list {
  position: absolute;
  background-color: white;
  z-index: 10;
  top: 31px;
  width: 100%;
  border-radius: var(--input-border-radius);
  border: 2px var(--secondary-color) solid;
  padding-inline: 20px;
  padding-block: 10px;
}

.list--choose {
  width: calc(100% - 40px);
}

.list_item {
  cursor: pointer;
}

.list_item--choose {
  text-align: left;
}

.plant_item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.plant_identification {
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.plant_small {
  font-size: 12px;
}
</style>
