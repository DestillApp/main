<template>
  <!-- Custom button component using Vuetify's v-btn -->
  <v-btn class="button" variant="outlined" :disabled="disabled">
    <!-- Slot for button content -->
    <slot></slot>
  </v-btn>
</template>

<script lang="ts">
/**
 * @component BaseButton
 * @description A custom button component that uses Vuetify's v-btn component with an outlined variant. It accepts and displays content passed through a slot.
 */

interface Props {
  disabled?: boolean;
}

export default {
  name: "BaseButton",
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props: Props) {
    return {
      disabled: props.disabled,
    };
  },
};
</script>

<style scoped>
.button {
  border: solid 2px;
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
