import Vue from 'vue'

const boldReplace = '<strong>$1</strong>'
const italicReplace = '<em>$1</em>'
const plainReplace = '$1'

export const regExps = {
  meleeWeaponAttack: {
    find: /{@atk\s(mw?)(\|(.*?))?(\|.*?)?}/g,
    html: '<em>Melee Weapon Attack: </em>'
  },
  rangedWeaponAttack: {
    find: /{@atk\s(rw?)(\|(.*?))?(\|.*?)?}/g,
    html: '<em>Ranged Weapon Attack: </em>'
  },
  meleeOrRangedWeaponAttack: {
    find: /{@atk\s(mw,rw?)(\|(.*?))?(\|.*?)?}/g,
    html: '<em>Melee or Ranged Weapon Attack: </em>'
  },
  meleeSpellAttack: {
    find: /{@atk\s(ms?)(\|(.*?))?(\|.*?)?}/g,
    html: '<em>Melee Spell Attack: </em>'
  },
  rangedSpellAttack: {
    find: /{@atk\s(rs?)(\|(.*?))?(\|.*?)?}/g,
    html: '<em>Ranged Spell Attack: </em>'
  },
  meleeOrRangedSpellAttack: {
    find: /{@atk\s(ms,rs?)(\|(.*?))?(\|.*?)?}/g,
    html: '<em>Melee or Ranged Spell Attack: </em>'
  },
  creature: {
    find: /{@creature\s(.*?)(\|(.*?))?(\|.*?)?}/g,
    html: boldReplace
  },
  dice: {
    find: /{@dice\s(.*?)(\|(.*?))?(\|.*?)?}/g,
    html: plainReplace
  },
  diceExpression: {
    // (XdY+/-Z) => (XdY +/- Z)
    find: /(\(\d+d\d{1,2})([+-])(\d+\))/g,
    html: '$1&nbsp;$2&nbsp;$3'
  },
  noSignHit: {
    find: /{@hit\s(\d*?)(\|(.*?))?(\|.*?)?}/g,
    html: `+${plainReplace}`
  },
  hitLabel: {
    find: /(Hit:)/,
    html: italicReplace
  },
  hit: {
    find: /{@hit\s(.*?)(\|(.*?))?(\|.*?)?}/g,
    html: plainReplace
  },
  spell: {
    find: /{@spell\s(.*?)(\|(.*?))?(\|.*?)?}/g,
    html: italicReplace
  },
  item: {
    find: /{@item\s(.*?)(\|(.*?))?(\|.*?)?}/g,
    html: italicReplace
  },
  label: {
    find: /^((\w+\s*){0,3}:)/g,
    html: italicReplace
  },
  bold: {
    find: /{@(bold|b)\s(.*?)(\|(.*?))?(\|.*?)?}/g,
    html: '<strong>$2</strong>'
  },
  italic: {
    find: /{@(italic|i)\s(.*?)(\|(.*?))?(\|.*?)?}/g,
    html: '<em>$2</em>'
  },
  skill: {
    find: /{@skill\s(.*?)(\|(.*?))?(\|.*?)?}/g,
    html: plainReplace
  },
  other: {
    find: /{@(filter|condition|race)\s(.*?)(\|(.*?))?(\|.*?)?}/g,
    html: '$2'
  }
}

export function setHtml(str) {
  if (typeof str === 'object') {
    console.error(str)
    throw new Error('Did not expect `Object`')
  }

  let newStr = str

  if (typeof newStr === 'string') {
    Object.values(regExps).map(v => (newStr = newStr.replace(v.find, v.html)))
  }

  return newStr
}

const entryHelper = {
  install(Vue, options) {
    Vue.prototype.$entryHelper = { setHtml }
  }
}

export default {
  regExps,
  setHtml
}

Vue.use(entryHelper)
