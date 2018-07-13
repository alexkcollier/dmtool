<template>
  <div>

    <div class="columns is-mobile" style="margin-bottom:0">
      <div class="column">
        <a @click="toggleActive">
          <h3 class="title">
            {{ name }}
          </h3>

          <h6 class="subtitle is-size-6 is-italic">
            {{ info }}
          </h6>

          <p v-if="source" class="is-italic">
            {{ source }}
          </p>
        </a>
      </div>

      <slot name="col2"/>
    </div>


    <transition name="fade-grow">
      <div v-show="isActive" :style="{'transition-duration': `${transitionDuration}ms`}">
        <slot/>
      </div>
    </transition>
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
      const offset = -27
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
}
</style>
