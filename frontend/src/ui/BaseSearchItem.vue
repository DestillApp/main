<template>
  <div class="search-item">
    <!-- Input field for entering the name of the searched item -->
    <base-text-input
      v-model="inputValue"
      type="text"
      :label="label"
      @input="changeSearchQuery"
      @keydown="handleKeyPress"
    >
    </base-text-input>
    <!-- Clickable icon for searching the items -->
    <svg-icon
      v-if="!isSearchEmitted"
      :class="[
        'search-item__icon',
        {
          'search-item__icon--disabled': !inputValue,
          'search-item__icon--plant-disabled': !inputValue && isPlantInput,
          'search-item__icon--distillation-disabled':
            !inputValue && isDistillationInput,
          'search-item__icon--results-disabled': !inputValue && isResultsInput,
          'search-item__icon--results': !inputValue && isResultsInput,
          'search-item__icon--plant': isPlantInput,
          'search-item__icon--distillation': isDistillationInput,
        },
      ]"
      type="mdi"
      :path="mdiMagnify"
      size="24"
      @click="emitSearchQuery"
    ></svg-icon>
    <!-- Clickable red cross icon for clearing the search -->
    <svg-icon
      v-if="isSearchEmitted"
      class="search-item__icon search-item__clear-icon"
      type="mdi"
      :path="mdiClose"
      size="24"
      @click="clearSearchQuery"
    ></svg-icon>
  </div>
</template>

<script lang="ts">
import BaseTextInput from "@/ui/BaseTextInput.vue";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiMagnify, mdiClose } from "@mdi/js";
import { ref, computed, onMounted } from "vue";
import { useStore } from "@/store/useStore";
import { BaseSearchEvents } from "@/types/events";

/**
 * @component BaseSearchItem
 * @description A search input component with search and clear icons, supporting color context and keyboard shortcuts.
 * @props {string} label - The label for the search input.
 * @props {string} inputColor - The color context for the input (e.g., "plant", "distillation", "results").
 * @emits search - Emitted when a search is performed.
 * @emits clear - Emitted when the search is cleared.
 * @see changeSearchQuery
 * @see emitSearchQuery
 * @see clearSearchQuery
 * @see handleKeyPress
 */

/**
 * Props for BaseSearchItem component.
 * @interface
 * @property {string} label - The label for the search input.
 * @property {string} inputColor - The color context for the input (e.g., "plant", "distillation", "results").
 */
interface Props {
  label?: string;
  inputColor?: string;
}

export default {
  name: "BaseSearchItem",
  components: { BaseTextInput, SvgIcon },
  props: ["label", "inputColor"],
  emits: ["search", "clear"],
  setup(props: Props, context) {
    const emit = context.emit as BaseSearchEvents;
    const store = useStore();

    // Ref for the current input value
    const inputValue = ref<string>("");
    // Ref to track if search has been emitted
    const isSearchEmitted = ref<boolean>(false);

    // Computed property to get searchQuery from Vuex store
    const searchQuery = computed<string>(() => store.getters.searchQuery);

    /**
     * Handles input changes and resets search state if needed.
     * @function changeSearchQuery
     * @returns {void}
     */
    const changeSearchQuery = (): void => {
      if (isSearchEmitted.value) {
        isSearchEmitted.value = false;
      }
      if (inputValue.value === "") {
        clearSearchQuery();
      }
    };

    /**
     * Emits the search event and updates the store with the current input value.
     * @function emitSearchQuery
     * @returns {void}
     */
    const emitSearchQuery = (): void => {
      if (inputValue.value) {
        store.dispatch("updateSearchQuery", inputValue.value);
        emit("search");
        isSearchEmitted.value = true;
      }
    };

    /**
     * Clears the search input and emits the clear event.
     * @function clearSearchQuery
     * @returns {void}
     */
    const clearSearchQuery = (): void => {
      inputValue.value = "";
      store.dispatch("updateSearchQuery", "");
      isSearchEmitted.value = false;
      emit("clear");
    };

    /**
     * Handles keyboard events for Enter (search) and Escape (clear).
     * @function handleKeyPress
     * @param {KeyboardEvent} event - The keyboard event.
     * @returns {void}
     */
    const handleKeyPress = (event: KeyboardEvent): void => {
      if (event.key === "Enter" && !isSearchEmitted.value) {
        emitSearchQuery();
      }
      if (event.key === "Escape") {
        clearSearchQuery();
      }
    };

    // Computed property to determine if input is for plant
    const isPlantInput = computed<boolean>(() => props.inputColor === "plant");
    // Computed property to determine if input is for distillation
    const isDistillationInput = computed<boolean>(
      () => props.inputColor === "distillation"
    );
    // Computed property to determine if input is for results
    const isResultsInput = computed<boolean>(
      () => props.inputColor === "results"
    );

    // Fetch search query from local storage and initialize input value on mount
    onMounted(() => {
      store.dispatch("fetchSearchQueryFromLocalStorage");
      inputValue.value = searchQuery.value;
      if (searchQuery.value) {
        isSearchEmitted.value = true;
      }
    });

    return {
      searchQuery,
      inputValue,
      changeSearchQuery,
      emitSearchQuery,
      clearSearchQuery,
      handleKeyPress,
      isPlantInput,
      isDistillationInput,
      isResultsInput,
      isSearchEmitted,
      mdiMagnify,
      mdiClose,
    };
  },
};
</script>

<style scoped>
.search-item {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 10px;
}

.search-item__icon {
  cursor: pointer;
  margin-bottom: 4px;
}

.search-item__icon--plant {
  color: var(--secondary-color);
}

.search-item__icon--plant:hover {
  color: var(--primary-color);
}

.search-item__icon--distillation {
  color: var(--secondary-color-distillation);
}

.search-item__icon--distillation:hover {
  color: var(--primary-color-distillation);
}

.search-item__icon--results {
  color: var(--secondary-color-results);
}

.search-item__icon--results:hover {
  color: var(--primary-color-results);
}

.search-item__icon--disabled {
  cursor: default;
}

.search-item__icon--plant-disabled {
  color: var(--secondary-color);
}

.search-item__icon--plant-disabled:hover {
  color: var(--secondary-color);
}

.search-item__icon--distillation-disabled {
  color: var(--secondary-color-distillation);
}

.search-item__icon--distillation-disabled:hover {
  color: var(--secondary-color-distillation);
}

.search-item__icon--results-disabled {
  color: var(--secondary-color-results);
}

.search-item__icon--results-disabled:hover {
  color: var(--secondary-color-results);
}

.search-item__clear-icon {
  color: var(--error-color);
}

.search-item__clear-icon:hover {
  color: darkred;
}

:deep(.input__message) {
  display: none;
}
</style>
