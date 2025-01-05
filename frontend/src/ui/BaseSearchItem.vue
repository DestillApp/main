<template>
  <div class="search_item">
    <!-- Input field for entering the name of the searched item -->
    <base-text-input
      v-model="inputValue"
      type="text"
      :label="label"
      @input="changeSearchQuery"
      @keypress="handleKeyPress"
    >
    </base-text-input>
    <!-- Clickable icon for searching the items -->
    <svg-icon
      v-if="!isSearchEmitted"
      class="search_icon"
      type="mdi"
      :path="mdiMagnify"
      size="24"
      @click="emitSearchQuery"
    ></svg-icon>
    <!-- Clickable red cross icon for clearing the search -->
    <svg-icon
      v-else
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
  props: {
    label: {
      type: String,
      default: "Szukaj",
    },
  },
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
      store.dispatch("updateSearchQuery", inputValue.value);
      emit("search");
      isSearchEmitted.value = true;
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
    };

    onMounted(() => {
        store.dispatch("fetchSearchQueryFromLocalStorage");
      inputValue.value = searchQuery.value;
      console.log('searchQuery.value', searchQuery.value);
      console.log("INPUT IS MOUNTED");
    });

    return {
      searchQuery,
      inputValue,
      changeSearchQuery,
      emitSearchQuery,
      clearSearchQuery,
      handleKeyPress,
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
  color: var(--secondary-color);
}

.search_icon:hover {
  color: var(--primary-color);
}

.clear_icon {
  cursor: pointer;
  color: red;
}

.clear_icon:hover {
  color: darkred;
}
</style>
