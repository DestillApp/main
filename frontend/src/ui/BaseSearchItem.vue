<template>
  <div class="search_item">
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
      :class="['search_icon', { 
        'search_icon--disabled': !inputValue,
        'search_icon--plant': !inputValue && isPlantInput,
        'search_icon--distillation_disabled': !inputValue && isDistillationInput,
        'search_icon--results': !inputValue && isResultsInput,
        'search_icon--plant': isPlantInput,
        'search_icon--distillation': isDistillationInput,
        'search_icon--results': isResultsInput,
       }]"
      type="mdi"
      :path="mdiMagnify"
      size="24"
      @click="emitSearchQuery"
    ></svg-icon>
    <!-- Clickable red cross icon for clearing the search -->
    <svg-icon
      v-if="isSearchEmitted"
      class="clear_icon"
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
  props: ["label", 'inputColor'],
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
        console.log("ESCAPE PRESSED");
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
      console.log("searchQuery.value", searchQuery.value);
      console.log("INPUT IS MOUNTED");
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
.search_item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.search_icon {
  cursor: pointer;
}

.search_icon--plant {
  color: var(--secondary-color);
}

.search_icon--plant:hover {
  color: var(--primary-color);
}

.search_icon--distillation {
  color: var(--secondary-color-distillation);
}

.search_icon--distillation:hover {
  color: var(--primary-color-distillation);
}

.search_icon--results {
  color: var(--secondary-color-results);
}

.search_icon--results:hover {
  color: var(--primary-color-results);
}

.search_icon--disabled {
  cursor: default;
}

.search_icon--plant_disabled {
  color: var(--secondary-color);
}

.search_icon--plant_disabled:hover {
  color: var(--secondary-color);
}

.search_icon--distillation_disabled {
  color: var(--secondary-color-distillation);
}

.search_icon--distillation_disabled:hover {
  color: var(--secondary-color-distillation);
}

.search_icon--results_disabled {
  color: var(--secondary-color-results);
}

.search_icon--results_disabled:hover {
  color: var(--secondary-color-results);
}

.clear_icon {
  cursor: pointer;
  color: red;
}

.clear_icon:hover {
  color: darkred;
}
</style>
