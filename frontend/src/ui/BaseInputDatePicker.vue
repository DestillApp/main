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
import { defineComponent, ref, computed, watch, onMounted } from "vue";
import BaseTextInput from "./BaseTextInput.vue";
import BaseDatePicker from "./BaseDatePicker.vue";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiCalendarRange } from "@mdi/js";
import { BaseInputDatePickerEvents } from "@/types/events";

/**
 * @interface Props
 * @description Props for BaseInputDatePicker component.
 */
interface Props {
  label?: string;
  title?: string;
  id?: string;
  value?: string;
  invalidInput?: boolean;
  color?: string;
}

export default defineComponent({
  components: { BaseTextInput, BaseDatePicker, SvgIcon },
  props: ["label", "title", "id", "value", "invalidInput", "color"],
  setup(props: Props, context) {
    const emit = context.emit as BaseInputDatePickerEvents;
    const disabled = ref<boolean>(true);
    const path = ref<string>(mdiCalendarRange);
    const isOpen = ref<boolean>(false);
    const date = ref<string>("");

    const changeVisibility = (): void => {
      isOpen.value = !isOpen.value;
    };

    const closeModal = (): void => {
      isOpen.value = false;
    };

    watch(
      () => props.value,
      (newValue) => {
        if (newValue !== "") {
          date.value = newValue as string;
        }
      },
      { immediate: true }
    );

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

    const updateDate = (selectedDate: string): void => {
      date.value = selectedDate;
    };

    onMounted(() => {
      if (props.value !== "") {
        date.value = props.value as string;
      }
    });

    watch(formatedDate, () => {
      emit("date:value", date.value, props.id);
    });

    const distillationColor = computed<boolean>(
      () => props.color === "distillation"
    );
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
});
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
