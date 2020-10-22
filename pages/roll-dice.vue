<template>
  <main class="content">
    <section class="columns is-centered">
      <div class="column is-half">
        <h1>
          Roll Dice
        </h1>

        <BTabs class="is-sans-serif">
          <BTabItem label="Custom Dice">
            <CustomRoller @roll-dice="setResult" />
          </BTabItem>
          <BTabItem label="Saved Dice">
            <SavedRollers @roll-dice="setResult" />
          </BTabItem>
          <BTabItem label="Roll a Character">
            <CharacterRoller />
          </BTabItem>
        </BTabs>
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
    SavedRollers,
  },

  data () {
    return {
      showResult: false,
      result: {},
    }
  },

  head () {
    return {
      title: 'Roll Dice',
    }
  },

  methods: {
    setResult ({ result, rolls, rollDescription, modifier }) {
      this.$set(this.result, 'sum', result)
      this.$set(this.result, 'rolls', rolls)
      this.$set(this.result, 'description', rollDescription)
      this.$set(this.result, 'modifier', modifier)
      this.showResult = true
    },

    closeModal (event) {
      this.showResult = false
    },
  },
}
</script>
