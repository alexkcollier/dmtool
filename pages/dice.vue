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
          Common Rolls
        </h2>

        <b-tabs>
          <b-tab-item label="d20 Advantage">
            <AdvantageRoller />
          </b-tab-item>

          <b-tab-item label="Character">
            <CharacterRoller />
          </b-tab-item>
        </b-tabs>
      </div>
    </div>
  </main>
</template>

<script>
import AdvantageRoller from '~/components/rollers/AdvantageRoller'
import CharacterRoller from '~/components/rollers/CharacterRoller'
import CustomRoller from '~/components/rollers/CustomRoller'

export default {
  components: {
    AdvantageRoller,
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
