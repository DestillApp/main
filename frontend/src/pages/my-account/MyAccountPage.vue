<template>
  <div class="my-account">
    <nav class="my-account__nav">
      <h3 class="my-account__title">Moje konto</h3>
      <ul class="my-account__list">
        <li>
          <router-link
            to="/my-account/distillations-in-progress/1"
            class="my-account__link"
            :class="{
              'my-account__link--active': $route.path.includes(
                '/my-account/distillations-in-progress'
              ),
            }"
            >Destylacje w toku</router-link
          >
        </li>
        <li>
          <router-link
            to="/my-account/plant-list/1"
            class="my-account__link"
            :class="{
              'my-account__link--active': $route.path.includes(
                '/my-account/plant-list'
              ),
            }"
            >Magazyn surowców</router-link
          >
        </li>
        <li>
          <router-link
            to="/my-account/distillation-archives/1"
            class="my-account__link"
            :class="{
              'my-account__link--active': $route.path.includes(
                '/my-account/distillation-archives'
              ),
            }"
            >Archiwum destylacji</router-link
          >
        </li>
        <li>
          <router-link to="/my-account/my-data" class="my-account__link"
            >Moje dane</router-link
          >
        </li>
      </ul>
    </nav>
    <base-card class="my-account__card">
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
.my-account {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  min-height: 75vh;
  margin-bottom: 50px;
}

.my-account__title {
  font-size: 20px;
}

.my-account__nav {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 25%;
  text-align: left;
  padding-left: 30px;
  padding-top: 50px;
}

.my-account__list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.my-account__link {
  text-decoration: none;
  max-height: 24px;
}
.my-account__link:hover,
.my-account__link--active,
.router-link-active {
  font-weight: 700;
}

.my-account__card {
  margin-top: 50px;
  width: 75%;
  margin-left: 5vw;
}
</style>
