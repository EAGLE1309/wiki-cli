import chalk from "chalk";

let output = ``;

const objToPairs = async (obj, indent = 0) => {
  // TODO: Remove empty/null object properties
  
  //const obj = Object.fromEntries(Object.entries(object).filter(([_, v]) => v != null));
  //await Object.keys(obj).forEach((k) => obj[k] == null && delete obj[k]);
  
  for (let value in obj) {
    if (typeof obj[value] === "object") {
      output += chalk.bold.cyan(`${" ".repeat(indent)}- ${value.charAt(0).toUpperCase() + value.slice(1)}\n`)
      await objToPairs(obj[value], indent + 5)
    }
    else {
      output += await chalk.white(`${" ".repeat(indent)}> ${obj[value]}\n`)
    }
  }
}

export {objToPairs, output};