import Vue from 'vue'

const boldReplace = '<strong>$1</strong>'
const italicReplace = '<em>$1</em>'
const plainReplace = '$1'

export const regExps = {
  attack: {
    find: /((Melee|Ranged).*Attack:)/g,
    html: italicReplace
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
    find: /{@bold\s(.*?)(\|(.*?))?(\|.*?)?}/g,
    html: boldReplace
  },
  italic: {
    find: /{@italic\s(.*?)(\|(.*?))?(\|.*?)?}/g,
    html: italicReplace
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
  const format = r => (str = str.replace(regExps[r].find, regExps[r].html))
  Object.keys(regExps).map(format)
  return str
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
