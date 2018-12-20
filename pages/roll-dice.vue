<template>
  <main class="content">
    <section class="columns is-centered">
      <div class="column is-half">
        <h1>
          Roll Dice
        </h1>

        <b-tabs class="is-sans-serif">
          <b-tab-item label="Custom Dice">
            <CustomRoller @roll-dice="setResult" />
          </b-tab-item>
          <b-tab-item label="Saved Dice">
            <SavedRollers @roll-dice="setResult" />
          </b-tab-item>
          <b-tab-item label="Roll a Character">
            <CharacterRoller />
          </b-tab-item>
        </b-tabs>
      </div>
    </section>

    <CustomRollerResult
      :result="result"
      :show-result="showResult"
      @close-result="closeModal"
    />
  </main>
</template>

<script>
import CharacterRoller from '~/components/rollers/CharacterRoller'
import CustomRoller from '~/components/rollers/CustomRoller'
import CustomRollerResult from '~/components/rollers/CustomRollerResult'
import SavedRollers from '~/components/rollers/SavedRollers'

export default {
  components: {
    CharacterRoller,
    CustomRoller,
    CustomRollerResult,
    SavedRollers
  },

  data() {
    return {
      showResult: false,
      result: {}
    }
  },

  head() {
    return {
      title: 'Roll Dice'
    }
  },

  methods: {
    setResult({ result, rolls, rollDescription, modifier }) {
      this.$set(this.result, 'sum', result)
      this.$set(this.result, 'rolls', rolls)
      this.$set(this.result, 'description', rollDescription)
      this.$set(this.result, 'modifier', modifier)
      this.showResult = true
    },

    closeModal(event) {
      this.showResult = false
    }
  }
}
</script>
