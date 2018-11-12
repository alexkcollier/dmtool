import CrownOfKhundrukar from './crown-of-khundrukar.json'
import EndlessWalk from './endless-walk.json'
import FangOfZilvinas from './fang-of-zilvinas.json'

// TODO: unhide
// Hide the remaining set items for now
const TravelersPledge = EndlessWalk.find(item => item.name === "Traveler's Pledge")

export default [CrownOfKhundrukar, TravelersPledge, FangOfZilvinas]
