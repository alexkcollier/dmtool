<template>
  <div class="columns">
    <!-- Custom Roller form -->
    <form
      class="column"
      @submit.prevent="rollFormDice"
    >
      <div class="columns is-mobile">
        <BField
          label="n"
          class="column"
          style="margin-bottom: 0;"
        >
          <BInput
            v-model.number="numberOfDice"
            :min="options.advantage.use ? 2 : 1"
            type="number"
          />
        </BField>

        <BField
          label="d"
          class="column"
          style="margin-bottom: 0;"
        >
          <BInput
            v-model.number="dieSize"
            min="2"
            type="number"
          />
        </BField>

        <BField
          label="Modifier"
          class="column"
          style="margin-bottom: 0;"
        >
          <BInput
            v-model.number="rollModifier"
            type="number"
            min="0"
          />
        </BField>
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
                <BIcon
                  icon="settings"
                  size="is-small"
                  style="margin-right: 0.25em;"
                />
                Options
              </div>

              <div class="card-header-icon">
                <BIcon
                  :class="{ 'point-up': showOptions }"
                  class="icon-point"
                  icon="chevron-down"
                />
              </div>
            </a>

            <Transition name="fade-grow">
              <BTabs
                v-show="showOptions"
                expanded
              >
                <BTabItem label="Advantage">
                  <BField>
                    <BSwitch
                      v-model="options.advantage.use"
                      @input="checkAdvantageUse"
                    >
                      Roll with {{ options.advantage.method }}
                    </BSwitch>
                  </BField>

                  <BField>
                    <BRadio
                      v-model="options.advantage.method"
                      native-value="advantage"
                      :disabled="!options.advantage.use"
                    >
                      Advantage
                    </BRadio>

                    <BRadio
                      v-model="options.advantage.method"
                      native-value="disadvantage"
                      :disabled="!options.advantage.use"
                    >
                      Disadvantage
                    </BRadio>
                  </BField>
                </BTabItem>

                <BTabItem label="Reroll">
                  <BField>
                    <BSwitch v-model="options.reroll.use">
                      Reroll values
                    </BSwitch>
                  </BField>

                  <BField label="Values to reroll">
                    <BSelect
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
                    </BSelect>
                  </BField>
                </BTabItem>

                <BTabItem label="Keep">
                  <BField>
                    <BSwitch
                      v-model="options.keep.use"
                      @input="options.advantage.use = false"
                    >
                      Keep {{ options.keep.amount > 1 ? options.keep.amount : '' }}
                      {{ options.keep.method }} roll{{ options.keep.amount !== 1 ? 's' : '' }}
                    </BSwitch>
                  </BField>

                  <BField>
                    <BRadio
                      v-model="options.keep.method"
                      native-value="highest"
                      :disabled="!options.keep.use"
                    >
                      Highest
                    </BRadio>

                    <BRadio
                      v-model="options.keep.method"
                      native-value="lowest"
                      :disabled="!options.keep.use"
                    >
                      Lowest
                    </BRadio>
                  </BField>

                  <BField label="Number of rolls to keep">
                    <BInput
                      v-model.number="options.keep.amount"
                      min="1"
                      type="number"
                      :disabled="!options.keep.use"
                      @input="checkDiceNumber"
                    />
                  </BField>
                </BTabItem>
              </BTabs>
            </Transition>
          </div>
        </div>
      </div>

      <!-- Roll/Save buttons -->
      <BField
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
            <BIcon
              icon="content-save"
              style=" margin-left: calc(-0.375em - 1px); margin-top: -2px;"
            />
          </button>
        </div>
      </BField>
    </form>

    <!-- Dice Config Name prompt -->
    <BModal
      :active.sync="namePrompt.show"
      scroll="keep"
      :width="480"
    >
      <form class="card">
        <section class="card-content">
          <BField label="Dice name">
            <BInput
              v-model="namePrompt.name"
              name="dice name"
            />
          </BField>

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
    </BModal>
  </div>
</template>

<script>
import cloneDeep from 'lodash.clonedeep'
import hyperid from 'hyperid'
import DiceRoller from 'dice-roller-dnd'
import { mapMutations } from 'vuex'
import { rollDice, makeModifierText } from './roller-utils'

export default {
  name: 'CustomRoller',

  data () {
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
        description: '',
      },
      namePrompt: {
        show: false,
        name: '',
      },
      options: {
        name: '',
        advantage: {
          use: false,
          method: 'advantage',
        },
        keep: {
          use: false,
          method: 'highest',
          amount: 1,
        },
        reroll: {
          use: false,
          values: [],
        },
      },
    }
  },

  computed: {
    formIsDisabled () {
      return !this.dieSize
    },

    modifierText () {
      return this.makeModifierText(this.rollModifier)
    },
  },

  methods: {
    rollDice,
    makeModifierText,

    ...mapMutations('roll-dice', ['addDiceConfig']),

    toggleOptions () {
      this.showOptions = !this.showOptions
    },

    setDiceResult ({ result, rolls, rollDescription }) {
      this.result.sum = result
      this.result.rolls = rolls
      this.result.description = rollDescription
      this.result.show = true
    },

    rollFormDice () {
      const formConfig = {
        dice: new DiceRoller({ n: this.numberOfDice, size: this.dieSize }),
        options: this.options,
        modifier: this.rollModifier,
      }

      this.$emit('roll-dice', {
        ...this.rollDice(formConfig),
        rollDescription: this.makeRollerDescription(formConfig),
        modifier: this.makeModifierText(formConfig.modifier),
      })
    },

    checkAdvantageUse () {
      this.options.keep.use = false
      this.checkDiceNumber()
    },

    checkDiceNumber () {
      if (this.options.advantage.use && this.numberOfDice < 2) this.numberOfDice = 2

      if (this.options.keep.use && this.numberOfDice < this.options.keep.amount) {
        this.numberOfDice = this.options.keep.amount
      }
    },

    promptForName () {
      this.namePrompt.name = this.makeRollerDescription({
        dice: { n: this.numberOfDice, size: this.dieSize },
        options: this.options,
        modifier: this.rollModifier,
      })

      this.namePrompt.show = true
    },

    addName () {
      this.options.name = this.namePrompt.name
      this.saveDiceRoller()
      this.namePrompt.name = ''
      this.namePrompt.show = false
    },

    saveDiceRoller () {
      const uuid = hyperid()()

      this.diceRollers.push({
        uuid,
        dice: new DiceRoller({ n: this.numberOfDice, size: this.dieSize }),
        options: cloneDeep(this.options),
        modifier: this.rollModifier,
      })
      // save the config in the store
      this.addDiceConfig({
        config: {
          uuid,
          n: this.numberOfDice,
          size: this.dieSize,
          options: cloneDeep(this.options),
          modifier: this.rollModifier,
        },
      })
    },

    makeRollerDescription (roller) {
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
    },
  },
}
</script>
