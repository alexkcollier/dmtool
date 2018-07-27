<template>
  <div>
    <Navigation/>

    <!-- content -->
    <BaseContainer>
      <nuxt/>
    </BaseContainer>
    
    <TheTopButton/>

  </div>
</template>

<script>
import { mapActions } from 'vuex'
import BaseContainer from '~/components/BaseContainer'
import Navigation from '~/components/Navigation'
import TheTopButton from '~/components/TheTopButton'

export default {
  components: {
    BaseContainer,
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
