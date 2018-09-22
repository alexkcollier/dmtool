export const lookup = itm => {
  let stack = ''

  if (itm.dmg1) {
    stack += itm.dmg1 === '1' ? itm.dmg1 : itm.dmg1.match(/\d+d\d+/)
  }
  if (itm.dmgType) stack += itm.dmgType
  if (itm.weight) stack += itm.weight
  if (itm.property) stack += itm.property
  return stack
}

export const simpleMelee = [
  { subtype: 'club', searchString: '1d4B2L' },
  { subtype: 'dagger', searchString: '1d4P1F,L,T' },
  { subtype: 'light hammer', searchString: '1d4B2L,T' },
  { subtype: 'sickle', searchString: '1d4S2L' },
  { subtype: 'handaxe', searchString: '1d6S2L,T' },
  { subtype: 'javelin', searchString: '1d6P2T' },
  { subtype: 'mace', searchString: '1d6B4' },
  { subtype: 'quarterstaff', searchString: '1d6B4V' },
  { subtype: 'spear', searchString: '1d6P3T,V' },
  { subtype: 'greatclub', searchString: '1d8B102H' }
]

export const simpleRanged = [
  { subtype: 'dart', searchString: '1d4P0.25F,T' },
  { subtype: 'sling', searchString: '1d4BA' },
  { subtype: 'shortbow', searchString: '1d6P2A,2H' },
  { subtype: 'light crossbow', searchString: '1d8P5A,LD,2H' }
]

export const martialMelee = [
  { subtype: 'glaive or halberd', searchString: '1d10S6H,R,2H' },
  { subtype: 'pike', searchString: '1d10P18H,R,2H' },
  { subtype: 'greataxe', searchString: '1d12S7H,2H' },
  { subtype: 'lance', searchString: '1d12P6R,S' },
  { subtype: 'whip', searchString: '1d4S3F,R' },
  { subtype: 'scimitar', searchString: '1d6S3F,L' },
  { subtype: 'shortsword', searchString: '1d6P2F,L' },
  { subtype: 'trident', searchString: '1d6P4T,V' },
  { subtype: 'battleaxe', searchString: '1d8S4V' },
  { subtype: 'flail', searchString: '1d8B2' },
  { subtype: 'longsword', searchString: '1d8S3V' },
  { subtype: 'morningstar', searchString: '1d8B4' },
  { subtype: 'rapier', searchString: '1d8P2F' },
  { subtype: 'war pick', searchString: '1d8P2' },
  { subtype: 'warhammer', searchString: '1d8B2V' },
  { subtype: 'greatsword', searchString: '2d6S6H,2H' },
  { subtype: 'maul', searchString: '2d6B10H,2H' }
]

export const martialRanged = [
  { subtype: 'blowgun', searchString: '1P1A,LD' },
  { subtype: 'heavy crossbow', searchString: '1d10P18A,H,LD,2H' },
  { subtype: 'hand crossbow', searchString: '1d6P3A,L,LD' },
  { subtype: 'longbow', searchString: '1d8P2A,H,2H' },
  { subtype: 'net', searchString: '3S,T' }
]
