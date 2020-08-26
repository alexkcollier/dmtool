<template>
  <Transition name="fade">
    <div
      v-show="showTopButton"
      class="button is-gold"
      @click="scrollToTop"
    >
      <BIcon icon="format-vertical-align-top" />
    </div>
  </Transition>
</template>

<script>
export default {
  data () {
    return {
      showTopButton: false,
    }
  },

  mounted () {
    window.addEventListener('scroll', this.handleScroll)
    this.handleScroll()
  },

  destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
  },

  methods: {
    handleScroll () {
      this.showTopButton = window.scrollY > window.innerHeight
    },

    scrollToTop () {
      window.scrollTo(0, 0)
    },
  },
}
</script>

<style lang="scss" scoped>
$fade-time: 150ms;

.button {
  bottom: 10%;
  box-shadow: 0 5px 100px rgba($color: #000, $alpha: 0.25);
  opacity: 0.5;
  position: fixed;
  right: 5%;
  text-transform: uppercase;
  transition: opacity 100ms;
  z-index: 1000;

  &:hover {
    opacity: 1;
  }

  @media screen and (min-width: 1024px) {
    bottom: 5%;
  }
}

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
