//no docs
<template>
  <base-modal>
    <base-card>
      <div>Czy chcesz usunąć surowiec z magazynu?</div>
      <base-button @click="deletePlant">Tak</base-button>
      <base-button @click="closeDeleteModal">Nie</base-button>
    </base-card>
  </base-modal>
</template>

<script>
import BaseModal from "@/ui/BaseModal.vue";
import BaseButton from "@/ui/BaseButton.vue";

export default {
  name: "PlantDeleteModal",
  components: { BaseModal, BaseButton },
  emits: ["close-delete-modal", "delete-plant"],
  setup(_, context) {

    const deletePlant = () => {
      context.emit("delete-plant");
    };

    const closeDeleteModal = () => {
      context.emit("close-delete-modal");
    };

    return { deletePlant, closeDeleteModal };
  },
};
</script>