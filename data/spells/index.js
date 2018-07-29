import PHB from './spells-phb.json'
import SCAG from './spells-scag.json'
import XGE from './spells-xge.json'

const sources = { PHB, SCAG, XGE }

const schoolMap = {
  A: 'Abjuration',
  C: 'Conjuration',
  D: 'Divination',
  E: 'Enchantment',
  I: 'Illusion',
  N: 'Necromancy',
  T: 'Transmutation',
  V: 'Evocation'
}

const spells = Object.values(sources).reduce(reduceToSpells, [])

function reduceToSpells(a, c) {
  return a.concat(c.spell.map(setSpell))
}

function setSpell(spell) {
  if (spell.level === 0) spell.level = 'Cantrip'
  spell.school = schoolMap[spell.school]
  return spell
}

export default spells
