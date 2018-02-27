<template>
  <div>
    <div class="page-header">
      <div class="section">
        <div class="container">
          <div @click="toggleNavigation" class="is-menu-button" >
            <div class="hamburger" :class="{'is-active': showNavigation}">
              <span/>
              <span/>
              <span/>
            </div>
            <h1 class="title is-size-2" :class="{'has-text-white': showNavigation}">dmtool</h1>
          </div>
        </div>
      </div>

      <!-- navigation -->
      <transition name="slide">
        <div
          v-show="showNavigation"
          id="is-navigation"
          class="hero is-fullheight is-primary is-bold">
        
          <div class="hero-body">
            <div class="container has-text-centered">
                
              <nuxt-link
                to="/magic-items"
                class="button is-text is-medium is-capitalized is-block-mobile has-text-white"
                @click.native="toggleNavigation">
                Magic Items
              </nuxt-link>
              <nuxt-link
                to="/spells"
                class="button is-text is-medium is-capitalized is-block-mobile has-text-white"
                @click.native="toggleNavigation">
                Spells
              </nuxt-link>
              <nuxt-link
                to="/bestiary"
                class="button is-text is-medium is-capitalized is-block-mobile has-text-white"
                @click.native="toggleNavigation">
                Bestiary
              </nuxt-link>
              <nuxt-link
                to="/encounter"
                class="button is-text is-medium is-capitalized is-block-mobile has-text-white"
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

  $desktop-transition-time: 300ms;
  $mobile-transition-time: 200ms;

  .slide {
    &-enter-active,
    &-leave-active {
      transition: transform $desktop-transition-time ease-in-out;
      @media screen and (max-width: 768px) {
        transition-duration: $mobile-transition-time;
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

  .section {
    padding: 1.5rem;
    margin-bottom: -3rem;
  }

  .is-block-mobile {
    @media screen and (max-width: 768px) {
      margin: 1.75rem auto;
    }
  }

  .button.is-text.has-text-white:hover {
    background: none;
  }

  .hero::before {
    height: 90%;
    width: 100%;
    position: absolute;
    top: 5vh;
    background: url('~assets/ampersand.svg') center center / contain no-repeat;
    background-blend-mode: multiply;
    mix-blend-mode: multiply;
    opacity: 0.1;
    content: '';
  }

  .is-menu-button {
    display: inline-block;
    position: relative;
    z-index: 10000000;
    cursor: pointer;
    transition: color $desktop-transition-time ease-in-out;
    @media screen and (max-width: 768px) {
      transition-duration: $mobile-transition-time;
    }
    .title {
      display: inline-block;
      margin-left: 1rem;
    }
    .hamburger {
      cursor: pointer;
      display: inline-block;
      position: relative;
      height: 1rem;
      width: 1rem;
      span {
        background-color: #3d4f5d;
        display: block;
        height: 2px;
        left: calc(50% - 8px);
        position: absolute;
        transform-origin: center;
        transition-duration: $desktop-transition-time;
        @media screen and (max-width: 768px) {
          transition-duration: $mobile-transition-time;
        }
        transition-property: background-color, opacity, transform;
        transition-timing-function: ease-in-out;
        width: 1rem;
        &:nth-child(1) {
          top: calc(50% - 6px);
        }
        &:nth-child(2) {
          top: calc(50% - 1px);
        }
        &:nth-child(3) {
          top: calc(50% + 4px);
        }
      }
      &.is-active {
        span {
          background-color: white;
          &:nth-child(1) {
            transform: translateY(5px) rotate(45deg);
          }
          &:nth-child(2) {
            opacity: 0;
          }
          &:nth-child(3) {
            transform: translateY(-5px) rotate(-45deg);
          }
        }
      }
    }
  }
}
</style>
