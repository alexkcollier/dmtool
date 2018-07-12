const sizes = {
  T: 'Tiny',
  S: 'Small',
  M: 'Medium',
  L: 'Large',
  H: 'Huge',
  G: 'Gargantuan'
}

const alignmentMap = {
  'any non-good alignment': ['L', 'NX', 'C', 'NY', 'E'],
  'any non-lawful alignment': ['NX', 'C', 'G', 'NY', 'E'],
  'any chaotic alignment': ['C', 'G', 'NY', 'E'],
  'any evil alignment': ['L', 'NX', 'C', 'E'],
  'any alignment': ['A'],
  unaligned: ['U'],
  neutral: ['N'],
  'chaotic evil': ['C', 'E'],
  'chaotic neutral': ['C', 'N'],
  'chaotic good': ['C', 'G'],
  'neutral good': ['N', 'G'],
  'neutral evil': ['N', 'E'],
  'lawful evil': ['L', 'E'],
  'lawful neutral': ['L', 'N'],
  'lawful good': ['L', 'G']
}

const setCleanAlignment = target => {
  const cleanAlignment = Object.keys(alignmentMap)
  const aligns = Object.values(alignmentMap)
  // Find the index of the alignmentMap array matching the creature's alignment array
  const idx = aligns.findIndex(a => a.every(axis => target.includes(axis)))
  return cleanAlignment[idx]
}

const parseSizes = arr => {
  for (const creature of arr) {
    creature.size = sizes[creature.size] || creature.size
  }
}

const parseAlignment = arr => {
  for (const creature of arr) {
    if (creature.alignment[0].special) {
      // Creatures with special alignments. e.g.: Sacred Statue (Mordenkainen's Tome of Foes)
      creature.prettyAlignment = creature.alignment[0].special
    } else if (creature.alignment[0].chance) {
      // Creatures with chance alignments. e.g.: Cloud Giant, Empyrean
      const a1 = setCleanAlignment(creature.alignment[0].alignment)
      const a2 = setCleanAlignment(creature.alignment[1].alignment)
      const c1 = creature.alignment[0].chance
      const c2 = creature.alignment[1].chance
      creature.prettyAlignment = `${a1} (${c1}%) or ${a2} (${c2}%)`
    } else {
      // Standard alignments
      creature.prettyAlignment = setCleanAlignment(creature.alignment)
    }
  }
}

export const state = () => ({
  bestiary: []
})

export const mutations = {
  INIT_BESTIARY: (state, payload) => {
    const bestiary = [...payload]
    parseSizes(bestiary)
    parseAlignment(bestiary)
    state.bestiary = bestiary
  }
}
