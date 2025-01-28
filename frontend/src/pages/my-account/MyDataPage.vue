<template>
  <div>
    <h3>Moje dane</h3>
    <div class="my-data_user-info">
      <p>nazwa użytkownika: </p>
      <p>adres e-mail: </p>
    </div>
    <div>
        <h4>Moje destylatory:</h4>
        <base-button>Dodaj nowy destylator</base-button>
    </div>
    <div>
        <h4>Ustawienia:</h4>
        
    </div>
  </div>
</template>


<script>
import BaseButton from '@/ui/BaseButton.vue';

export default {
    components: { BaseButton },
    setup() {
        return {
        }
    }
}
</script>

<style scoped>
.my-data_user-info {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin-top: 20px;
    margin-bottom: 50px;
}
</style>