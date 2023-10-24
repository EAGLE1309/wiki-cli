import chalk from "chalk";

let output = ``;

const objToPairs = async (obj, indent = 0) => {
  // TODO: Remove empty/null object properties

  for (let value in obj) {
    if (obj[value] === null || obj[value] === undefined) {
      continue; // Skip null or undefined properties
    }
    else if (Array.isArray(obj[value]) && obj[value].length === 0) {
      continue; // Skip empty arrays
    }
    else if (typeof obj[value] === "object") {
      output += await chalk.bold.cyan(`${" ".repeat(indent)}- ${value.charAt(0).toUpperCase() + value.slice(1)}\n`)
      await objToPairs(obj[value], indent + 2)
    }
    else {
      output += await chalk.white(`${" ".repeat(indent)}> ${obj[value]}\n`)
    }
  }
}

export { objToPairs, output };