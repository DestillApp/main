<template>
  <div class="tablet-menu">
    <div class="tablet-menu__content">
      <button class="tablet-menu__close" @click="toggleMenu">×</button>
      <h3 class="tablet-menu__title">Moje konto</h3>
      <ul class="tablet-menu__list">
        <li>
          <router-link
            to="/my-account/distillations-in-progress/1"
            class="tablet-menu__link"
            :class="{
              'tablet-menu__link--active': $route.path.includes(
                '/my-account/distillations-in-progress'
              ),
            }"
            @click="toggleMenu"
          >
            Destylacje w toku
          </router-link>
        </li>
        <li>
          <router-link
            to="/my-account/plant-list/1"
            class="tablet-menu__link"
            :class="{
              'tablet-menu__link--active': $route.path.includes(
                '/my-account/plant-list'
              ),
            }"
            @click="toggleMenu"
          >
            Magazyn surowców
          </router-link>
        </li>
        <li>
          <router-link
            to="/my-account/distillation-archives/1"
            class="tablet-menu__link"
            :class="{
              'tablet-menu__link--active': $route.path.includes(
                '/my-account/distillation-archives'
              ),
            }"
            @click="toggleMenu"
          >
            Archiwum destylacji
          </router-link>
        </li>
        <li>
          <router-link
            to="/my-account/my-data"
            class="tablet-menu__link"
            :class="{
              'tablet-menu__link--active': $route.path.includes(
                '/my-account/my-data'
              ),
            }"
            @click="toggleMenu"
          >
            Moje dane
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import {} from "vue";
import { ToggleMenu } from "@/types/events";

/**
 * @component TabletAccountMenu
 * @description This component renders a side menu for tablet view, including navigation links and a logout button.
 */
export default {
  name: "TabletAccountMenu",
  setup(props, context) {
    const emit = context.emit as ToggleMenu;

    const toggleMenu = () => {
      emit("toggle-menu");
    };

    return { toggleMenu };
  },
};
</script>

<style scoped>
.tablet-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.tablet-menu__content {
  position: fixed;
  top: 0;
  left: 0;
  width: 70%;
  max-width: 300px;
  height: 100%;
  background-color: var(--primary-color);
  box-shadow: var(--box-shadow);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.tablet-menu__close {
  align-self: flex-end;
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--header-text-color);
}

.tablet-menu__title {
  font-size: 24px;
  color: var(--header-text-color);
  margin-bottom: 20px;
}

.tablet-menu__list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.tablet-menu__link {
  text-decoration: none;
  font-size: 18px;
  color: var(--header-text-color);
}

.tablet-menu__link--active {
  font-weight: bold;
}
</style>
