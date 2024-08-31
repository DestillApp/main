//no docs
<template>
  <base-modal>
    <base-card class="card">
      <div class="container">
        <div class="text">Czy chcesz usunąć {{ nameOfPlant }} {{ plantPart }} z magazynu?</div>
        <div class="buttons">
          <base-button class="button--yes" @click="deletePlant">Tak</base-button>
          <base-button class="button--no" @click="closeDeleteModal">Nie</base-button>
        </div>
      </div>
    </base-card>
  </base-modal>
</template>

<script>
import { ref } from "vue";

import BaseModal from "@/ui/BaseModal.vue";
import BaseButton from "@/ui/BaseButton.vue";

export default {
  name: "PlantDeleteModal",
  components: { BaseModal, BaseButton },
  props: ["plantName", "plantPart"],
  emits: ["close-delete-modal", "delete-plant"],
  setup(props, context) {

    const nameOfPlant = ref(props.plantName.toLowerCase());

    const deletePlant = () => {
      context.emit("delete-plant");
    };

    const closeDeleteModal = () => {
      context.emit("close-delete-modal");
    };

    return { nameOfPlant, deletePlant, closeDeleteModal };
  },
};
</script>

<style scoped>

.card {
  width: 55%;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.text {
  text-align: center;
}

.buttons {
  display: flex;
  flex-direction: row;
  gap: 20px;
  justify-content: center;
}

.button--yes:hover {
  color: red;
}

.button--no:hover {
color: var(--secondary-color);
}
</style>