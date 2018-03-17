<template>
  <div>
    <div class="page-header">
      <div class="section">
        <div class="container">
          <div class="is-menu-button" @click="toggleNavigation">
            <div :class="{'is-active': showNavigation}" class="hamburger">
              <span/>
              <span/>
              <span/>
            </div>
            <h1 :class="{'has-text-white': showNavigation}" class="title is-size-2">dmtool</h1>
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
                class="is-sans-serif is-capitalized is-block-mobile is-size-4 is-menu-link has-text-white"
                @click.native="toggleNavigation">Magic Items</nuxt-link>
              <nuxt-link
                to="/spells"
                class="is-sans-serif is-capitalized is-block-mobile is-size-4 is-menu-link has-text-white"
                @click.native="toggleNavigation">Spells</nuxt-link>
              <nuxt-link
                to="/bestiary"
                class="is-sans-serif is-capitalized is-block-mobile is-size-4 is-menu-link has-text-white"
                @click.native="toggleNavigation">Bestiary</nuxt-link>
              <nuxt-link
                to="/encounter"
                class="is-sans-serif is-capitalized is-block-mobile is-size-4 is-menu-link has-text-white"
                @click.native="toggleNavigation">Encounter</nuxt-link>
            
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
    z-index: 10;
    position: fixed;
    top: 0;
    width: 100%;
  }

  $transition-time: 300ms;

  .slide {
    &-enter-active,
    &-leave-active {
      transition: all $transition-time ease-in-out;
    }
    &-enter,
    &-leave-to {
      transform: translateY(-100vh);
    }
  }

  .section {
    padding: 1.5rem;
    margin-bottom: -3rem;
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
    z-index: 15;
    cursor: pointer;
    transition: color $transition-time ease-in-out;
    .title {
      transition: color $transition-time ease-in-out;
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
        transition-duration: 150ms;
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

  .is-menu-link {
    margin: 1.75rem;
    text-decoration: underline;
  }
}
</style>
