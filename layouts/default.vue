<template>
  <div>
    <TheNavigation />

    <!-- content -->
    <BaseContainer>
      <nuxt />
    </BaseContainer>

    <TheTopButton />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import BaseContainer from '~/components/BaseContainer'
import TheNavigation from '~/components/TheNavigation'
import TheTopButton from '~/components/TheTopButton'

export default {
  components: {
    BaseContainer,
    TheNavigation,
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
