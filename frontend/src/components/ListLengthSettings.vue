<template>
  <div class="list-length-settings" ref="settingsContainer">
    <!-- Clickable settings icon -->
    <svg-icon
      class="list-length-settings__icon"
      :class="{ 'list-length-settings__icon--dark': isDarkTheme }"
      type="mdi"
      :path="mdiCog"
      size="20"
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
      <h3>{{ title }}</h3>
      <ul>
        <li
          v-for="length in lengths"
          :key="length"
          @click="selectLength(length)"
          :class="{ 'list-length-settings__item--selected': length === chosenLength }"
        >
          {{ length }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiCog } from "@mdi/js";
import { ref, computed } from "vue";
import { useStore } from "vuex";

export default {
  name: "ListLengthSettings",
  components: { SvgIcon },
  props: ['title', 'listColor', 'chosenLength'],
  emits: ["select-length"],
  setup(props, { emit }) {
    const store = useStore();
    const isDarkTheme = computed(() => store.getters["settings/isDarkTheme"]);

    const isListVisible = ref(false);
    const settingsContainer = ref(null);

    const toggleList = () => {
      isListVisible.value = !isListVisible.value;
      if (isListVisible.value) {
        document.addEventListener("click", handleClickOutside);
      } else {
        document.removeEventListener("click", handleClickOutside);
      }
    };

    const selectLength = (length) => {
      emit('select-length', length);
      isListVisible.value = false;
    };

    const handleClickOutside = (event) => {
      if (settingsContainer.value && !settingsContainer.value.contains(event.target)) {
        isListVisible.value = false;
      }
    };

    const isPlantColor = computed(() => {
      return props.listColor === "plant";
    });

    const isDistillationColor = computed(() => {
      return props.listColor === "distillation";
    });

    const isResultsColor = computed(() => {
      return props.listColor === "results";
    });

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
</style>
