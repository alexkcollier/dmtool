<template>
  <main class="content">
    <div class="columns is-centered">
      <div class="column is-half">
        <h1 v-if="showHeader">
          Roll Dice
        </h1>

        <h2>
          Custom Dice
        </h2>

        <div class="columns">
          <form
            class="column"
            @submit.prevent="rollFormDice"
          >
            <div class="columns is-mobile">
              <b-field
                label="n"
                class="column"
                style="margin-bottom: 0;"
              >
                <b-input
                  v-model.number="numberOfDice"
                  type="number"
                />
              </b-field>
              <b-field
                label="d"
                class="column"
                style="margin-bottom: 0;"
              >
                <b-input
                  v-model.number="dieSize"
                  type="number"
                />
              </b-field>
              <b-field
                label="Modifier"
                class="column"
                style="margin-bottom: 0;"
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
                    :disabled="formIsDisabled"
                  >
                    Roll&nbsp;
                    <span
                      v-show="dieSize"
                      style="font-feature-settings: 'lnum';"
                    >
                      {{ numberOfDice || 1 }}d{{ dieSize }} {{ modifierText }}
                    </span>
                  </button>
                </b-field>
              </div>
            </div>

            <transition name="fade">
              <div
                v-show="result"
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
            </transition>
          </form>
        </div>
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
      numberOfDice: 1,
      dieSize: 20,
      rollModifier: null,
      showHeader: true
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
    },

    modifierText() {
      if (!this.rollModifier) return

      const modText = String(this.rollModifier)

      return this.rollModifier >= 0 ? `+ ${this.rollModifier}` : `- ${modText.substr(1)}`
    }
  },

  mounted() {
    const hideOrShowHeader = () => (this.showHeader = window.innerWidth > 1023)
    hideOrShowHeader()
    window.addEventListener('resize', () => hideOrShowHeader())
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

<style>
/* fixes collisions between buefy components and bulma */
.tabs ul {
  margin: 0;
}

.tabs li + li {
  margin: 0;
}
</style>
