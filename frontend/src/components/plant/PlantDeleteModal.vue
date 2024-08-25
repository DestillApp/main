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
  emits: ["close-delete-modal"],
  props: ["id"],
  setup(props, context) {
    const deletePlant = () => {
      console.log(props.id);
    };

    const closeDeleteModal = () => {
      context.emit("close-delete-modal");
      console.log("closeModal!");
    };

    return { deletePlant, closeDeleteModal };
  },
};
</script>