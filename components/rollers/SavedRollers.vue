<template>
  <!-- Saved rolls -->
  <div class="columns is-sans-serif">
    <div
      v-if="sortedRollers.length"
      class="column"
    >
      <transition-group
        name="fade"
        tag="ul"
        style="margin-left: 0;"
      >
        <li
          v-for="(roller, index) in sortedRollers"
          :key="`roller-${index}`"
          class="columns is-mobile"
        >
          <!-- Dice description -->
          <span class="column">
            {{ roller.options.name }}
          </span>

          <!-- Custom Roll/Delete Buttons -->
          <div class="column is-narrow">
            <div class="buttons">
              <button
                class="button is-text"
                type="submit"
                @click.prevent="deleteRoller(index)"
              >
                <span class="is-sr-only">
                  Delete this roller
                </span>
                <b-icon
                  icon="delete"
                  style="margin-top: -1px; margin-left: calc(-0.375em - 1px);"
                />
              </button>

              <button
                class="button"
                @click.prevent="rollSavedDice(roller)"
              >
                Roll
              </button>
            </div>
          </div>
        </li>
      </transition-group>
    </div>
  </div>
</template>

<script>
import DiceRoller from 'dice-roller-dnd'
import { orderBy } from 'lodash'
import { mapMutations, mapState } from 'vuex'
import { rollDice, makeModifierText } from './roller-utils'

export default {
  name: 'SavedRollers',

  computed: {
    ...mapState('roll-dice', ['diceConfigs']),

    // TODO: improve performance (i.e.: break into load saved and add new steps)
    rollers() {
      return this.diceConfigs.map((config, index) => ({
        uuid: config.uuid,
        dice: new DiceRoller({ n: config.n, size: config.size }),
        options: config.options,
        modifier: config.modifier
      }))
    },

    sortedRollers() {
      return orderBy(this.rollers, ['options.name', 'dice.size', 'dice.number', 'modifier'])
    }
  },

  methods: {
    rollDice,
    makeModifierText,

    ...mapMutations('roll-dice', ['deleteDiceConfig']),

    deleteRoller(uuid) {
      const index = this.rollers.findIndex(el => el.uuid === uuid)
      this.rollers.splice(index, 1)
      this.deleteDiceConfig({ uuid })
    },

    rollSavedDice(config) {
      this.$emit('roll-dice', {
        ...this.rollDice(config),
        rollDescription: config.options.name,
        modifier: makeModifierText(config.modifier)
      })
    }
  }
}
</script>
