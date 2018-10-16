import PHB from './spells-phb.json'
import SCAG from './spells-scag.json'
import XGE from './spells-xge.json'
import custom from './custom'

const spellSources = {
  PHB,
  SCAG,
  XGE,
  custom
}

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

const spells = Object.values(spellSources).reduce(spellReducer, [])

function spellReducer(accumulatedSpells, { spell }) {
  return accumulatedSpells.concat(spell.map(parseSpellMeta))
}

function parseSpellMeta(spellData) {
  const { school } = spellData
  if (spellData.level === 0) spellData.level = 'Cantrip'
  if (schoolMap.hasOwnProperty(school)) spellData.school = schoolMap[school]
  return spellData
}

export default spells
