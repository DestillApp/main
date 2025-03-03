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
          'search-item__icon--results': isResultsInput,
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

<script>
import BaseTextInput from "@/ui/BaseTextInput.vue";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiMagnify, mdiClose } from "@mdi/js";
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";

export default {
  name: "BaseSearchItem",
  components: { BaseTextInput, SvgIcon },
  props: ["label", "inputColor"],
  emits: ["search", "clear"],
  setup(props, { emit }) {
    const store = useStore();

    const inputValue = ref("");
    const isSearchEmitted = ref(false);

    // Computed property to get searchQuery from Vuex store
    const searchQuery = computed(() => store.getters.searchQuery);

    const changeSearchQuery = () => {
      if (isSearchEmitted.value) {
        isSearchEmitted.value = false;
      }
      if (inputValue.value === "") {
        clearSearchQuery();
      }
    };

    const emitSearchQuery = () => {
      if (inputValue.value) {
        store.dispatch("updateSearchQuery", inputValue.value);
        emit("search");
        isSearchEmitted.value = true;
      }
    };

    const clearSearchQuery = () => {
      inputValue.value = "";
      store.dispatch("updateSearchQuery", "");
      isSearchEmitted.value = false;
      emit("clear");
    };

    const handleKeyPress = (event) => {
      if (event.key === "Enter" && !isSearchEmitted.value) {
        emitSearchQuery();
      }
      if (event.key === "Escape") {
        clearSearchQuery();
      }
    };

    // Computed property to determine if input is for plant
    const isPlantInput = computed(() => {
      return props.inputColor === "plant";
    });

    // Computed property to determine if input is for distillation
    const isDistillationInput = computed(() => {
      return props.inputColor === "distillation";
    });

    // Computed property to determine if input is for distillation
    const isResultsInput = computed(() => {
      return props.inputColor === "results";
    });

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

::v-deep .input__message {
  display: none;
}
</style>
