<template>
  <div>

    <div class="container" style="margin-bottom: -3rem;">
      <div @click="toggleNavigation" class="button is-text has-text-primary" style="margin-left:-0.5rem;">
        <b-icon icon="menu"/>
      </div>
    </div>

    <!-- navigation -->
    <transition name="slide">
      <div v-show="showNavigation" class="hero is-fullheight is-primary is-bold is-navigation">
        <div class="hero-head">
          <div class="container">
            <div @click="toggleNavigation" class="button is-text has-text-white ">
              <b-icon icon="backburger"/> 
              <span>Close navigation</span>
            </div>
          </div>
        </div>
        <div class="hero-body">
          <div class="container">
            
            <nuxt-link
              v-for="route in routes"
              :key="route.name"
              :to="route.path"
              tag="li"
              class="button is-capitalized">
              {{ route.name }}
            </nuxt-link>

          </div>
        </div>
      </div>
    </transition>

    <!-- content -->
    <nuxt/>
    <TheTopButton/>

  </div>
</template>

<script>
import TheTopButton from '~/components/TheTopButton'

export default {
  components: {
    TheTopButton
  },

  data() {
    return {
      showNavigation: false
    }
  },

  computed: {
    routes: function() {
      let routes = this.$router.options.routes
      routes.forEach(
        route =>
          route.name === 'magic-items'
            ? (route.name = 'magic items')
            : route.name === 'index' ? (route.name = 'home') : route.name
      )
      return routes
    }
  },

  methods: {
    toggleNavigation: function() {
      this.showNavigation = !this.showNavigation
    }
  }
}
</script>

<style lang="scss" scoped>
.is-navigation {
  z-index: 1000000;
  position: fixed;
  top: 0;
  min-width: 30vw;
  width: 30%;
  background-color: red;
  box-shadow: 0 0 75px rgba($color: #000000, $alpha: 0.3);
  @media screen and (max-width: 768px) {
    width: 100vw;
  }
}

$slide-time: 300ms;
.slide {
  &-enter-active,
  &-leave-active {
    transition: transform $slide-time ease-in-out;
  }
  &-enter,
  &-leave-to {
    transform: translateX(-30vw);
    box-shadow: none;
    @media screen and (max-width: 768px) {
      transform: translateX(-100vw);
    }
  }
}

.button.is-text.has-text-white {
  &:hover {
    background: none;
  }
}
</style>
