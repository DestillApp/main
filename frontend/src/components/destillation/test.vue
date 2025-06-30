<template>
  <button @click="debugFn">Kliknij mnie</button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TestDebug",

  setup() {
    /**
     * Funkcja testowa wyświetlająca "działa!" w konsoli
     */
    const debugFn = () => {
      console.log("🎉 Działa!");
    };

    return { debugFn };
  },
});
</script>
