<template>
  <div>
    <div
      class="columns is-mobile"
      style="margin-bottom:0"
    >
      <div class="column">
        <a
          href="#"
          @click.prevent="toggleActive"
        >
          <h3 class="title">
            {{ name }}
          </h3>

          <h6 class="subtitle is-size-6 is-italic">
            {{ info }}
          </h6>

          <h6
            v-if="source"
            class="subtitle is-italic"
          >
            {{ source }}
          </h6>
        </a>
      </div>

      <slot name="col2" />
    </div>

    <Transition name="fade-grow">
      <div
        v-if="isActive"
        :style="{'transition-duration': `${transitionDuration}ms`}"
      >
        <slot />
      </div>
    </Transition>
    <hr>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  props: {
    name: {
      required: true,
      type: String
    },

    info: {
      default: '',
      required: false,
      type: String
    },

    source: {
      default: '',
      required: false,
      type: String
    }
  },

  data() {
    return {
      id: '',
      transitionDuration: 500
    }
  },

  computed: {
    ...mapState('toggle-active-el', ['activeEl']),

    isActive() {
      return this.id === this.activeEl
    }
  },

  mounted() {
    this.setId()
  },

  updated() {
    this.setId()
  },

  methods: {
    ...mapActions('toggle-active-el', {
      setActiveEl: 'SET_ACTIVE_EL',
      clearActiveEl: 'CLEAR_ACTIVE_EL'
    }),

    setId() {
      this.id = this.$el.id
    },

    toggleActive() {
      const newEl = {
        el: this.id,
        delay: this.transitionDuration
      }
      const { clearActiveEl, setActiveEl, isActive, scrollToEl } = this
      isActive ? clearActiveEl() : setActiveEl(newEl).then(scrollToEl)
    },

    scrollToEl() {
      const isDesktop = window.innerWidth > 1023
      const navHeight = document.querySelector('.navigation').clientHeight
      const searchHeight = document.querySelector('#search-box').clientHeight
      const offset = -1 * (isDesktop ? navHeight : searchHeight)
      const easing = 'ease-in-out'
      this.$scrollTo(`#${this.activeEl}`, 500, { offset, easing })
    }
  }
}
</script>

<style lang="scss" scoped>
h6 {
  margin-bottom: 0.25em !important;
}

hr {
  margin-top: 1em;
}

.subtitle {
  padding-top: 0.3em;

  &::first-letter {
    text-transform: capitalize;
  }

  .title:not(.is-spaced) + & {
    margin-top: -1.5rem;
  }

  & ~ & {
    margin-top: -0.25em;
  }
}
</style>
