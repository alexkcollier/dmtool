<template>
  <div>
    <div class="page-header">
      <div class="section">
        <div class="container">
          <div @click="toggleNavigation" class="is-menu-button has-text-primary">
            <b-icon icon="menu"/>
          </div>
          <h1 class="title is-size-2">dmtool</h1>
        </div>
      </div>

      <!-- navigation -->
      <transition name="slide">
        <div
          v-show="showNavigation"
          id="is-navigation"
          class="hero is-fullheight is-primary is-bold">
        
          <div class="hero-head">
            <div class="section">
              <div class="container has-text-white">
                <div @click="toggleNavigation" class="is-menu-button has-text-white">
                  <b-icon icon="close"/> 
                </div>
                <h1 class="title is-size-2">dmtool</h1>
              </div>
            </div>
          </div>

          <div class="hero-body">
            <div class="container">
            
              <nuxt-link
                to="/magic-items"
                class="button is-medium is-capitalized"
                @click.native="toggleNavigation">
                Magic Items
              </nuxt-link>
              <nuxt-link
                to="/spells"
                class="button is-medium is-capitalized"
                @click.native="toggleNavigation">
                Spells
              </nuxt-link>
              <nuxt-link
                to="/bestiary"
                class="button is-medium is-capitalized"
                @click.native="toggleNavigation">
                Bestiary
              </nuxt-link>
              <nuxt-link
                to="/encounter"
                class="button is-medium is-capitalized"
                @click.native="toggleNavigation">
                Encounter
              </nuxt-link>

            </div>
          </div>

        </div>
      </transition>
    </div>

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

  methods: {
    toggleNavigation: function() {
      this.showNavigation = !this.showNavigation
      // Set document overflow
      document.documentElement.style.overflowY = this.showNavigation
        ? 'hidden'
        : 'scroll'
      // Set navigation and body overflow; prevents things jumping around on page when overflow changes
      document.getElementById(
        'is-navigation'
      ).style.overflowY = document.body.style.overflowY = this.showNavigation
        ? 'scroll'
        : 'auto'
    }
  }
}
</script>

<style lang="scss" scoped>
.page-header {
  #is-navigation {
    z-index: 1000000;
    position: fixed;
    top: 0;
    width: 100%;
    box-shadow: 0 0 75px rgba($color: #000000, $alpha: 0.3);
  }

  .slide {
    &-enter-active,
    &-leave-active {
      transition: transform 300ms ease-in-out;
      @media screen and (max-width: 768px) {
        transition: transform 200ms ease-in-out;
      }
    }
    &-enter,
    &-leave-to {
      transform: translateY(-100%);
      box-shadow: none;
      @media screen and (max-width: 768px) {
        transform: translateX(-100%);
      }
    }
  }

  .is-menu-button {
    cursor: pointer;
  }

  .title,
  .is-menu-button {
    display: inline-block;
  }

  h1.title {
    margin-left: 1rem;
  }

  .section {
    padding: 1.5rem;
    margin-bottom: -3rem;
  }
}
</style>
