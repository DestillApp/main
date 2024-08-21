<template>
  <!--BaseModal component-->
  <base-modal>
    <!--BaseCard component-->
    <base-card class="card">
      <!-- Vuetify date picker component bound to selectedDate -->
      <v-date-picker
        v-model="selectedDate"
        locale="pl"
        :title="title"
        header="Wybrana data"
        width="250"
        class="date-picker"
        color="var(--primary-color)"
        @update:modelValue="sendDate"
      ></v-date-picker>
    </base-card>
  </base-modal>
</template>

<script>
import { ref } from "vue";
import BaseModal from "./BaseModal.vue";

/**
 * @component BaseDatePicker
 * @description A modal component that contains a card with a Vuetify date picker. The selected date is emitted to the parent component.
 * @props {string} title - The title for the date picker.
 * @props {string} value - The initial value for the date picker.
 * @emits {Date} update:value - Emitted when the selected date changes.
 * @see sendDate
 */
export default {
  components: { BaseModal },
  props: ["title", "value"],
  setup(_, context) {
    // Reference to the selected date
    const selectedDate = ref(new Date());

    /**
     * Emit the selected date to the parent component.
     * @function sendDate
     */
    const sendDate = () => {
      context.emit("update:value", selectedDate.value);
    };

    return { selectedDate, sendDate };
  },
};
</script>

<style scoped>
.card {
  width: 270px;
  margin: 0;
  padding: 10px;
  cursor: default;
}

/* calendar */
/* header */
.date-picker :deep(.v-picker-title) {
  font-size: 8px;
  padding-inline: 12px 12px;
  padding-top: 5px;
  padding-bottom: 10px;
  width: 250px;
}

.date-picker :deep(.v-date-picker-header) {
  padding-bottom: 5px;
  padding-left: 12px;
}

.date-picker :deep(.v-date-picker-header__content) {
  font-size: 15px;
  line-height: 20px;
}

/* body */
/* month / year picker */
.date-picker :deep(.v-picker__body) {
  width: 250px;
}

.date-picker :deep(.v-date-picker-month) {
  min-width: 100%;
  padding: 0;
}
.date-picker :deep(.v-date-picker-controls) {
  padding-top: 20px;
  padding-bottom: 10px;
  padding-inline: 0;
}

.date-picker :deep(.v-date-picker-controls > .v-btn:first-child) {
  font-size: 11px;
}

/* button picker */
.date-picker :deep(.v-btn--size-default) {
  height: 24px;
}

.date-picker :deep(.v-btn--icon.v-btn--density-default) {
  width: 25px;
}

.date-picker :deep(.v-btn--density-comfortable) {
  width: 25px;
}

.date-picker :deep(.v-date-picker-month__weekday) {
  font-size: 10px;
}

.date-picker :deep(.v-date-picker-month__day .v-btn) {
  font-size: 10px;
  min-width: 10px;
}
.date-picker :deep(.v-date-picker-month__day) {
  height: 20px;
  width: 20px;
}

.date-picker :deep(.v-date-picker-months),
.date-picker :deep(.v-date-picker-years) {
  height: 200px;
}

.date-picker :deep(.v-btn__content) {
  font-size: 12px;
}
</style>