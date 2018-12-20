export const state = () => ({
  diceConfigs: []
})

export const mutations = {
  addDiceConfig: (state, { config }) => state.diceConfigs.push(config),
  deleteDiceConfig: (state, { uuid }) => {
    const index = state.diceConfigs.findIndex(el => el.uuid === uuid)
    state.diceConfigs.splice(index, 1)
  },
  clearDice: state => (state.diceConfigs = [])
}
