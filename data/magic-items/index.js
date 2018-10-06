import custom from './custom'
import { excludeTypes } from './exclude-types'
import { item } from './items.json'
// import { variant } from './magicvariants.json'

/**
 *  Handling `./magicvariants.json` is a nightmare. Lots to merge/dedupe
 *  Many are already handled in `./magic-items.json`. Options are:
 *
 *  - dedupe `magic-items` with `item`
 *  - merge `magicvariants` and dedupe `item`
 *  - ignore `magicvariants`
 */

// merge all items
const itemsToParse = [...item]

// format data
const parsedItems = itemsToParse.reduce((acc, item) => {
  // exclude mundane items
  if (item.type && excludeTypes.includes(item.type.toLowerCase())) return acc

  // remove extra rarity
  if (item.rarity === 'Unknown (Magic)') item.rarity = 'Unknown'

  // items with no type
  if (!item.type && item.technology) item.type = item.technology
  if (!item.type && item.wondrous) item.type = 'Wondrous item'

  // handle weapons (Ammunition, Ranged, Melee)
  if (['A', 'R', 'M'].includes(item.type)) {
    item.type = 'Weapon'
    if (item.baseItem) item.subtype = item.baseItem.split('|').shift()
  }

  // handle armor
  if (item.armor) {
    switch (item.type) {
      case 'LA':
        // eslint-disable-next-line eqeqeq
        if (item.ac === 11 && item.weight == 8) item.subtype = 'Padded'
        // eslint-disable-next-line eqeqeq
        if (item.ac === 11 && item.weight == 10) item.subtype = 'Leather'
        if (item.ac === 12) item.subtype = 'Studded leather'
        break

      case 'MA':
        if (item.ac === 12) item.subtype = 'Hide'
        if (item.ac === 13) item.subtype = 'Chain shirt'
        // eslint-disable-next-line eqeqeq
        if (item.ac === 14 && item.weight == 45) item.subtype = 'Scale mail'
        // eslint-disable-next-line eqeqeq
        if (item.ac === 14 && item.weight == 20) item.subtype = 'Breastplate'
        if (item.ac === 15) item.subtype = 'Half plate'
        break

      case 'HA':
        if (item.ac === 14) item.subtype = 'Ring mail'
        if (item.ac === 16) item.subtype = 'Chain mail'
        if (item.ac === 17) item.subtype = 'Splint'
        if (item.ac === 18) item.subtype = 'Plate'
        break
    }

    item.type = 'Armor'
  }

  // handle all other items
  switch (item.type) {
    case 'EM':
      item.type = 'Eldritch machine'
      break
    case 'OTH':
      item.type = 'Other'
      break
    case 'P':
      item.type = 'Potion'
      break
    case 'RD':
      item.type = 'Rod'
      break
    case 'RG':
      item.type = 'Ring'
      break
    case 'S':
      item.type = 'Shield'
      break
    case 'SC':
      item.type = 'Scroll'
      break
    case 'WD':
      item.type = 'Wand'
      break

    default:
      break
  }

  acc.push(item)
  return acc
}, [])

export default [...custom, ...parsedItems]
