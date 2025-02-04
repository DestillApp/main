<template>
  <base-modal @close-modal="closeModal">
    <base-card class="card">
      <div class="modal-content">
        <h3 class="title">Dodaj destylator</h3>
        <form @submit.prevent="addDistiller" class="form">
          <!-- Input for material -->
          <base-text-input
            v-model="material"
            label="Materiał destylatora"
            id="material"
            placeholder="Wprowadź materiał destylatora"
            :invalidInput="isFormValid === false && material === ''"
          >
            <template v-slot:message>
              <span v-if="isFormValid === false && material === ''"
                >Wpisz materiał destylatora</span
              >
              <span v-else>&nbsp;</span>
            </template>
          </base-text-input>
          <!-- Input for capacity -->
          <base-text-input
            v-model="capacity"
            label="Pojemność destylatora (l)"
            @update:modelValue="setInteger"
            @set:keyboard="setKeyboardIntegerNumber"
            id="capacity"
            type="number"
            min="1"
            placeholder="Wprowadź pojemność"
            :invalidInput="isFormValid === false && !capacity"
          >
            <template v-slot:message>
              <span v-if="isFormValid === false && !capacity"
                >Wpisz pojemność destylatora</span
              >
              <span v-else>&nbsp;</span>
            </template>
          </base-text-input>
          <!-- Input for heating -->
          <base-text-input
            v-model="heating"
            label="Ogrzewanie destylatora"
            id="heating"
            placeholder="Wprowadź rodzaj ogrzewania"
            :invalidInput="isFormValid === false && heating === ''"
          >
            <template v-slot:message>
              <span v-if="isFormValid === false && heating === ''"
                >Wpisz rodzaj ogrzewania</span
              >
              <span v-else>&nbsp;</span>
            </template>
          </base-text-input>
          <!-- Submit button -->
          <base-button type="submit" class="button">Dodaj</base-button>
        </form>
      </div>
    </base-card>
  </base-modal>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import BaseModal from "@/ui/BaseModal.vue";
import BaseTextInput from "@/ui/BaseTextInput.vue";
import BaseButton from "@/ui/BaseButton.vue";
import { setKeyboardIntegerNumber } from "@/helpers/formatHelpers.js";
import { distillerFormValidation } from "@/helpers/formsValidation.js";

export default {
  components: {
    BaseModal,
    BaseTextInput,
    BaseButton,
  },
  setup(_, { emit }) {
    const store = useStore(); 

    const material = ref("");
    const capacity = ref(null);
    const heating = ref("");
    const isFormValid = ref(true);

    // Using the format function
    const setInteger = (value) => {
      if (!value) {
        capacity.value = null;
        return;
      } else {
        const integerNumber = parseInt(value);
        capacity.value = integerNumber;
      }
    };

    const addDistiller = async () => {
      const distiller = {
        material: material.value,
        capacity: parseFloat(capacity.value),
        heating: heating.value,
      };

      isFormValid.value = distillerFormValidation(distiller);
      if (isFormValid.value) {
        try {
          await store.dispatch("settings/addDistiller", distiller);
          await store.dispatch("settings/fetchSettings"); 
          closeModal();
        } catch (error) {
          console.error("Failed to add distiller:", error);
        }
      } else {
        console.error("Form is invalid");
      }
    };

    const closeModal = () => {
      emit("close-modal");
    };

    return {
      material,
      capacity,
      heating,
      isFormValid,
      addDistiller,
      closeModal,
      setInteger,
      setKeyboardIntegerNumber,
    };
  },
};
</script>

<style scoped>
.card {
  width: 35%;
}

.title {
  text-align: center;
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
}

.button {
  margin-top: 10px;
}
</style>
