<template>
  <div class="list-sorting" ref="sortingContainer">
    <div class="list-sorting__container">
      <!-- Label for sorting -->
      <label class="list-sorting__label">Sortuj według:</label>
      <!-- Container for the input and arrow -->
      <div class="list-sorting__input-container" @click="toggleList">
        <!-- Input field displaying the selected sorting option -->
        <input
          type="text"
          :class="['list-sorting__input', { 'list-sorting__input--dark': isDarkTheme }]"
          :value="selectedOption"
          readonly
        />
        <!-- Arrow icon for toggling the list -->
        <svg-icon
          class="list-sorting__arrow-icon"
          type="mdi"
          :path="isOpen ? mdiChevronUp : mdiChevronDown"
          size="24"
        ></svg-icon>
      </div>
    </div>
    <!-- List of sorting options, displayed conditionally based on isOpen -->
    <ul :class="['list-sorting__options', { 'list-sorting__options--dark': isDarkTheme }]" v-if="isOpen">
      <li
        v-for="option in options"
        :key="option"
        @click="selectOption(option)"
        class="list-sorting__option"
      >
        {{ option }}
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiChevronDown, mdiChevronUp } from "@mdi/js";

export default {
  name: "ListSorting",
  components: { SvgIcon },
  props: ["options", "sorting"],
  emits: ["choose:sorting"],
  setup(props, { emit }) {
    const store = useStore();
    const isDarkTheme = computed(() => store.getters["settings/isDarkTheme"]);

    const isOpen = ref(false);
    const selectedOption = ref(props.sorting);
    const sortingContainer = ref(null);

    const toggleList = () => {
      isOpen.value = !isOpen.value;
      if (isOpen.value) {
        document.addEventListener("click", handleClickOutside);
      } else {
        document.removeEventListener("click", handleClickOutside);
      }
    };

    const selectOption = (option) => {
      selectedOption.value = option;
      isOpen.value = false;
      emit("choose:sorting", option);
    };

    const handleClickOutside = (event) => {
      if (
        sortingContainer.value &&
        !sortingContainer.value.contains(event.target)
      ) {
        isOpen.value = false;
      }
    };

    return {
      mdiChevronDown,
      mdiChevronUp,
      isOpen,
      selectedOption,
      toggleList,
      sortingContainer,
      selectOption,
      isDarkTheme,
    };
  },
};
</script>

<style scoped>
.list-sorting {
  position: relative;
}

.list-sorting__container {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.list-sorting__label {
  font-size: 15px;
  text-align: left;
}

.list-sorting__input-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
}

.list-sorting__input {
  width: 100%;
  font-family: inherit;
  color: var(--text-color);
  padding-block: 2px;
  padding-inline: 10px;
  border: 2px solid var(--border-color);
  border-radius: var(--input-border-radius);
  font-size: 15px;
  cursor: pointer;
}

.list-sorting__input--dark {
  color: var(--text-color-dark);
  border: 2px solid var(--border-color-dark);
}

.list-sorting__arrow-icon {
  position: absolute;
  right: 10px;
}

.list-sorting__options {
  list-style: none;
  padding: 0;
  margin: 0;
  top: 59px;
  border: 2px solid var(--border-color);
  border-radius: var(--input-border-radius);
  background-color: var(--background-bright);;
  position: absolute;
  width: 100%;
  z-index: 10;
}

.list-sorting__options--dark {
  border: 2px solid var(--border-color-dark);
  background-color: var(--background-dark);
}

.list-sorting__option {
  margin-block: 5px;
  cursor: pointer;
}
</style>
