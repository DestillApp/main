<template>
  <!-- Main page title -->
  <div class="main-page__container">
    <h1 class="main-page__title">Witaj w DestillApp!</h1>
    <p class="main-page__text">
      Zbieraj informacje o swoich roślinach, śledź destylację i zapisuj efekty.
      Ciesz się procesem! 🌿
    </p>
    <img
      src="/hero.svg"
      alt="Woman with Plant Image"
      class="main-page__image"
    />
  </div>
</template>

<style scoped>
.main-page__title {
  margin-top: 30px;
  font-size: 25px;
}

.main-page__text {
  font-size: 16px;
  margin-block: 30px;
  width: 80vw;
  margin-inline: auto;
}

.main-page__image {
  width: 80vw;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .main-page__image {
    width: 40vw;
    margin-right: 50px;
    margin-left: auto;
  }
}

@media (min-width: 768px) {
  .main-page__container {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-template-rows: 50px auto;
    column-gap: 50px;
    margin-top: 50px;
    margin-inline: 5vw;
  }

  .main-page__title {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
    font-size: 30px;
  }

  .main-page__text {
    font-size: 22px;
    grid-column: 1 / 2;
    grid-row: 2 / 3;
    width: 100%;
  }

  .main-page__image {
    grid-column: 2 / 3;
    grid-row: 1 / 3;
    width: 100%;
  }
}
</style>
