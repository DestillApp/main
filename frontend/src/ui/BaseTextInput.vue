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
import { defineComponent, computed } from "vue";
import { useStore } from "@/store/useStore";
import { BaseTextEvents } from "@/types/events";

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

export default defineComponent({
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

    const isDarkTheme = computed<boolean>(
      () => store.getters["settings/isDarkTheme"]
    );

    /**
     * Updates the model value when input changes
     */
    const updateValue = (e: Event): void => {
      const target = e.target as HTMLInputElement;
      emit("update:modelValue", target.value, props.id, props.storeName);
    };

    /**
     * Emits keyboard events
     */
    const setKeyboard = (e: Event): void => {
      emit("set:keyboard", e);
    };

    /**
     * Emits value change events when input loses focus
     */
    const changeValue = (e: Event): void => {
      const target = e.target as HTMLInputElement;
      emit("change:modelValue", target.value, props.id, props.storeName);
    };

    const isNumberInput = computed<boolean>(() => props.classType === "number");
    const isTimeInput = computed<boolean>(() => props.classType === "time");
    const isResultsInput = computed<boolean>(
      () => props.classType === "results"
    );
    const isPlantInput = computed<boolean>(() => props.inputColor === "plant");
    const isDistillationInput = computed<boolean>(
      () => props.inputColor === "distillation"
    );
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
});
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
