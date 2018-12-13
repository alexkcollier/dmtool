<template>
  <div>
    <button
      class="button is-capitalized"
      @click="roll"
    >
      Roll {{ method }}
    </button>
    <div class="columns">
      <div
        v-if="Object.keys(rolls).length"
        class="column"
      >
        {{ rolls.result }}
      </div>
    </div>
  </div>
</template>

<script>
import DiceRoller from 'dice-roller-dnd'

const d20 = new DiceRoller({ n: 2, size: 20 })

export default {
  name: 'Advantage',

  props: {
    method: {
      type: String,
      default: 'advantage'
    }
  },

  data() {
    return {
      rolls: {}
    }
  },

  methods: {
    roll() {
      const roll = d20.roll()
      const result = roll[this.method]()
      this.rolls = { result, d20rolls: roll.rolls }
    }
  }
}
</script>
