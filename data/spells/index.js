import spellData from './spells.json'

export const spells = spellData.filter(spell => !spell.source.includes('UA'))

export default spells
