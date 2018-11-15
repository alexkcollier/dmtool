const fs = require('fs-extra')
const path = require('path')
const parseStyles = require('./parse-styles')

const schoolMap = {
  A: 'Abjuration',
  C: 'Conjuration',
  D: 'Divination',
  E: 'Enchantment',
  I: 'Illusion',
  N: 'Necromancy',
  T: 'Transmutation',
  V: 'Evocation'
}

class SpellData {
  constructor(spellPath) {
    this.spellPath = spellPath
    this.data = this.init()
  }

  parseSpellMeta(spellData) {
    const { school } = spellData
    if (spellData.level === 0) spellData.level = 'Cantrip'
    if (schoolMap.hasOwnProperty(school)) spellData.school = schoolMap[school]
    return spellData
  }

  async fetchSpells(spellPath) {
    const files = await fs.readdir(path.resolve(__dirname, spellPath))

    return files.reduce(async (asyncData, file) => {
      if (!file.match(/^.*\.json$/)) return asyncData

      try {
        // await the async accumulator
        const data = await asyncData
        const { spell } = await fs.readJSON(path.resolve(__dirname, spellPath, file))

        return data.concat(spell.map(this.parseSpellMeta))
      } catch (e) {
        console.error(e, file)
      }
    }, [])
  }

  async init() {
    try {
      const data = await this.fetchSpells(this.spellPath)

      return data
    } catch (err) {
      console.error(err)
    }
  }
}

exports.build = async function build() {
  try {
    const Official = new SpellData('../../static/data/spells')
    const Custom = new SpellData('../../static/data/spells/custom')

    let data = await Promise.all(
      [Official, Custom].map(async d => {
        await d.init
        return d.data
      })
    )

    data = data.reduce((acc, data) => [...acc, ...data], [])
    data = JSON.parse(parseStyles(JSON.stringify(data)))
    fs.writeJSON(path.resolve(__dirname, '../../static/data/spells.json'), data)
  } catch (err) {
    console.error(err)
  }
}
