<template>
  <div>
    <Navigation/>

    <!-- content -->
    <nuxt/>
    <TheTopButton/>

  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Navigation from '~/components/Navigation'
import TheTopButton from '~/components/TheTopButton'

export default {
  components: {
    Navigation,
    TheTopButton
  },

  destroyed() {
    this.clearActiveEl()
  },

  methods: {
    ...mapActions('toggle-active-el', {
      clearActiveEl: 'CLEAR_ACTIVE_EL'
    })
  }
}
</script>
