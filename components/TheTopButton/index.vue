<template>
  <transition name="fade">
    <div class="container">
      <div
        v-show="showTopButton"
        class="button is-gold"
        @click="scrollToTop">
        <b-icon icon="format-vertical-align-top"/>
      </div>
    </div>
  </transition>
</template>

<script>
import _ from 'lodash'

export default {
  data() {
    return {
      showTopButton: false
    }
  },

  mounted() {
    if (typeof window !== 'undefined')
      window.addEventListener('scroll', this.handleScroll)
  },

  destroyed() {
    if (typeof window !== 'undefined')
      window.removeEventListener('scroll', this.handleScroll)
  },

  methods: {
    handleScroll: _.debounce(function() {
      this.showTopButton = window.scrollY > window.innerHeight
    }, 150),
    scrollToTop: function() {
      window.scrollTo(0, 0)
    }
  }
}
</script>

<style lang="scss" scoped>
.button {
  position: fixed;
  bottom: 5%;
  right: 5%;
  text-transform: uppercase;
  opacity: 0.5;
  transition: opacity 100ms;
  box-shadow: 0px 5px 100px rgba($color: #000000, $alpha: 0.25);

  &:hover {
    opacity: 1;
  }
}
</style>
