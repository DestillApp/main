<template>
  <!-- Container for the input and date picker -->
  <div class="date-picker">
    <div class="date-picker__input">
      <!-- Text input component with a disabled attribute and a placeholder -->
      <base-text-input
        :label="label"
        id="label"
        :disabled="disabled"
        placeholder="wybierz datę"
        v-model="formatedDate"
      >
      </base-text-input>
      <!-- SVG icon for calendar with conditional color and click event to toggle visibility -->
      <svg-icon
        type="mdi"
        :path="path"
        size="32"
        :class="{
          'date-picker__icon--plant': plantColor,
          'date-picker__icon--distillation': distillationColor,
          'date-picker__icon--invalid': invalidInput,
        }"
        class="date-picker__icon"
        @click="changeVisibility"
      ></svg-icon>
    </div>
    <!-- Date picker component, shown conditionally based on isOpen -->
    <base-date-picker
      v-if="isOpen"
      :title="title"
      @close-modal="closeModal"
      @update:value="updateDate"
      :value="date"
      :color="color"
    ></base-date-picker>
  </div>
</template>

<script lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import BaseTextInput from "./BaseTextInput.vue";
import BaseDatePicker from "./BaseDatePicker.vue";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiCalendarRange } from "@mdi/js";
import { BaseInputDatePickerEvents } from "@/types/events";

/**
 * @component BaseInputDatePicker
 * @description A component that combines a text input and a date picker modal for selecting and displaying dates.
 * @props {string} label - The label for the input field.
 * @props {string} title - The title for the date picker modal.
 * @props {string} id - The id for the input field.
 * @props {string} value - The selected date value.
 * @props {boolean} invalidInput - Flag to indicate if the input is invalid.
 * @props {string} color - The color context for styling (e.g., "plant", "distillation").
 * @emits date:value - Emitted when the date value changes.
 * @see changeVisibility
 * @see closeModal
 * @see updateDate
 */

/**
 * Props for BaseInputDatePicker component.
 * @interface Props
 */
interface Props {
  label?: string;
  title?: string;
  id?: string;
  value?: string;
  invalidInput?: boolean;
  color?: string;
}

export default {
  components: { BaseTextInput, BaseDatePicker, SvgIcon },
  props: ["label", "title", "id", "value", "invalidInput", "color"],
  setup(props: Props, context) {
    const emit = context.emit as BaseInputDatePickerEvents;

    // Ref for disabling the input (always true for date picker)
    const disabled = ref<boolean>(true);
    // Ref for calendar icon path
    const path = ref<string>(mdiCalendarRange);
    // Ref for date picker modal open state
    const isOpen = ref<boolean>(false);
    // Ref for the raw date value
    const date = ref<string>("");

    /**
     * Toggles the visibility of the date picker modal.
     * @function changeVisibility
     * @returns {void}
     */
    const changeVisibility = (): void => {
      isOpen.value = !isOpen.value;
    };

    /**
     * Closes the date picker modal.
     * @function closeModal
     * @returns {void}
     */
    const closeModal = (): void => {
      isOpen.value = false;
    };

    // Watch for changes in the value prop and update the date ref
    watch(
      () => props.value,
      (newValue) => {
        if (newValue !== "") {
          date.value = newValue as string;
        }
      },
      { immediate: true }
    );

    // Computed property for formatted date string (DD-MM-YYYY)
    const formatedDate = computed<string | undefined>(() => {
      if (date.value === "") {
        return;
      } else {
        const fullDate = new Date(date.value);
        const day = String(fullDate.getDate()).padStart(2, "0");
        const month = String(fullDate.getMonth() + 1).padStart(2, "0");
        const year = fullDate.getFullYear();
        return `${day}-${month}-${year}`;
      }
    });

    /**
     * Updates the date value when a new date is selected.
     * @function updateDate
     * @param {string} selectedDate - The selected date string.
     * @returns {void}
     */
    const updateDate = (selectedDate: string): void => {
      date.value = selectedDate;
    };

    // Set initial date value on mount
    onMounted(() => {
      if (props.value !== "") {
        date.value = props.value as string;
      }
    });

    // Emit the date value whenever the formatted date changes
    watch(formatedDate, () => {
      emit("date:value", date.value, props.id);
    });

    // Computed property for distillation color context
    const distillationColor = computed<boolean>(
      () => props.color === "distillation"
    );
    // Computed property for plant color context
    const plantColor = computed<boolean>(() => props.color === "plant");

    return {
      disabled,
      path,
      isOpen,
      formatedDate,
      date,
      changeVisibility,
      closeModal,
      updateDate,
      distillationColor,
      plantColor,
    };
  },
};
</script>

<style scoped>
.date-picker__input {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: flex-end;
  gap: 5px;
  margin-right: 50px;
}

.date-picker__icon {
  position: absolute;
  cursor: pointer;
  margin-bottom: 2px;
  left: 210px;
  top: 27px;
}

.date-picker__icon--plant {
  color: var(--secondary-color);
}

.date-picker__icon--plant:hover {
  color: var(--primary-color);
}

.date-picker__icon--distillation {
  color: var(--secondary-color-distillation);
}

.date-picker__icon--distillation:hover {
  color: var(--primary-color-distillation);
}

.date-picker__icon--invalid {
  color: var(--error-color);
}

:deep(.input__message) {
  display: none;
}

@media (max-width: 600px) {
  .date-picker__input {
    width: 150px;
    margin-right: 0px;
  }

  .date-picker__icon {
    left: 160px;
  }
}
</style>
