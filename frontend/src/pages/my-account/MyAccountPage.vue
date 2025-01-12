<template>
  <div class="container">
    <nav class="nav">
      <h3 class="nav_title">Moje konto</h3>
      <ul class="nav_list">
        <li>
          <router-link to="/my-account/distillations-in-progress/1" class="link"
            >Destylacje w toku</router-link
          >
        </li>
        <li>
          <router-link to="/my-account/plant-list/1" class="link"
            >Magazyn surowców</router-link
          >
        </li>
        <li>
          <router-link to="/my-account/distillation-archives/1" class="link"
            >Archiwum destylacji</router-link
          >
        </li>
        <li>
          <router-link to="/my-account/my-data" class="link"
            >Moje dane</router-link
          >
        </li>
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
  min-height: 75vh;
  margin-bottom: 50px;
}

.nav_title {
font-size: 20px;
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
  gap: 15px;
}

.link {
  text-decoration: none;
  max-height: 24px;
}
.link:hover,
.router-link-active {
  font-weight: 700;
}

.card {
  margin-top: 50px;
  width: 75%;
  /* min-height: 60%; */
  margin-left: 5vw;
}
</style>
