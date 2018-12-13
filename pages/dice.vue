<template>
  <main class="content">
    <h1>
      Roll Dice
    </h1>

    <div class="columns">
      <div class="column">
        <h2>
          Custom Dice
        </h2>

        <p>
          Enter a die size to get started.
        </p>

        <div class="columns">
          <form
            class="column"
            @submit.prevent="rollFormDice"
          >
            <div class="columns is-mobile">
              <b-field
                label="n"
                class="column has-text-centerd"
              >
                <b-input
                  v-model.number="numberOfDice"
                  type="number"
                />
              </b-field>
              <b-field
                label="d"
                class="column has-text-centerd"
              >
                <b-input
                  v-model.number="dieSize"
                  type="number"
                />
              </b-field>
              <b-field
                label="Modifier"
                class="column has-text-centerd"
              >
                <b-input
                  v-model.number="rollModifier"
                  type="number"
                />
              </b-field>
            </div>

            <div
              class="columns is-mobile"
              style="flex-direction: row-reverse"
            >
              <div class="column">
                <b-field>
                  <button
                    class="button is-primary is-fullwidth"
                    style="margin: 0"
                    :disabled="formIsDisabled"
                  >
                    Roll
                  </button>
                </b-field>
              </div>
            </div>

            <div
              v-if="result"
              class="columns is-mobile"
            >
              <b-field
                label="Result"
                class="column has-text-centerd"
              >
                <output name="result">
                  {{ result }}
                </output>
              </b-field>
              <b-field
                label="Rolls"
                class="column has-text-centerd"
              >
                <output name="rolls">
                  {{ rolls }}
                </output>
              </b-field>
            </div>
          </form>
        </div>
      </div>

      <div class="column">
        <h2>
          Common Rolls
        </h2>

        <div class="columns">
          <AdvantageRoller class="column is-narrow" />
          <AdvantageRoller method="disadvantage" class="column is-narrow" />
          <CharacterRoller class="column" />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import DiceRoller from 'dice-roller-dnd'
import AdvantageRoller from '~/components/rollers/AdvantageRoller'
import CharacterRoller from '~/components/rollers/CharacterRoller'

const dice = new DiceRoller()

export default {
  components: {
    AdvantageRoller,
    CharacterRoller
  },

  data() {
    return {
      result: null,
      rolls: [],
      numberOfDice: null,
      dieSize: null,
      rollModifier: null,
      char: []
    }
  },

  head() {
    return {
      title: 'Dice'
    }
  },

  computed: {
    formIsDisabled() {
      return !this.dieSize
    }
  },

  methods: {
    rollFormDice() {
      const { rolls, total } = dice.roll(this.numberOfDice).d(this.dieSize)
      this.result = total + this.rollModifier
      this.rolls = rolls
    }
  }
}
</script>
