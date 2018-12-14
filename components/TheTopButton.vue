<template>
  <transition name="fade">
    <div
      v-show="showTopButton"
      class="button is-gold"
      @click="scrollToTop"
    >
      <b-icon icon="format-vertical-align-top" />
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      showTopButton: false
    }
  },

  mounted() {
    if (typeof window !== 'undefined') window.addEventListener('scroll', this.handleScroll)
    this.handleScroll()
  },

  destroyed() {
    if (typeof window !== 'undefined') window.removeEventListener('scroll', this.handleScroll)
  },

  methods: {
    handleScroll() {
      this.showTopButton = window.scrollY > window.innerHeight
    },

    scrollToTop() {
      window.scrollTo(0, 0)
    }
  }
}
</script>

<style lang="scss" scoped>
.button {
  position: fixed;
  bottom: 10%;
  right: 5%;
  text-transform: uppercase;
  opacity: 0.5;
  transition: opacity 100ms;
  box-shadow: 0px 5px 100px rgba($color: #000000, $alpha: 0.25);
  z-index: 1000;

  @media screen and (min-width: 1024px) {
    bottom: 5%;
  }

  &:hover {
    opacity: 1;
  }
}

$fade-time: 150ms;

.fade {
  &-enter-active,
  &-leave-active {
    transition: all $fade-time ease-in-out;
  }
  &-enter,
  &-leave-to {
    opacity: 0;
  }
}
</style>
