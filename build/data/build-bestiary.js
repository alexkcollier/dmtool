const fs = require('fs-extra')
const path = require('path')
const parseStyles = require('./parse-styles')

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

class BestiaryData {
  constructor(bestiaryPath) {
    this.bestiaryPath = bestiaryPath
    this.data = this.init()
  }

  parseSizes(bestiary) {
    return new Promise(resolve => {
      for (let creature of bestiary) {
        creature.size = sizes[creature.size] || creature.size
      }

      resolve()
    })
  }

  parseTags(bestiary) {
    return new Promise(resolve => {
      for (let creature of bestiary) {
        if (creature.type.tags) {
          const tags = creature.type.tags

          creature.tags = tags.map(t => {
            if (t.tag) return t.tag
            if (t === 'any race') return t

            let tag = t.split(' ').pop()

            if (creature.type.type.toLowerCase() !== tag.toLowerCase()) return tag

            return 'None'
          })

          creature.parsedTags = tags.map(t => (typeof t === 'string' ? t : `${t.prefix} ${t.tag}`))
        } else {
          creature.tags = 'None'
        }
      }

      resolve()
    })
  }

  parseAlignment(bestiary) {
    return new Promise(async resolve => {
      for (let creature of bestiary) {
        if (creature.prettyAlignment) return

        if (creature.alignment[0].special) {
          // Creatures with special alignments. e.g.: Sacred Statue (Mordenkainen's Tome of Foes)
          creature.prettyAlignment = creature.alignment[0].special
        } else if (creature.alignment[0].chance) {
          // Creatures with chance alignments. e.g.: Cloud Giant, Empyrean
          const a1 = await this.setCleanAlignment(creature.alignment[0].alignment)
          const a2 = await this.setCleanAlignment(creature.alignment[1].alignment)
          const c1 = creature.alignment[0].chance
          const c2 = creature.alignment[1].chance
          creature.prettyAlignment = `${a1} (${c1}%) or ${a2} (${c2}%)`
        } else {
          // Standard alignments
          creature.prettyAlignment = await this.setCleanAlignment(creature.alignment)
        }
      }

      resolve()
    })
  }

  setCleanAlignment(target) {
    return new Promise(resolve => {
      const matchesTarget = alignment => alignment.every(a => target.includes(a))
      const idx = Object.values(alignmentMap).findIndex(matchesTarget)

      resolve(Object.keys(alignmentMap)[idx])
    })
  }

  async fetchBestiary(bestiaryPath) {
    const files = await fs.readdir(path.resolve(__dirname, bestiaryPath))

    return files.reduce(async (asyncData, file) => {
      if (!file.match(/^.*\.json$/)) return asyncData

      try {
        // await the async accumulator
        const data = await asyncData
        const { monster } = await fs.readJSON(path.resolve(__dirname, bestiaryPath, file))

        return data.concat(monster.filter(m => !m['_copy']))
      } catch (e) {
        console.error(e, file)
      }
    }, [])
  }

  async init() {
    try {
      const data = await this.fetchBestiary(this.bestiaryPath)

      await this.parseSizes(data)
      await this.parseAlignment(data)
      await this.parseTags(data)

      return data
    } catch (err) {
      console.error(err)
    }
  }
}

exports.build = async function build() {
  try {
    const Official = new BestiaryData('../../static/data/bestiary')
    const Custom = new BestiaryData('../../static/data/bestiary/custom')

    let data = await Promise.all(
      [Official, Custom].map(async d => {
        await d.init
        return d.data
      })
    )

    data = data.reduce((acc, data) => [...acc, ...data], [])
    data = JSON.parse(parseStyles(JSON.stringify(data)))

    fs.writeJSON(path.resolve(__dirname, '../../static/data/bestiary.json'), data)
  } catch (err) {
    console.error(err)
  }
}
