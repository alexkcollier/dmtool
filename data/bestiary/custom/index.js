import BansheeQueen from './banshee-queen.json'
import BookOfBeautifulHorrors from './bestiary-bbh.json'
import Durgeddin from './durgeddin.json'
import Norixius from './norixius.json'
import PaleOrcs from './PaleOrcs.json'

export default {
  monster: [Durgeddin, Norixius, ...PaleOrcs, ...BookOfBeautifulHorrors, BansheeQueen]
}
