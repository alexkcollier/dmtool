import { get } from 'lodash'

const capitalize = str => str[0].toUppercase() + str.slice(1)

export function rollDice({ uuid, dice, options = {}, modifier = 0 }) {
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
}

export function makeModifierText(modifier) {
  if (!modifier) return

  return modifier >= 0 ? `+ ${modifier}` : `- ${String(modifier).substr(1)}`
}
