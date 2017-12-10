<template>
  <div>
    <nuxt/>
  </div>
</template>

<style lang="scss">
$fade-time: 500ms;

.fade-grow {
  &-enter-active, &-leave-active {
    transition: all $fade-time ease-in-out;
    max-height: 300vh;
    overflow: hidden;
  }
  &-enter, &-leave-to {
    max-height: 0;
    opacity: 0;
  }
}
</style>
