import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {
      id: '',
      transitionDuration: 500
    }
  },

  computed: {
    ...mapState('toggle-active-el', ['activeEl']),
    active: function() {
      return this.id === this.activeEl
    }
  },

  mounted: function() {
    this.setId()
  },

  destroyed: function() {
    this.clearActiveEl()
  },

  methods: {
    ...mapActions('toggle-active-el', {
      setActiveEl: 'SET_ACTIVE_EL',
      clearActiveEl: 'CLEAR_ACTIVE_EL'
    }),
    setId: function() {
      this.id = this.$el.id
    },
    toggleActive: function() {
      this.active
        ? this.clearActiveEl()
        : this.setActiveEl({
            el: this.$el.id,
            delay: this.transitionDuration + 100
          }).then(() =>
            this.$scrollTo(`#${this.activeEl}`, 500, {
              offset: -27,
              easing: 'ease-in-out'
            })
          )
    }
  }
}
