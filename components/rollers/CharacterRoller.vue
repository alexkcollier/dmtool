<template>
  <div class="columns">
    <!-- Character roller form -->
    <form
      class="column"
      @submit.prevent="rollCharacter(`roll${method}`)"
    >
      <b-field>
        <b-radio
          v-model="method"
          native-value="4d6"
        >
          4d6
        </b-radio>
      </b-field>

      <b-field>
        <b-radio
          v-model="method"
          native-value="3d6"
        >
          3d6
        </b-radio>
      </b-field>

      <b-field>
        <button class="button is-primary is-fullwidth">
          Roll&nbsp;
          <span style="font-feature-settings: 'lnum';">
            {{ method }}
          </span>
        </button>
      </b-field>

      <transition
        name="fade"
        mode="out-in"
      >
        <b-field
          v-if="characterStats.length"
          key="results"
          class="columns"
        >
          <div class="column">
            <p class="has-text-centered">
              <strong>Method Used:</strong> {{ methodUsed }}
            </p>

            <div class="columns is-mobile">
              <ul class="column stats has-text-centered">
                <li>
                  <strong>Stats</strong>
                </li>
                <li
                  v-for="({ stat, d6Rolls }, index) in characterStats"
                  :key="index"
                >
                  {{ stat }}
                </li>
              </ul>

              <ul class="column stats has-text-centered">
                <li>
                  <strong>Rolls</strong>
                </li>
                <li
                  v-for="({ stat, d6Rolls }, index) in characterStats"
                  :key="index"
                >
                  {{ d6Rolls }}
                </li>
              </ul>
            </div>
          </div>
        </b-field>

        <b-field
          v-else
          key="placeholder"
        >
          <img
            width="200"
            style="display: block; margin: 0 auto;"
            src="~/assets/d20.svg"
          >
        </b-field>
      </transition>
    </form>
  </div>
</template>

<script>
import DiceRoller from 'dice-roller-dnd'

const dice = new DiceRoller()

export default {
  name: 'CharacterRoller',

  data() {
    return {
      characterStats: [],
      method: '4d6',
      methodUsed: ''
    }
  },

  computed: {
    hasRolls() {
      return !!this.characterStats.length
    }
  },

  watch: {
    hasRolls() {
      setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 50)
    }
  },

  methods: {
    rollCharacter(method = 'roll4d6') {
      const statMethod = {
        roll4d6: () => {
          const diceRoll = dice.roll(4).d6()
          const highest = diceRoll.keepHighest(3)

          return { stat: highest.total, d6Rolls: diceRoll.rolls }
        },
        roll3d6: () => {
          const { rolls, total } = dice.roll(3).d6()

          return { stat: total, d6Rolls: rolls }
        }
      }

      this.methodUsed = method.substr(-3)
      this.characterStats = Array.from({ length: 6 }, statMethod[method])
    }
  }
}
</script>

<style lang="scss" scoped>
.stats {
  list-style: none;
  margin: 0;
}
</style>
