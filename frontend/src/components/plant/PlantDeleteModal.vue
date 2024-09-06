//no docs
<template>
  <!-- Modal container to confirm plant deletion-->
  <base-modal>
    <base-card class="card">
      <div class="container">
        <!-- Message asking user to confirm plant deletion -->
        <div class="text">
          Czy chcesz usunąć {{ nameOfPlant }} {{ plantPart }} z magazynu?
        </div>
        <div class="buttons">
          <!-- Button to confirm deletion -->
          <base-button class="button--yes" @click="deletePlant"
            >Tak</base-button
          >
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
 * @component PlantDeleteModal
 * @description A confirmation modal for deleting a plant from the inventory.
 * @property {String} plantName - The name of the plant to be deleted.
 * @property {String} plantPart - The part of the plant to be deleted.
 * @emits close-delete-modal - Event emitted when the modal is closed without deletion.
 * @emits delete-plant - Event emitted when the user confirms the plant deletion.
 */
export default {
  name: "PlantDeleteModal",
  components: { BaseModal, BaseButton },
  props: ["plantName", "plantPart"],
  emits: ["close-delete-modal", "delete-plant"],
  setup(props, context) {
    
    // Reactive reference for the lowercase version of plant name.
    const nameOfPlant = ref(props.plantName.toLowerCase());

    /**
     * @function deletePlant
     * @description Emits the delete-plant event to confirm plant deletion.
     */
    const deletePlant = () => {
      context.emit("delete-plant");
    };

    /**
     * @function closeDeleteModal
     * @description Emits the close-delete-modal event to close the modal without deletion.
     */
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