import CoS from './bestiary-cos.json'
import DMG from './bestiary-dmg.json'
import HotDQ from './bestiary-hotdq.json'
import LMoP from './bestiary-lmop.json'
import Mag from './bestiary-mag.json'
import MM from './bestiary-mm.json'
import MTF from './bestiary-mtf.json'
import OotA from './bestiary-oota.json'
import PSA from './bestiary-ps-a.json'
import PSI from './bestiary-ps-i.json'
import PSK from './bestiary-ps-k.json'
import PSX from './bestiary-ps-x.json'
import PSZ from './bestiary-ps-z.json'
import PHB from './bestiary-phb.json'
import PotA from './bestiary-pota.json'
import RoT from './bestiary-rot.json'
import SKT from './bestiary-skt.json'
import TTP from './bestiary-ttp.json'
import TftYP from './bestiary-tftyp.json'
import ToA from './bestiary-toa.json'
import VGM from './bestiary-vgm.json'
import XGE from './bestiary-xge.json'

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
  XGE
}

export default Object.keys(sources).reduce(
  (monsters, source) => monsters.concat(sources[source].monster),
  []
)
