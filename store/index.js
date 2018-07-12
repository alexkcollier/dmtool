import bestiary from '~/data/bestiary'
import magicItems from '~/data/magic-items'
import spells from '~/data/spells'

export const actions = {
  nuxtServerInit({ commit }) {
    commit('bestiary/INIT_BESTIARY', bestiary)
    commit('magic-items/INIT_MAGIC_ITEMS', magicItems)
    commit('bestiary/INIT_SPELLS', spells)
  }
}
