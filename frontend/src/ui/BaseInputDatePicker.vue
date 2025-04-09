<template>
  <!-- Container for the input and date picker -->
  <div class="date-picker">
    <div class="date-picker__input">
      <!-- Text input component with a disabled attribute and a placeholder -->
      <base-text-input
        :label="label"
        id="label"
        disabled="disabled"
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

<script>
import { ref, computed, watch, onMounted } from "vue";
import BaseTextInput from "./BaseTextInput.vue";
import BaseDatePicker from "./BaseDatePicker.vue";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiCalendarRange } from "@mdi/js";

/**
 * @component DatePickerContainer
 * @description This component renders a date picker inside a container with a text input and an SVG icon.
 * It handles the visibility of the date picker and emits the selected date to the parent component.
 * @props {string} label - The label for the text input.
 * @props {string} title - The title for the date picker.
 * @props {string} id - The id for the date picker.
 * @props {string} value - The initial value for the date.
 * @props {boolean} invalidInput - Flag to indicate if the input is invalid.
 * @emits {string} date:value - Emitted when the selected date changes.
 * @see changeVisibility
 * @see closeModal
 * @see formatedDate
 * @see updateDate
 */
export default {
  components: { BaseTextInput, BaseDatePicker, SvgIcon },
  props: ["label", "title", "id", "value", "invalidInput", "color"],
  setup(props, context) {
    // Reference to indicate if the input is disabled
    const disabled = ref(true);

    // Reference for the SVG icon path
    const path = ref(mdiCalendarRange);

    // Reference to indicate if the date picker is open
    const isOpen = ref(false);

    // Reference to store the selected date
    const date = ref("");

    /**
     * Toggles the visibility of the date picker
     * @function changeVisibility
     * @returns {void}
     */
    const changeVisibility = () => {
      isOpen.value = !isOpen.value;
      console.log(props.invalidInput);
    };

    /**
     * Closes the date picker modal
     * @function closeModal
     * @returns {void}
     */
    const closeModal = () => {
      isOpen.value = false;
    };

    // Watch for changes in props.value
    watch(
      () => props.value,
      (newValue) => {
        if (newValue !== "") {
          date.value = newValue;
        }
      },
      { immediate: true } // Ensure the watcher runs immediately on component creation
    );

    /**
     * Computed property to format the selected date
     * @function formatedDate
     * @returns {string|undefined} Formatted date as "DD-MM-YYYY" or undefined if date is empty
     */
    const formatedDate = computed(() => {
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
     * Updates the date ref with the selected date from the date picker
     * @function updateDate
     * @param {string} selectedDate - The date selected in the date picker
     * @returns {void}
     */
    const updateDate = (selectedDate) => {
      date.value = selectedDate;
    };

    //Lifecycle hook to initialize date ref if props.value is not empty
    onMounted(() => {
      if (props.value !== "") {
        date.value = props.value;
      }
    });

    // Watcher to emit the updated date to the parent component whenever formatedDate changes
    watch(formatedDate, () => {
      context.emit("date:value", date.value, props.id);
    });

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
      disabled,
      path,
      isOpen,
      formatedDate,
      date,
      changeVisibility,
      closeModal,
      updateDate,
      distillationColor,
      plantColor
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
