<template>
  <div class="columns">
    <!-- Custom Roller form -->
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
            :min="options.advantage.use ? 2 : 1"
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
            min="2"
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
            min="0"
          />
        </b-field>
      </div>

      <div class="columns">
        <div class="column">
          <!-- Roll options -->
          <div class="card">
            <a
              class="card-header"
              href="#"
              @click.prevent="toggleOptions"
            >
              <div class="card-header-title">
                <b-icon
                  icon="settings"
                  size="is-small"
                  style="margin-right: 0.25em;"
                />
                Options
              </div>

              <div class="card-header-icon">
                <b-icon
                  :class="{ 'point-up': showOptions }"
                  class="icon-point"
                  icon="chevron-down"
                />
              </div>
            </a>

            <transition name="fade-grow">
              <b-tabs
                v-show="showOptions"
                expanded
              >
                <b-tab-item label="Advantage">
                  <b-field>
                    <b-switch
                      v-model="options.advantage.use"
                      @input="checkAdvantageUse"
                    >
                      Roll with {{ options.advantage.method }}
                    </b-switch>
                  </b-field>

                  <b-field>
                    <b-radio
                      v-model="options.advantage.method"
                      native-value="advantage"
                      :disabled="!options.advantage.use"
                    >
                      Advantage
                    </b-radio>

                    <b-radio
                      v-model="options.advantage.method"
                      native-value="disadvantage"
                      :disabled="!options.advantage.use"
                    >
                      Disadvantage
                    </b-radio>
                  </b-field>
                </b-tab-item>

                <b-tab-item label="Reroll">
                  <b-field>
                    <b-switch v-model="options.reroll.use">
                      Reroll values
                    </b-switch>
                  </b-field>

                  <b-field label="Values to reroll">
                    <b-select
                      v-model="options.reroll.values"
                      expanded
                      :disabled="!options.reroll.use"
                      multiple
                      class="is-sans-serif"
                    >
                      <option
                        v-for="i in dieSize"
                        :key="i"
                        :value="i"
                        class="is-sans-serif"
                      >
                        {{ i }}
                      </option>
                    </b-select>
                  </b-field>
                </b-tab-item>

                <b-tab-item label="Keep">
                  <b-field>
                    <b-switch
                      v-model="options.keep.use"
                      @input="options.advantage.use = false"
                    >
                      Keep {{ options.keep.amount > 1 ? options.keep.amount : '' }} {{ options.keep.method }} roll{{ options.keep.amount !== 1 ? 's' : '' }}
                    </b-switch>
                  </b-field>

                  <b-field>
                    <b-radio
                      v-model="options.keep.method"
                      native-value="highest"
                      :disabled="!options.keep.use"
                    >
                      Highest
                    </b-radio>

                    <b-radio
                      v-model="options.keep.method"
                      native-value="lowest"
                      :disabled="!options.keep.use"
                    >
                      Lowest
                    </b-radio>
                  </b-field>

                  <b-field label="Number of rolls to keep">
                    <b-input
                      v-model.number="options.keep.amount"
                      min="1"
                      type="number"
                      :disabled="!options.keep.use"
                      @input="checkDiceNumber"
                    />
                  </b-field>
                </b-tab-item>
              </b-tabs>
            </transition>
          </div>
        </div>
      </div>

      <!-- Roll/Save buttons -->
      <b-field
        class="columns is-variable is-1 is-mobile"
        :addons="false"
      >
        <div class="column">
          <button
            class="button is-primary is-fullwidth"
            :disabled="formIsDisabled"
          >
            Roll
            <span
              v-show="dieSize"
              style="font-feature-settings: 'lnum';"
            >
              &nbsp;{{ numberOfDice || 1 }}d{{ dieSize }} {{ modifierText }}
            </span>
          </button>
        </div>

        <div class="column is-narrow">
          <button
            class="button"
            :disabled="formIsDisabled"
            @click.prevent="promptForName"
          >
            <span class="is-sr-only">
              Save roll
            </span>
            <b-icon
              icon="content-save"
              style="margin-top: -2px; margin-left: calc(-0.375em - 1px);"
            />
          </button>
        </div>
      </b-field>
    </form>

    <!-- Dice Config Name prompt -->
    <b-modal
      :active.sync="namePrompt.show"
      scroll="keep"
      :width="480"
    >
      <form class="card">
        <section class="card-content">
          <b-field label="Dice name">
            <b-input
              v-model="namePrompt.name"
              name="dice name"
            />
          </b-field>

          <div class="buttons is-right">
            <button
              class="button is-primary"
              @click.prevent="addName"
            >
              Save dice
            </button>
          </div>
        </section>
      </form>
    </b-modal>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import hyperid from 'hyperid'
