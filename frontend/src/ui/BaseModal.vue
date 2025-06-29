<template>
  <!-- Teleport the modal backdrop to the body -->
  <teleport to="body">
    <!-- Modal backdrop -->
    <div class="modal-backdrop" @click.self="closeModal">
      <!-- Modal content transition and slot for modal content -->
      <transition name="modal">
        <slot></slot>
      </transition>
    </div>
  </teleport>
</template>

<script lang="ts">
import {} from "vue";
import { CloseModal } from "@/types/events";

/**
 * @component BaseModal
 * @description A base modal component that provides a backdrop for modal content and emits a close event when the backdrop is clicked.
 * @emits close-modal
 * @see closeModal
 */
export default {
  emits: ["close-modal"],
  setup(_, context) {
    const emit = context.emit as CloseModal;

    /**
     * Emits the close-modal event to notify parent to close the modal.
     * @function closeModal
     * @returns {void}
     */
    const closeModal = (): void => {
      emit("close-modal");
    };

    return { closeModal };
  },
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black background */
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.5s;
}
.modal-enter,
.modal-leave-to {
  opacity: 0;
}
</style>
