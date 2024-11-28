<template>
  <div class="container">
    <nav class="nav">
      <h3 class="nav_title">Moje konto</h3>
      <ul class="nav_list">
        <li><router-link to="/my-account/distillations-in-progress/1">Destylacje w toku</router-link></li>
        <li><router-link to="/my-account/plant-list/1">Magazyn surowców</router-link></li>
        <li><router-link to="/my-account/distillation-archives/1">Archiwum destylacji</router-link></li>
        <li><router-link to="/my-account/my-data">Moje dane</router-link></li>
      </ul>
    </nav>
    <base-card class="card">
      <router-view></router-view>
    </base-card>
  </div>
</template>

<script>
export default {
  setup() {},
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 25%;
  text-align: left;
  padding-left: 30px;
  padding-top: 50px;
}

.nav_list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.card {
margin-top: 50px;
  width: 75%;
  margin-left: 5vw;
}
</style>