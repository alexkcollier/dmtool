<template>
  <main class="content">
    <div class="columns is-centered">
      <div class="column is-half">
        <h1 v-if="showHeader">
          Roll Dice
        </h1>

        <CustomRoller />
      </div>
    </div>

    <div class="columns is-centered">
      <div class="column is-half">
        <h2>
          Roll a Character
        </h2>

        <CharacterRoller />
      </div>
    </div>
  </main>
</template>

<script>
import CharacterRoller from '~/components/rollers/CharacterRoller'
import CustomRoller from '~/components/rollers/CustomRoller'

export default {
  components: {
    CharacterRoller,
    CustomRoller
  },

  data() {
    return {
      showHeader: true
    }
  },

  head() {
    return {
      title: 'Dice'
    }
  },

  mounted() {
    const hideOrShowHeader = () => (this.showHeader = window.innerWidth > 1023)
    hideOrShowHeader()
    window.addEventListener('resize', () => hideOrShowHeader())
  }
}
</script>
