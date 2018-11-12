import CoS from './bestiary-cos.json'
import DMG from './bestiary-dmg.json'
import GGR from './bestiary-ggr.json'
import HotDQ from './bestiary-hotdq.json'
import KKW from './bestiary-kkw.json'
import LMoP from './bestiary-lmop.json'
import Mag from './bestiary-mag.json'
import MM from './bestiary-mm.json'
import MTF from './bestiary-mtf.json'
import OotA from './bestiary-oota.json'
import PHB from './bestiary-phb.json'
import PotA from './bestiary-pota.json'
import PSA from './bestiary-ps-a.json'
import PSD from './bestiary-ps-d.json'
import PSI from './bestiary-ps-i.json'
import PSK from './bestiary-ps-k.json'
import PSX from './bestiary-ps-x.json'
import PSZ from './bestiary-ps-z.json'
import RoT from './bestiary-rot.json'
import SKT from './bestiary-skt.json'
import TftYP from './bestiary-tftyp.json'
import ToA from './bestiary-toa.json'
import TTP from './bestiary-ttp.json'
import UAWGE from './bestiary-uawge.json'
import VGM from './bestiary-vgm.json'
import WDH from './bestiary-wdh.json'
import WDMM from './bestiary-wdmm.json'
import XGE from './bestiary-xge.json'
import custom from './custom'

const sources = {
  custom,
  CoS,
  DMG,
  GGR,
  HotDQ,
  KKW,
  LMoP,
  Mag,
  MM,
  MTF,
  OotA,
  PSA,
  PSD,
  PSI,
  PSK,
  PSX,
  PSZ,
  PHB,
  PotA,
  RoT,
  SKT,
  TTP,
  TftYP,
  ToA,
  UAWGE,
  VGM,
  WDH,
  WDMM,
  XGE
}

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

// removes creatures with '_copy' and concat
const reduceToMonsters = (mstrs, src) => mstrs.concat(src.monster.filter(m => !m['_copy']))
let monsters = Object.values(sources).reduce(reduceToMonsters, [])

function parseSizes() {
  for (const creature of monsters) {
    creature.size = sizes[creature.size] || creature.size
  }
}

function parseAlignment() {
  for (const creature of monsters) {
    if (creature.prettyAlignment) return

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

function setCleanAlignment(target) {
  const alignments = Object.values(alignmentMap)
  const matchesTarget = alignment => alignment.every(a => target.includes(a))
  const idx = alignments.findIndex(matchesTarget)
  return Object.keys(alignmentMap)[idx]
}

function parseTags() {
  for (let creature of monsters) {
    if (creature.type.tags) {
      const tags = creature.type.tags
      creature.tags = tags.map(t => {
        if (t.tag) return t.tag

        let tag = t.split(' ').pop()
        if (creature.type.type.toLowerCase() !== tag.toLowerCase()) return tag

        return 'None'
      })
      creature.parsedTags = tags.map(t => (typeof t === 'string' ? t : `${t.prefix} ${t.tag}`))
    } else {
      creature.tags = 'None'
    }
  }
}

parseSizes()
parseAlignment()
parseTags()

export const bestiary = monsters

export default bestiary
