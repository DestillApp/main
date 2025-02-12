<template>
  <!-- Modal container to confirm plant deletion-->
  <base-modal>
    <base-card :class="{ 'delete-item-modal__distiller-card': distiller, 'delete-item-modal__card': !distiller }">
      <div class="delete-item-modal__container">
        <!-- Message asking user to confirm item deletion -->
        <div class="delete-item-modal__text" v-if="!distillationDate && !distiller">
          Czy chcesz usunąć {{ nameOfPlant }} {{ plantPart }} z magazynu?
        </div>
        <div class="delete-item-modal__text" v-if="distillationDate && !distiller"> 
          Czy chcesz usunąć destylacje <br> {{ nameOfPlant }} {{ plantPart }} z dnia
          {{ distillationDate }}?
        </div>
        <div class="delete-item-modal__text" v-if="distiller">Czy chcesz usunąć zapisany destylator?</div>
        <div class="delete-item-modal__buttons">
          <!-- Button to confirm deletion -->
          <base-button class="delete-item-modal__button--yes" @click="deleteItem">Tak</base-button>
          <!-- Button to cancel deletion -->
          <base-button class="delete-item-modal__button--no" @click="closeDeleteModal">Nie</base-button>
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
.delete-item-modal__card {
  width: 55%;
}

.delete-item-modal__distiller-card {
  width: 40%;
}

.delete-item-modal__container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.delete-item-modal__text {
  text-align: center;
}

.delete-item-modal__buttons {
  display: flex;
  flex-direction: row;
  gap: 20px;
  justify-content: center;
}

.delete-item-modal__button--yes:hover {
  color: red;
}

.delete-item-modal__button--no:hover {
  color: var(--secondary-color);
}
</style>