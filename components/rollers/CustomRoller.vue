<template>
  <div class="columns">
    <form
      class="column"
      @submit.prevent="rollFormDice"
    >
      <h2>
        Custom Dice
      </h2>

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

      <!-- Saved rolls -->
      <div class="columns">
        <div
          v-if="sortedRollers.length"
          class="column"
        >
          <h2>Saved Dice</h2>
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

    <!-- Roll result modal -->
    <CustomRollerResult
      :result="result"
      :show-result="result.show"
      @close-result="closeModal"
    />
  </div>
</template>

<script>
import { cloneDeep, get, orderBy } from 'lodash'
import hyperid from 'hyperid'
import DiceRoller from 'dice-roller-dnd'
import { mapState, mapMutations } from 'vuex'
import CustomRollerResult from '~/components/rollers/CustomRollerResult'

const capitalize = str => str[0].toUppercase() + str.slice(1)

export default {
  name: 'CustomRoller',

  components: {
    CustomRollerResult
  },

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
    ...mapState('roll-dice', ['diceConfigs']),

    formIsDisabled() {
      return !this.dieSize
    },

    modifierText() {
      return this.makeModifierText(this.rollModifier)
    },

    sortedRollers() {
      return orderBy(this.diceRollers, ['options.name', 'dice.size', 'dice.number', 'modifier'])
    }
  },

  mounted() {
    // restore dice on page load
    this.loadSavedDice()
  },

  methods: {
    closeModal(event) {
      this.result.show = false
    },

    ...mapMutations('roll-dice', ['addDiceConfig', 'deleteDiceConfig']),

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

      this.setDiceResult({
        ...this.rollDice(formConfig),
        rollDescription: this.makeRollerDescription(formConfig)
      })
    },

    rollSavedDice(config) {
      this.setDiceResult({
        ...this.rollDice(config),
        rollDescription: config.options.name || this.makeRollerDescription(config)
      })
    },

    rollDice({ uuid, dice, options = {}, modifier = 0 }) {
      const dieRoll = dice.roll()

      if (get(options, 'reroll.values.length')) dieRoll.reroll(...options.reroll.values)

      let result = dieRoll.total + modifier
      let rolls = dieRoll.rolls

      if (get(options, 'keep.use')) {
        const { amount, method } = options.keep
        const keepMethod = 'keep' + capitalize(method)
        const kept = dieRoll[keepMethod](amount)

        result = kept.total + modifier
        rolls = kept.rolls
      }

      if (get(options, 'advantage.use')) {
        result = dieRoll[options.advantage.method]() + modifier
        rolls = dieRoll.rolls
      }

      return { result, rolls }
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

    loadSavedDice() {
      // load the dice configs from the store
      // can't store the dice because they mutate their own state
      this.diceConfigs.forEach((config, index) => {
        this.diceRollers.push({
          uuid: config.uuid,
          dice: new DiceRoller({ n: config.n, size: config.size }),
          options: config.options,
          modifier: config.modifier
        })
      })
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

    deleteRoller(uuid) {
      const index = this.diceRollers.findIndex(el => el.uuid === uuid)
      this.diceRollers.splice(index, 1)
      this.deleteDiceConfig({ uuid })
    },

    makeModifierText(modifier) {
      if (!modifier) return

      return modifier >= 0 ? `+ ${modifier}` : `- ${String(modifier).substr(1)}`
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
