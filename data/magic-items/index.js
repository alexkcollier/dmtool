import custom from './custom'
import { excludeTypes } from './exclude-types'
import { item, itemGroup } from './items.json'
import { variant } from './magicvariants.json'

// format variants
const transformedVariants = variant
  // remove nonsense items
  .filter(v => !v.name.match(/Weapon \(no damage\)/) && v.name !== 'Armblade')
  .reduce((acc, variant) => {
    // prepare objects for flattening
    const { entries: entriesVariant, inherits, ...remainingVariant } = variant
    const { entries: entriesInherit, ...remainingInherits } = inherits

    // use the same format as `./items.json`
    // flatten `variant.inherits` with `variant`
    const variantItem = {
      ...remainingVariant,
      ...remainingInherits,
      entries: entriesVariant || entriesInherit
    }

    // Parse variant item types
    variantItem.requires.forEach((obj, idx) => {
      if (obj.ammunition) {
        variantItem.type = 'Weapon'
        variantItem.subtype = 'any ammunition'
      }

      if (obj.weapon) {
        variantItem.type = 'Weapon'
        variantItem.subtype = 'any weapon'
      }

      if (obj.armor) {
        variantItem.type = 'Armor'
        variantItem.subtype = 'light, medium, or heavy'
      }

      if (obj.type === 'HA') {
        variantItem.type = 'Armor'
        variantItem.subtype = 'heavy'
      }

      if (obj.type === 'MA') {
        variantItem.type = 'Armor'
        variantItem.subtype = 'Medium'
      }

      if (obj.type === 'LA') {
        variantItem.type = 'Armor'
        variantItem.subtype = 'light'
      }

      if (obj.type === 'SCF') variantItem.type = 'Wondrous item'
      if (obj.type === 'S') variantItem.type = 'Shield'

      // This is where things get really brittle
      // TODO: make this less specific
      if (obj.axe) {
        variantItem.type = 'Weapon'
        variantItem.subtype = 'any axe'
      }

      if (obj.sword) {
        variantItem.type = 'Weapon'
        variantItem.subtype = 'any sword'
      }

      if (obj.sword && obj.dmgType) {
        const parsedDamage = obj.dmgType.replace('S', 'slashing')
        variantItem.subtype = `any sword that deals ${parsedDamage} damage`
      }

      // complex item subtypes
      if (variantItem.requires.length > 1) {
        const reachedEndOfRequires = idx + 1 === variantItem.requires.length

        if (!Array.isArray(variantItem.subtype)) variantItem.subtype = []

        // Axe or sword
        // TODO: make this less specific
        if (obj.sword || obj.axe) {
          // only add weapon keys
          variantItem.subtype.push(
            ...Object.keys(obj).filter(k => k !== 'dmgType')
          )

          if (reachedEndOfRequires) {
            variantItem.type = 'Weapon'
            // TODO: improve join (e.g.: [el1, el2, el3] => el1, el2, or el3)
            variantItem.subtype = `any ${variantItem.subtype
              .sort()
              .join(' or ')}`
          }
        }

        // Armor variants
        // TODO: make this less specific
        if (obj.type) {
          variantItem.subtype.push(obj.type)

          if (reachedEndOfRequires) {
            // make armor types readable
            const parsed = variantItem.subtype.map(t => {
              return t
                .replace(/ha/i, 'heavy')
                .replace(/ma/i, 'medium')
                .replace(/la/i, 'light')
            })

            // TODO: improve join (e.g.: [el1, el2, el3] => el1, el2, or el3)
            const subtype = `${parsed.join(' or ')}`

            variantItem.subtype = variantItem.excludes
              ? `${subtype}, but not ${Object.values(variantItem.excludes)
                  // TODO: improve join (e.g.: [el1, el2, el3] => el1, el2, or el3)
                  .join(' or ')
                  .toLowerCase()
                  .replace(' armor', '')}`
              : subtype

            variantItem.type = 'Armor'
          }
        }
      }
    })

    acc.push(variantItem)

    return acc
  }, [])

// merge all items
const itemsToParse = [...item, ...itemGroup, ...transformedVariants]

// format items
const parsedItems = itemsToParse.reduce((acc, item) => {
  // exclude mundane items
  if (item.type && excludeTypes.includes(item.type.toLowerCase())) return acc

  // remove extra rarity
  if (item.rarity === 'Unknown (Magic)') item.rarity = 'Unknown'

  // armor of resistance should be in `./magicvariants.json` , but isn't
  if (item.name.toLowerCase() === 'armor of resistance') {
    item.type = 'Armor'
    item.subtype = 'light, medium, or heavy'
  }

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
      item.type = 'Wondrous item'
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

  // Add entries to items without entries
  if (!item.entries) item.entries = []

  if (item.type === 'Armor') {
    if (item.resist) {
      item.entries.push(`You have resistance to ${item.resist} damage while you
      wear this armor.`)
    }

    if (item.stealth) {
      item.entries.push(`The wearer has disadvantage on Stealth (Dexterity)
      checks.`)
    }

    const heavyArmors = ['Ring mail', 'Chain mail', 'Splint', 'Plate']

    if (heavyArmors.includes(item.subType) && item.strength) {
      item.entries.push(`If the wearer has a Strength score lower than
      ${item.strength}, their speed is reduced by 10 feet.`)
    }
  } else if (item.resist) {
    if (item.type === 'Potion') {
      item.entries.push(`When you drink this potion, you gain resistance to
      ${item.resist} damage for 1 hour.`)
    }

    if (item.type === 'Ring') {
      item.entries.push(`You have resistance to ${item.resist} damage while
      wearing this ring.`)
    }
  }

  acc.push(item)
  return acc
}, [])

export default [...custom, ...parsedItems]
