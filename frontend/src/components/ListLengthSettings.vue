<template>
  <div class="list-length-settings" ref="settingsContainer">
    <!-- Clickable settings icon -->
    <svg-icon
      class="list-length-settings__icon"
      :class="{ 'list-length-settings__icon--dark': isDarkTheme }"
      type="mdi"
      :path="mdiCog"
      @click="toggleList"
    ></svg-icon>
    <!-- List with title and items, shown conditionally based on isListVisible -->
    <div
      v-if="isListVisible"
      class="list-length-settings__list"
      :class="{
        'list-length-settings__list--plant': isPlantColor,
        'list-length-settings__list--distillation': isDistillationColor,
        'list-length-settings__list--results': isResultsColor,
        'list-length-settings__list--dark': isDarkTheme,
      }"
    >
      <!-- List title -->
      <h3>{{ title }}</h3>
      <ul>
        <!-- List length options -->
        <li
          v-for="length in lengths"
          :key="length"
          @click="selectLength(length)"
          :class="{
            'list-length-settings__item--selected': length === chosenLength,
          }"
        >
          {{ length }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiCog } from "@mdi/js";
import { ref, computed } from "vue";
import { useStore } from "@/store/useStore";
import type { ListLengthSettingsEvents } from "@/types/events";

/**
 * @component ListLengthSettings
 * @description Dropdown component for selecting the number of items displayed in a list. Allows the user to choose between different list lengths and emits the selected value.
 * @props {string} title - The title displayed above the list.
 * @props {"plant"|"distillation"|"results"} listColor - The color theme for the list.
 * @props {number} chosenLength - The currently selected list length.
 * @emits select-length - Emitted when a new list length is selected.
 * @see toggleList
 * @see selectLength
 * @see handleClickOutside
 */

/**
 * Props for ListLengthSettings component.
 * @interface
 * @property {string} title
 * @property {"plant"|"distillation"|"results"} listColor
 * @property {number} chosenLength
 */
interface Props {
  title: string;
  listColor: "plant" | "distillation" | "results";
  chosenLength: number;
}

export default {
  name: "ListLengthSettings",
  components: { SvgIcon },
  props: ["title", "listColor", "chosenLength"],
  emits: ["select-length"],
  setup(props: Props, { emit }) {
    const emitTyped = emit as ListLengthSettingsEvents;
    // Vuex store instance
    const store = useStore();

    // Computed property for dark theme state
    const isDarkTheme = computed<boolean>(
      () => store.getters["settings/isDarkTheme"]
    );

    // Ref for controlling the visibility of the list dropdown
    const isListVisible = ref<boolean>(false);
    // Ref for the settings container element
    const settingsContainer = ref<HTMLElement | null>(null);

    /**
     * Toggles the visibility of the list dropdown and manages click outside event.
     * @function toggleList
     */
    const toggleList = (): void => {
      isListVisible.value = !isListVisible.value;
      if (isListVisible.value) {
        document.addEventListener("click", handleClickOutside);
      } else {
        document.removeEventListener("click", handleClickOutside);
      }
    };

    /**
     * Emits the selected list length and closes the dropdown.
     * @function selectLength
     * @param {number} length - The selected list length.
     */
    const selectLength = (length: number): void => {
      emitTyped("select-length", length);
      isListVisible.value = false;
    };

    /**
     * Handles clicks outside the dropdown to close it.
     * @function handleClickOutside
     * @param {MouseEvent} event - The click event.
     */
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        settingsContainer.value &&
        !settingsContainer.value.contains(event.target as Node)
      ) {
        isListVisible.value = false;
      }
    };

    // Computed property for plant color theme
    const isPlantColor = computed<boolean>(() => props.listColor === "plant");
    // Computed property for distillation color theme
    const isDistillationColor = computed<boolean>(
      () => props.listColor === "distillation"
    );
    // Computed property for results color theme
    const isResultsColor = computed<boolean>(
      () => props.listColor === "results"
    );

    // Available list length options
    const lengths = [10, 20, 30];

    return {
      mdiCog,
      isListVisible,
      toggleList,
      selectLength,
      isPlantColor,
      isDistillationColor,
      isResultsColor,
      settingsContainer,
      lengths,
      isDarkTheme,
    };
  },
};
</script>

<style scoped>
.list-length-settings {
  position: relative;
  display: inline-block;
}

.list-length-settings__icon {
  cursor: pointer;
  color: var(--text-color);
  width: 20px;
  height: 20px;
}

.list-length-settings__icon--dark {
  color: var(--text-color-dark);
}

.list-length-settings__icon:hover {
  color: var(--placeholder-color);
}

.list-length-settings__list {
  position: absolute;
  top: 30px;
  left: 0;
  background-color: var(--background-bright);
  border: 1px solid var(--border-color);
  border-radius: var(--input-border-radius);
  box-shadow: var(--box-shadow);
  padding: 10px;
  z-index: 10;
}

.list-length-settings__list--dark {
  background-color: var(--background-dark);
  border: 1px solid var(--border-color-dark);
  box-shadow: var(--box-shadow-dark);
}

.list-length-settings__list h3 {
  margin: 0 0 10px 0;
  font-size: 14px;
}

.list-length-settings__list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list-length-settings__list li {
  cursor: pointer;
  padding: 5px 0;
}

.list-length-settings__list li:hover {
  color: var(--placeholder-color);
}

.list-length-settings__item--selected {
  font-weight: bold;
}

.list-length-settings__list--plant li:hover {
  color: var(--primary-color);
}

.list-length-settings__list--distillation li:hover {
  color: var(--primary-color-distillation);
}

.list-length-settings__list--results li:hover {
  color: var(--primary-color-results);
}

.list-length-settings__list--plant {
  border: 2px solid var(--secondary-color);
}

.list-length-settings__list--distillation {
  border: 2px solid var(--secondary-color-distillation);
}

.list-length-settings__list--results {
  border: 2px solid var(--secondary-color-results);
}

@media (max-width: 600px) {
  .list-length-settings__icon {
    width: 16px;
    height: 16px;
  }
}
</style>