import DiceRoller from 'dice-roller-dnd'
import { mapMutations } from 'vuex'
import { rollDice, makeModifierText } from './roller-utils'

export default {
  name: 'CustomRoller',

  data() {
    return {
      showOptions: false,
      numberOfDice: 1,
      dieSize: 20,
      rollModifier: 0,
      diceRollers: [],
      result: {
        show: false,
        sum: null,
        rolls: [],
        description: ''
      },
      namePrompt: {
        show: false,
        name: ''
      },
      options: {
        name: '',
        advantage: {
          use: false,
          method: 'advantage'
        },
        keep: {
          use: false,
          method: 'highest',
          amount: 1
        },
        reroll: {
          use: false,
          values: []
        }
      }
    }
  },

  computed: {
    formIsDisabled() {
      return !this.dieSize
    },

    modifierText() {
      return this.makeModifierText(this.rollModifier)
    }
  },

  methods: {
    rollDice,
    makeModifierText,

    ...mapMutations('roll-dice', ['addDiceConfig']),

    toggleOptions() {
      this.showOptions = !this.showOptions
    },

    setDiceResult({ result, rolls, rollDescription }) {
      this.result.sum = result
      this.result.rolls = rolls
      this.result.description = rollDescription
      this.result.show = true
    },

    rollFormDice() {
      const formConfig = {
        dice: new DiceRoller({ n: this.numberOfDice, size: this.dieSize }),
        options: this.options,
        modifier: this.rollModifier
      }

      this.$emit('roll-dice', {
        ...this.rollDice(formConfig),
        rollDescription: this.makeRollerDescription(formConfig),
        modifier: this.makeModifierText(formConfig.modifier)
      })
    },

    checkAdvantageUse() {
      this.options.keep.use = false
      this.checkDiceNumber()
    },

    checkDiceNumber() {
      if (this.options.advantage.use && this.numberOfDice < 2) this.numberOfDice = 2

      if (this.options.keep.use && this.numberOfDice < this.options.keep.amount) {
        this.numberOfDice = this.options.keep.amount
      }
    },

    promptForName() {
      this.namePrompt.name = this.makeRollerDescription({
        dice: { n: this.numberOfDice, size: this.dieSize },
        options: this.options,
        modifier: this.rollModifier
      })

      this.namePrompt.show = true
    },

    addName() {
      this.options.name = this.namePrompt.name
      this.saveDiceRoller()
      this.namePrompt.name = ''
      this.namePrompt.show = false
    },

    saveDiceRoller() {
      const uuid = hyperid()()

      this.diceRollers.push({
        uuid,
        dice: new DiceRoller({ n: this.numberOfDice, size: this.dieSize }),
        options: cloneDeep(this.options),
        modifier: this.rollModifier
      })
      // save the config in the store
      this.addDiceConfig({
        config: {
          uuid,
          n: this.numberOfDice,
          size: this.dieSize,
          options: cloneDeep(this.options),
          modifier: this.rollModifier
        }
      })
    },

    makeRollerDescription(roller) {
      let base = `${roller.dice.n}d${roller.dice.size}`
      let joiner = ', '

      if (roller.modifier) base += ` ${this.makeModifierText(roller.modifier)}`

      if (roller.options.reroll.use && roller.options.reroll.values.length) {
        joiner = '; '
        base += joiner + `reroll ${roller.options.reroll.values.join(', ')}`
      }

      if (roller.options.advantage.use) {
        base += joiner + roller.options.advantage.method
      }

      if (roller.options.keep.use) {
        base += joiner + `keep ${roller.options.keep.method} ${roller.options.keep.amount} rolls`
      }

      return base
    }
  }
}
</script>
