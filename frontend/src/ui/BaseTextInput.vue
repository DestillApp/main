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

<script>
import { computed } from "vue";
import { useStore } from "vuex";
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
 * @emits set:keyboard - Emitted when a keyboard event occurs.
 * @emits change:modelValue - Emitted when the input value changes and loses focus.
 * @see updateValue
 * @see setKeyboard
 * @see changeValue
 */
export default {
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
  setup(props, context) {
    const store = useStore();

    const isDarkTheme = computed(() => store.getters["settings/isDarkTheme"]);
    /**
     * Updates the model value when input changes
     * @function updateValue
     */
    const updateValue = (e) => {
      context.emit(
        "update:modelValue",
        e.target.value,
        props.id,
        props.storeName
      );
    };

    /**
     * Emits keyboard events
     * @function setKeyboard
     */
    const setKeyboard = (e) => {
      context.emit("set:keyboard", e);
    };

    /**
     * Emits value change events when input loses focus
     * @function changeValue
     */
    const changeValue = (e) => {
      context.emit(
        "change:modelValue",
        e.target.value,
        props.id,
        props.storeName
      );
    };

    // Computed property to determine if input is of type number
    const isNumberInput = computed(() => {
      return props.classType === "number";
    });

    // Computed property to determine if input is of type time
    const isTimeInput = computed(() => {
      return props.classType === "time";
    });

    // Computed property to determine if input is for oilAmount
    const isResultsInput = computed(() => {
      return props.classType === "results";
    });

    // Computed property to determine if input is for plant
    const isPlantInput = computed(() => {
      return props.inputColor === "plant";
    });

    // Computed property to determine if input is for distillation
    const isDistillationInput = computed(() => {
      return props.inputColor === "distillation";
    });

    // Computed property to determine if input is for distillation
    const isResultsInputColor = computed(() => {
      return props.inputColor === "results";
    });


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
