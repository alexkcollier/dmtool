<template>
  <div class="columns is-sans-serif">
    <Transition name="fade">
      <!-- Saved rolls -->
      <div
        v-if="sortedRollers.length"
        class="column"
      >
        <div class="columns">
          <div class="column">
            <button
              class="button is-danger"
              @click="clearDice"
            >
              Delete all saved dice
            </button>
          </div>
        </div>

        <TransitionGroup
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
                  <BIcon
                    icon="delete"
                    style=" margin-left: calc(-0.375em - 1px); margin-top: -1px;"
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
        </TransitionGroup>
      </div>

      <!-- Empty -->
      <div
        v-else
        class="column"
      >
        Add some dice in <em>Custom Dice</em> first!
      </div>
    </Transition>
  </div>
</template>

<script>
import DiceRoller from 'dice-roller-dnd'
import orderBy from 'lodash.orderby'
import { mapMutations, mapState } from 'vuex'
import { rollDice, makeModifierText } from './roller-utils'

export default {
  name: 'SavedRollers',

  computed: {
    ...mapState('roll-dice', ['diceConfigs']),

    // TODO: improve performance (i.e.: break into load saved and add new steps)
    rollers () {
      return this.diceConfigs.map((config, index) => ({
        uuid: config.uuid,
        dice: new DiceRoller({ n: config.n, size: config.size }),
        options: config.options,
        modifier: config.modifier,
      }))
    },

    sortedRollers () {
      return orderBy(this.rollers, ['options.name', 'dice.size', 'dice.number', 'modifier'])
    },
  },

  methods: {
    rollDice,
    makeModifierText,

    ...mapMutations('roll-dice', ['clearDice', 'deleteDiceConfig']),

    deleteRoller (uuid) {
      const index = this.rollers.findIndex(el => el.uuid === uuid)
      this.rollers.splice(index, 1)
      this.deleteDiceConfig({ uuid })
    },

    rollSavedDice (config) {
      this.$emit('roll-dice', {
        ...this.rollDice(config),
        rollDescription: config.options.name,
        modifier: makeModifierText(config.modifier),
      })
    },
  },
}
</script>
