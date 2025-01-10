<template>
  <div class="settings-container" ref="settingsContainer">
    <!-- Clickable settings icon -->
    <svg-icon
      class="settings-icon"
      type="mdi"
      :path="mdiCog"
      size="20"
      @click="toggleList"
    ></svg-icon>
    <!-- List with title and items, shown conditionally based on isListVisible -->
    <div
      v-if="isListVisible"
      class="settings-list"
      :class="{
        'list_color-plant': isPlantColor,
        'list_color-distillation': isDistillationColor,
        'list_color-results': isResultsColor,
      }"
    >
      <h3>{{ title }}</h3>
      <ul>
        <li
          v-for="length in lengths"
          :key="length"
          @click="selectLength(length)"
          :class="{ 'selected-length': length === chosenLength }"
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

export default {
  name: "ListLengthSettings",
  components: { SvgIcon },
  props: ['title', 'listColor', 'chosenLength'],
  emits: ["select-length"],
  setup(props, { emit }) {
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
        document.removeEventListener("click", handleClickOutside);
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
    };
  },
};
</script>

<style scoped>
.settings-container {
  position: relative;
  display: inline-block;
}

.settings-icon {
  cursor: pointer;
  color: var(--text-color);
}

.settings-icon:hover {
  color: var(--placeholder-color);
}

.settings-list {
  position: absolute;
  top: 30px;
  left: 0;
  background-color: white;
  border: 1px solid var(--border-color);
  border-radius: var(--input-border-radius);
  box-shadow: var(--box-shadow);
  padding: 10px;
  z-index: 10;
}

.settings-list h3 {
  margin: 0 0 10px 0;
  font-size: 14px;
}

.settings-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.settings-list li {
  cursor: pointer;
  padding: 5px 0;
}

.settings-list li:hover {
  color: var(--placeholder-color);
}

.selected-length {
  font-weight: bold;
}

.list_color-plant li:hover {
  color: var(--primary-color);
}

.list_color-distillation li:hover {
  color: var(--primary-color-distillation);
}

.list_color-results li:hover {
  color: var(--primary-color-results);
}

.list_color-plant {
  border: 2px solid var(--secondary-color);
}

.list_color-distillation {
  border: 2px solid var(--secondary-color-distillation);
}

.list_color-results {
  border: 2px solid var(--secondary-color-results);
}
</style>
