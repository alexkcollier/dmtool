import { monster as CoS } from './bestiary-cos.json'
import { monster as DMG } from './bestiary-dmg.json'
import { monster as HotDQ } from './bestiary-hotdq.json'
import { monster as LMoP } from './bestiary-lmop.json'
import { monster as Mag } from './bestiary-mag.json'
import { monster as MM } from './bestiary-mm.json'
import { monster as MTF } from './bestiary-mtf.json'
import { monster as OotA } from './bestiary-oota.json'
import { monster as PSA } from './bestiary-ps-a.json'
import { monster as PSI } from './bestiary-ps-i.json'
import { monster as PSK } from './bestiary-ps-k.json'
import { monster as PSX } from './bestiary-ps-x.json'
import { monster as PSZ } from './bestiary-ps-z.json'
import { monster as PHB } from './bestiary-phb.json'
import { monster as PotA } from './bestiary-pota.json'
import { monster as RoT } from './bestiary-rot.json'
import { monster as SKT } from './bestiary-skt.json'
import { monster as TTP } from './bestiary-ttp.json'
import { monster as TftYP } from './bestiary-tftyp.json'
import { monster as ToA } from './bestiary-toa.json'
import { monster as VGM } from './bestiary-vgm.json'
import { monster as XGE } from './bestiary-xge.json'
import { monster as ppAL } from './bestiary-3pp-al.json'
import { monster as ppCC } from './bestiary-3pp-cc.json'
import { monster as ppFEF } from './bestiary-3pp-fef.json'
import { monster as ppGDoF } from './bestiary-3pp-gdof.json'
import { monster as ppToB } from './bestiary-3pp-tob.json'

const sources = {
  CoS,
  DMG,
  HotDQ,
  LMoP,
  Mag,
  MM,
  MTF,
  OotA,
  PSA,
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
  VGM,
  XGE,
  ppAL,
  ppCC,
  ppFEF,
  ppGDoF,
  ppToB
}

let bestiary = []

for (const source in sources) {
  const monsters = sources[source]
  bestiary = bestiary.concat(monsters)
}

export default bestiary
