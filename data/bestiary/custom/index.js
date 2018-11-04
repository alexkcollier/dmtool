import Durgeddin from './durgeddin.json'
import Norixius from './norixius.json'
import PaleOrcs from './PaleOrcs.json'
import BookOfBeautifulHorrors from './bestiary-bbh.json'

export default {
  monster: [Durgeddin, Norixius, ...PaleOrcs, ...BookOfBeautifulHorrors]
}
