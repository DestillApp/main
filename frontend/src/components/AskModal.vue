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
          <base-button class="ask-modal__button--yes" @click="handleYes"
            >Tak</base-button
          >
          <!-- Button to cancel deletion -->
          <base-button class="ask-modal__button--no" @click="closeModal"
            >Nie</base-button
          >
        </div>
      </div>
    </base-card>
  </base-modal>
</template>

<script lang="ts">
import { ref } from "vue";
import { AskModalEvents } from "@/types/events";
import BaseModal from "@/ui/BaseModal.vue";
import BaseButton from "@/ui/BaseButton.vue";

/**
 * @component AskModal
 * @description A confirmation modal for restoring a plant and its weight to the inventory.
 * @props {string} plantName - The name of the plant to be restored.
 * @props {string} plantPart - The part of the plant to be restored.
 * @props {number} distillationWeight - The weight of the plant to be restored.
 * @emits close-modal - Event emitted when the modal is closed without restoration.
 * @emits handle-yes - Event emitted when the user confirms the restoration.
 * @see handleYes
 * @see closeModal
 */

/**
 * Props for AskModal component.
 * @interface
 * @property {string} plantName
 * @property {string} plantPart
 * @property {number} distillationWeight
 */
interface Props {
  plantName: string;
  plantPart: string;
  distillationWeight: number;
}

export default {
  name: "AskModal",
  components: { BaseModal, BaseButton },
  props: ["plantName", "plantPart", "distillationWeight"],
  emits: ["close-modal", "handle-yes"],
  setup(props: Props, context) {
    const emit = context.emit as AskModalEvents;

    // Reactive reference for the lowercase version of plant name.
    const nameOfPlant = ref<string>(props.plantName.toLowerCase());

    /**
     * Emits the handle-yes event to confirm plant restoration.
     * @function handleYes
     */
    const handleYes = () => {
      emit("handle-yes");
    };

    /**
     * Emits the close-modal event to close the modal without restoration.
     * @function closeModal
     */
    const closeModal = () => {
      emit("close-modal");
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
