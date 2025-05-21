<template>
  <!-- Container for the radio group -->
  <div>
    <!-- Title label for the radio group -->
    <label class="radio-group__title" :for="title">{{ title }}</label>
    <!-- Vuetify radio group component -->
    <v-radio-group :id="title" v-model="selectOption" hide-details>
      <!-- Iterating over options to create radio buttons -->
      <v-radio
        v-for="option in options"
        :key="option"
        :label="option"
        :value="option"
        :color="color"
        :class="[
          'radio-group__input',
          { 'radio-group__input--dark': isDarkTheme },
        ]"
        :name="name"
      ></v-radio>
    </v-radio-group>
    <!-- Slot for message display -->
    <div class="radio-group__message">
      <slot name="message"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from "vue";
import { useStore } from "@/store/useStore";
import { BaseRadioInputEvents } from "@/types/events";

/**
 * @interface Props
 * @description Props for BaseRadioInput component.
 */
interface Props {
  options: string[];
  modelValue: string;
  title: string;
  name?: string;
  color?: string;
}

export default defineComponent({
  name: "BaseRadioInput",
  props: ["options", "modelValue", "title", "name", "color"],
  emits: ["update:modelValue", "selectOption"],
  setup(props: Props, context) {
    const emit = context.emit as BaseRadioInputEvents;
    const store = useStore();

    const isDarkTheme = computed<boolean>(
      () => store.getters["settings/isDarkTheme"]
    );

    // Reference to store the selected option
    const selectOption = ref<string>(props.modelValue);

    // Watcher to update selectOption when modelValue changes
    watch(
      () => props.modelValue,
      (newValue) => {
        selectOption.value = newValue;
      }
    );

    // Watcher to emit events when selectOption changes
    watch(selectOption, (newOption) => {
      emit("update:modelValue", newOption);
      emit("selectOption", newOption);
    });

    return { selectOption, isDarkTheme };
  },
});
</script>

<style scoped>
.radio-group__title {
  font-size: 15px;
}

.radio-group__input {
  font-family: inherit;
  font-size: 15px;
  color: var(--text-color);
}

.radio-group__input--dark {
  color: var(--text-color-dark);
}

.radio-group__message {
  color: var(--error-color);
  font-size: 12px;
  text-align: left;
}
</style>
