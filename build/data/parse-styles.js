const boldReplace = '<strong>$1</strong>'
const italicReplace = '<em>$1</em>'
const plainReplace = '$1'

const regExps = {
  bold: {
    find: /{@(bold|b)\s(.*?)(\|(.*?))?(\|.*?)?}/g,
    html: '<strong>$2</strong>'
  },
  chance: {
    find: /{@chance\s(.*?)(\|(.*?))?(\|(.*?))?}/g,
    html: '$1 percent'
  },
  creature: {
    find: /{@creature\s(.*?)(\|(.*?))?(\|.*?)?}/g,
    html: boldReplace
  },
  damage: {
    find: /{@damage\s(.*?)(\|(.*?))?(\|.*?)?}/g,
    html: plainReplace
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
  hazard: {
    find: /{@hazard\s(.*?)(\|(.*?))?(\|(.*?))?}/g,
    html: plainReplace
  },
  // must come before hit
  hitUnsigned: {
    find: /{@hit\s(\d*?)(\|(.*?))?(\|.*?)?}/g,
    html: `+${plainReplace}`
  },
  hit: {
    find: /{@hit\s(.*?)(\|(.*?))?(\|.*?)?}/g,
    html: plainReplace
  },
  hitLabel: {
    find: /(Hit:|Miss:)/,
    html: italicReplace
  },
  hitTag: {
    find: /{@h}/g,
    html: '<em>Hit: </em>'
  },
  italic: {
    find: /{@(italic|i)\s(.*?)(\|(.*?))?(\|.*?)?}/g,
    html: '<em>$2</em>'
  },
  item: {
    find: /{@item\s(.*?)(\|(.*?))?(\|.*?)?}/g,
    html: italicReplace // '<a href=\"/magic-items?name=$1\" class=\"link\">$1</a>'
  },
  label: {
    find: /^((\w+\s*){0,3}:)/g,
    html: italicReplace
  },
  meleeWeaponAttack: {
    find: /{@atk\s(mw?)(\|(.*?))?(\|.*?)?}/g,
    html: '<em>Melee Weapon Attack: </em>'
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
  rangedWeaponAttack: {
    find: /{@atk\s(rw?)(\|(.*?))?(\|.*?)?}/g,
    html: '<em>Ranged Weapon Attack: </em>'
  },
  recharge: {
    find: /{@recharge\s?(\d*?)}/g,
    html: Number('$1') ? '(Recharge 6)' : '(Recharge $1-6)'
  },
  meleeOrRangedSpellAttack: {
    find: /{@atk\s(ms,rs?)(\|(.*?))?(\|.*?)?}/g,
    html: '<em>Melee or Ranged Spell Attack: </em>'
  },
  other: {
    find: /{@(filter|condition|race)\s(.*?)(\|(.*?))?(\|.*?)?}/g,
    html: '$2'
  },
  scaleDice: {
    find: /{@scaledice\s(.*?)(\|(.*?))?(\|(.*?))?}/g,
    html: '$5'
  },
  skill: {
    find: /{@skill\s(.*?)(\|(.*?))?(\|.*?)?}/g,
    html: plainReplace
  },
  spell: {
    find: /{@spell\s(.*?)(\|(.*?))?(\|.*?)?}/g,
    html: italicReplace
  }
}

module.exports = function setHtml(str) {
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
