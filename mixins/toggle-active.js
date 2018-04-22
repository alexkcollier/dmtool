export default {
  data() {
    return {
      collapse: true
    }
  },

  mounted: function() {
    this.$root.$on('toggle', id => {
      // Check if expanded element is the target element. If not, collapse it.
      // Only check if element not collapsed.
      if (!this.collapse) this.collapse = !(this.$el.id === id)
    })
  },

  methods: {
    toggleActive: function() {
      this.collapse = !this.collapse
      this.$root.$emit('toggle', this.$el.id)
    }
  }
}
