//add clicking option in the list item
<template>
  <!-- Container for the input field -->
  <div class="input-wrap">
    <!-- Label for the input field -->
    <label class="label" :for="id">{{ label }}</label>
    <!-- Container for the input element and optional unit slot -->
    <div class="container">
      <div class="input_container">
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
        />
        <!-- Slot for optional unit display -->
        <slot name="unit"></slot>
      </div>
      <ul v-if="results.length && modelValue !== ''" class="list">
        <li v-for="result in results" :key="result.id">
          {{ result }}
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
 * @see updateValue
 */
export default {
  props: [
    "label",
    "modelValue",
    "id",
    "disabled",
    "placeholder",
    "classType",
    "invalidInput",
    "results"
  ],

  setup(props, context) {

    /**
     * Updates the model value when input changes
     * @function updateValue
     */
    const updateValue = (e) => {
      context.emit("update:modelValue", e.target.value, props.id);
    };

    return {
      updateValue,
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

.message {
  color: var(--error-color);
  font-size: 12px;
  text-align: left;
}

.list {
  position: absolute;
  top: 31px;
  width: 100%;
  border-radius: var(--input-border-radius);
  border: 2px var(--secondary-color) solid;
  padding-inline: 20px;
  padding-block: 10px;
}
</style>
