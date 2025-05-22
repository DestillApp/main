<template>
  <base-modal @close-modal="closeModal">
    <base-card class="distiller-form__card">
      <div class="distiller-form__modal-content">
        <h3 class="distiller-form__title">Dodaj destylator</h3>
        <form @submit.prevent="addDistiller" class="distiller-form__form">
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
          <base-button type="submit" class="distiller-form__button"
            >Dodaj</base-button
          >
        </form>
      </div>
    </base-card>
  </base-modal>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useStore } from "@/store/useStore";
import { useRouter } from "vue-router";
import BaseModal from "@/ui/BaseModal.vue";
import BaseTextInput from "@/ui/BaseTextInput.vue";
import BaseButton from "@/ui/BaseButton.vue";
import { CloseModal } from "@/types/events";
import { setKeyboardIntegerNumber } from "@/helpers/formatHelpers";
import { distillerFormValidation } from "@/helpers/formsValidation";

export default defineComponent({
  components: {
    BaseModal,
    BaseTextInput,
    BaseButton,
  },
  setup(_, context) {
    const store = useStore();

    const router = useRouter();

    const emit = context.emit as CloseModal;

    const material = ref<string>("");
    const capacity = ref<number | null>(null);
    const heating = ref<string>("");
    const isFormValid = ref<boolean>(true);

    // Using the format function
    const setInteger = (value: string): void => {
      if (!value) {
        capacity.value = null;
        return;
      } else {
        const integerNumber = parseInt(value);
        capacity.value = integerNumber;
      }
    };

    const addDistiller = async (): Promise<void> => {
      const distiller: { material: string; capacity: number; heating: string } =
        {
          material: material.value,
          capacity: capacity.value ? capacity.value : 0,
          heating: heating.value,
        };

      isFormValid.value = distillerFormValidation(distiller);
      if (isFormValid.value) {
        try {
          const addDistillerResult = await store.dispatch(
            "settings/addDistiller",
            distiller
          );
          if (addDistillerResult === "Unauthorized") {
            await store.dispatch("auth/logout");
            router.push("/login");
            return;
          }

          const fetchSettingsResult = await store.dispatch(
            "settings/fetchSettings"
          );
          if (fetchSettingsResult === "Unauthorized") {
            await store.dispatch("auth/logout");
            router.push("/login");
            return;
          }
          closeModal();
        } catch (error) {
          console.error("Failed to add distiller:", error);
        }
      } else {
        console.error("Form is invalid");
      }
    };

    const closeModal = (): void => {
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
});
</script>

<style scoped>
.distiller-form__card {
  width: 35%;
}

.distiller-form__title {
  text-align: center;
}

.distiller-form__modal-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.distiller-form__form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
}

.distiller-form__button {
  margin-top: 10px;
}

@media (max-width: 1024px) {
  .distiller-form__card {
    width: 50%;
  }
}

@media (max-width: 600px) {
  .distiller-form__card {
    width: 70%;
  }
}
</style>
