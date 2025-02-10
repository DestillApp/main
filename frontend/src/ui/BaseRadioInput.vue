<template>
  <!-- Container for the radio group -->
  <div>
    <!-- Title label for the radio group -->
    <label class="title" :for="title">{{ title }}</label>
    <!-- Vuetify radio group component -->
    <v-radio-group :id="title" v-model="selectOption" hide-details>
      <!-- Iterating over options to create radio buttons -->
      <v-radio
        v-for="option in options"
        :key="option"
        :label="option"
        :value="option"
        :color="color"
        :class="['radio_input', { 'dark-radio_input': isDarkTheme }]"
        :name="name"
      ></v-radio>
    </v-radio-group>
    <!-- Slot for message display -->
    <div class="message">
      <slot name="message"></slot>
    </div>
  </div>
</template>

<script>
import { ref, watch, computed } from "vue";
import { useStore } from "vuex";

/**
 * @component BaseRadioGroup
 * @description A radio group component that allows selecting one option from a list of options.
 * @props {Array} options - The array of options for the radio group.
 * @props {string} modelValue - The selected value of the radio group.
 * @props {string} title - The title for the radio group.
 * @props {string} name - The name attribute for the radio buttons.
 * @props {string} color - The color for the radio buttons.
 * @emits update:modelValue - Emitted when the selected option changes.
 * @emits selectOption - Emitted when an option is selected.
 */
export default {
  props: ["options", "modelValue", "title", "name", "color"],
  setup(props, context) {
    const store = useStore();
    const isDarkTheme = computed(() => store.getters["settings/isDarkTheme"]);

    // Reference to store the selected option
    const selectOption = ref(props.modelValue);

    // Watcher to update selectOption when modelValue changes
    watch(() => props.modelValue, (newValue) => {
      selectOption.value = newValue;
    });

    // Watcher to emit events when selectOption changes
    watch(selectOption, (newOption) => {
      context.emit("update:modelValue", newOption);
      context.emit("selectOption", newOption);
    });

    return { selectOption, isDarkTheme };
  },
};
</script>

<style scoped>
.title {
  font-size: 15px;
}

.radio_input {
  font-family: inherit;
  font-size: 15px;
  color: var(--text-color);
}

.dark-radio_input {
  color: var(--text-color-dark);
}

.message {
  color: var(--error-color);
  font-size: 12px;
  text-align: left;
}
</style>
