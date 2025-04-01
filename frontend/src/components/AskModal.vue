<template>
  <!-- Modal container to confirm plant deletion-->
  <base-modal>
    <base-card class="ask-modal__card">
      <div class="ask-modal__container">
        <!-- Message asking user to confirm item deletion -->
        <div class="ask-modal__text">
          Czy chcesz przywrócić <br />{{ distillationWeight }} kg
          {{ nameOfPlant }} {{ plantPart }} do magazynu?
        </div>
        <div class="ask-modal__buttons">
          <!-- Button to confirm deletion -->
          <base-button class="ask-modal__button--yes" @click="handleYes">Tak</base-button>
          <!-- Button to cancel deletion -->
          <base-button class="ask-modal__button--no" @click="closeModal">Nie</base-button>
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
 * @emits close-modal - Event emitted when the modal is closed without deletion.
 * @emits handle-yes - Event emitted when the user confirms the plant deletion.
 */
export default {
  name: "ASKModal",
  components: { BaseModal, BaseButton },
  props: ["plantName", "plantPart", "distillationWeight"],
  emits: ["close-modal", "handle-yes"],
  setup(props, context) {
    // Reactive reference for the lowercase version of plant name.
    const nameOfPlant = ref(props.plantName.toLowerCase());

    /**
     * @function handleYes
     * @description Emits the handle-yes event to confirm plant deletion.
     */
    const handleYes = () => {
      context.emit("handle-yes");
    };

    /**
     * @function closeModal
     * @description Emits the close-delete-modal event to close the modal without deletion.
     */
    const closeModal = () => {
      context.emit("close-modal");
    };

    return { nameOfPlant, handleYes, closeModal };
  },
};
</script>

<style scoped>
.ask-modal__card {
  width: 55%;
}

.ask-modal__container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.ask-modal__text {
  text-align: center;
}

.ask-modal__buttons {
  display: flex;
  flex-direction: row;
  gap: 20px;
  justify-content: center;
}

.ask-modal__button--yes:hover {
  color: var(--secondary-color);
}

.ask-modal__button--no:hover {
  color: red;
}

@media (max-width: 1024px) {
  .ask-modal__card {
    width: 70%;
  }
}
</style>