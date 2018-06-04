const bestiary = require('./index.js').bestiary

console.log(Object.keys(bestiary))
// for (const source in bestiary) {
//   if (bestiary.hasOwnProperty(source)) {
//     console.log(`import ${source} from '${bestiary[source]}'`)
//   }
// }
