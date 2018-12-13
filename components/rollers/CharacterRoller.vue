<template>
  <div>
    <button
      class="button"
      @click="rollCharacter()"
    >
      Roll Character
    </button>
    <div class="columns">
      <div
        v-for="({ stat, d6Rolls }, index) in characterStats"
        :key="index"
        class="column"
      >
        {{ stat }}
      </div>
    </div>
  </div>
</template>

<script>
import DiceRoller from 'dice-roller-dnd'

const dice = new DiceRoller()

export default {
  name: 'CharacterRoller',

  data() {
    return {
      characterStats: []
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

      this.characterStats = Array.from({ length: 6 }, statMethod[method])
    }
  }
}
</script>
