<template>
  <!-- Modal container to confirm plant or distiller deletion -->
  <base-modal>
    <base-card
      :class="{
        'delete-item-modal__distiller-card': distiller,
        'delete-item-modal__card': !distiller,
      }"
    >
      <div class="delete-item-modal__container">
        <!-- Message for deleting plant from inventory -->
        <div
          class="delete-item-modal__text"
          v-if="!distillationDate && !distiller"
        >
          Czy chcesz usunąć {{ nameOfPlant }} {{ plantPart }} z magazynu?
        </div>
        <!-- Message for deleting distillation record -->
        <div
          class="delete-item-modal__text"
          v-if="distillationDate && !distiller"
        >
          Czy chcesz usunąć destylacje <br />
          {{ nameOfPlant }} {{ plantPart }} z dnia {{ distillationDate }}?
        </div>
        <!-- Message for deleting distiller -->
        <div class="delete-item-modal__text" v-if="distiller">
          Czy chcesz usunąć zapisany destylator?
        </div>
        <div class="delete-item-modal__buttons">
          <!-- Button to confirm deletion -->
          <base-button
            class="delete-item-modal__button--yes"
            @click="deleteItem"
            >Tak</base-button
          >
          <!-- Button to cancel deletion -->
          <base-button
            class="delete-item-modal__button--no"
            @click="closeDeleteModal"
            >Nie</base-button
          >
        </div>
      </div>
    </base-card>
  </base-modal>
</template>

<script lang="ts">
import { ref } from "vue";
import { DeleteItemModalEvents } from "@/types/events";
import BaseModal from "@/ui/BaseModal.vue";
import BaseButton from "@/ui/BaseButton.vue";

/**
 * @component DeleteItemModal
 * @description A confirmation modal for deleting a plant from the inventory, a distillation record, or a distiller.
 * @props {string} [plantName] - The name of the plant to be deleted.
 * @props {string} [plantPart] - The part of the plant to be deleted.
 * @props {string} [distillationDate] - The date of the distillation to be deleted.
 * @props {string} [distiller] - The distiller to be deleted.
 * @emits close-delete-modal - Event emitted when the modal is closed without deletion.
 * @emits delete-item - Event emitted when the user confirms the deletion.
 * @see deleteItem
 * @see closeDeleteModal
 */

/**
 * Props for DeleteItemModal component.
 * @interface
 * @property {string} [plantName]
 * @property {string} [plantPart]
 * @property {string} [distillationDate]
 * @property {string} [distiller]
 */
interface Props {
  plantName?: string;
  plantPart?: string;
  distillationDate?: string;
  distiller?: string;
}

export default {
  name: "DeleteItemModal",
  components: { BaseModal, BaseButton },
  props: ["plantName", "plantPart", "distillationDate", "distiller"],
  emits: ["close-delete-modal", "delete-item"],
  setup(props: Props, context) {
    const emit = context.emit as DeleteItemModalEvents;

    // Reactive reference for the lowercase version of plant name.
    const nameOfPlant = ref<string>(
      props.plantName ? props.plantName.toLowerCase() : ""
    );

    /**
     * Emits the delete-item event to confirm deletion.
     * @function deleteItem
     */
    const deleteItem = (): void => {
      emit("delete-item");
    };

    /**
     * Emits the close-delete-modal event to close the modal without deletion.
     * @function closeDeleteModal
     */
    const closeDeleteModal = (): void => {
      emit("close-delete-modal");
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

@media (max-width: 1024px) {
  .delete-item-modal__card {
    width: 70%;
  }
}
</style>
