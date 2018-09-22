import custom from './custom'
import { excludeTypes } from './exclude-types'
import { item } from './items.json'
import {
  lookup,
  martialMelee,
  martialRanged,
  simpleMelee,
  simpleRanged
} from './weapon-lookup'

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

  // dedupe
  if (item.rarity === 'Unknown (Magic)') item.rarity = 'Unknown'

  // items with no type
  if (!item.type) {
    if (item.technology) item.type = item.technology
    if (item.wondrous) item.type = 'Wondrous item'
  }

  // handle weapons
  if (['A', 'R', 'M'].includes(item.type)) {
    switch (item.type) {
      case 'R':
        if (item.weaponCategory === 'Simple') {
          simpleRanged.forEach(wp => {
            item.subtype =
              lookup(item) === wp.searchString
                ? wp.subtype
                : 'simple ranged weapon'
          })
        } else if (item.weaponCategory === 'Martial') {
          martialRanged.forEach(wp => {
            item.subtype =
              lookup(item) === wp.searchString
                ? wp.subtype
                : 'martial ranged weapon'
          })
        } else {
          item.subtype = 'ranged weapon'
        }
        break

      case 'M':
        if (item.weaponCategory === 'Simple') {
          simpleMelee.forEach(wp => {
            item.subtype =
              lookup(item) === wp.searchString
                ? wp.subtype
                : 'simple melee weapon'
          })
        } else if (item.weaponCategory === 'Martial') {
          martialMelee.forEach(wp => {
            item.subtype =
              lookup(item) === wp.searchString
                ? wp.subtype
                : 'martial melee weapon'
          })
        } else {
          item.subtype = 'melee weapon'
        }
        break

      case 'A':
        item.subtype = 'ammunition'
        break
    }

    item.type = 'Weapon'
  }

  // handle armor naively
  // TODO: handle completely
  if (item.armor) {
    item.subtype = item.type
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
