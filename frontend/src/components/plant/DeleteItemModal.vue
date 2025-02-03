//no docs
<template>
  <!-- Modal container to confirm plant deletion-->
  <base-modal>
    <base-card :class="{ 'distiller-card': distiller, 'card': !distiller }">
      <div class="container">
        <!-- Message asking user to confirm item deletion -->
        <div class="text" v-if="!distillationDate && !distiller">
          Czy chcesz usunąć {{ nameOfPlant }} {{ plantPart }} z magazynu?
        </div>
        <div class="text" v-if="distillationDate && !distiller"> 
          Czy chcesz usunąć destylacje <br> {{ nameOfPlant }} {{ plantPart }} z dnia
          {{ distillationDate }}?
        </div>
        <div class="text" v-if="distiller">Czy chcesz usunąć zapisany destylator?</div>
        <div class="buttons">
          <!-- Button to confirm deletion -->
          <base-button class="button--yes" @click="deleteItem">Tak</base-button>
          <!-- Button to cancel deletion -->
          <base-button class="button--no" @click="closeDeleteModal"
            >Nie</base-button
          >
        </div>
      </div>
    </base-card>
  </base-modal>
</template>

<script>
import { ref } from "vue";

import BaseModal from "@/ui/BaseModal.vue";
import BaseButton from "@/ui/BaseButton.vue";

/**
 * @component DeleteModal
 * @description A confirmation modal for deleting a plant from the inventory.
 * @property {String} plantName - The name of the plant to be deleted.
 * @property {String} plantPart - The part of the plant to be deleted.
 * @emits close-delete-modal - Event emitted when the modal is closed without deletion.
 * @emits delete-item - Event emitted when the user confirms the plant deletion.
 */
export default {
  name: "DeleteItemModal",
  components: { BaseModal, BaseButton },
  props: ["plantName", "plantPart", "distillationDate", "distiller"],
  emits: ["close-delete-modal", "delete-item"],
  setup(props, context) {
    // Reactive reference for the lowercase version of plant name.
    const nameOfPlant = ref(props.plantName ? props.plantName.toLowerCase() : "");

    /**
     * @function deleteItem
     * @description Emits the delete-item event to confirm plant deletion.
     */
    const deleteItem = () => {
      context.emit("delete-item");
    };

    /**
     * @function closeDeleteModal
     * @description Emits the close-delete-modal event to close the modal without deletion.
     */
    const closeDeleteModal = () => {
      context.emit("close-delete-modal");
    };

    return { nameOfPlant, deleteItem, closeDeleteModal };
  },
};
</script>

<style scoped>
.card {
  width: 55%;
}

.distiller-card {
  width: 40%;
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