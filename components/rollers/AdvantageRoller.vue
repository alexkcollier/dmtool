<template>
  <form @submit.prevent="roll(method)">
    <b-field>
      <b-radio
        v-model="method"
        native-value="advantage"
      >
        Advantage
      </b-radio>
    </b-field>

    <b-field>
      <b-radio
        v-model="method"
        native-value="disadvantage"
      >
        Disadvantage
      </b-radio>
    </b-field>

    <b-field
      label="Modifier"
      class="is-capitalized"
    >
      <b-input
        v-model.number="modifier"
        type="number"
      />
    </b-field>

    <b-field>
      <button class="button is-primary is-fullwidth is-capitalized">
        Roll {{ method }}
      </button>
    </b-field>

    <transition name="fade">
      <b-field
        v-if="hasRolls"
        class="columns"
      >
        <div class="column">
          <p class="has-text-centered is-capitalized">
            <strong>Method Used:</strong> {{ methodUsed }}
          </p>

          <output class="columns is-mobile">
            <div class="column">
              <strong>Result:</strong> {{ rolls.result }}
            </div>

            <div class="column">
              <strong>Rolls:</strong> {{ rolls.d20Rolls }}
            </div>
          </output>
        </div>
      </b-field>
    </transition>
  </form>
</template>

<script>
import DiceRoller from 'dice-roller-dnd'

const d20 = new DiceRoller({ n: 2, size: 20 })

export default {
  name: 'AdvantageRoller',

  data() {
    return {
      rolls: {},
      modifier: null,
      method: 'advantage',
      methodUsed: ''
    }
  },

  computed: {
    hasRolls() {
      return !!Object.keys(this.rolls).length
    }
  },

  watch: {
    hasRolls() {
      setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 50)
    }
  },

  methods: {
    roll(method = 'advantage') {
      const roll = d20.roll()
      const result = roll[method]() + this.modifier
      this.rolls = { result, d20Rolls: roll.rolls }
      this.methodUsed = method
    }
  }
}
</script>
