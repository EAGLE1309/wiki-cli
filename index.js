#!/usr/bin/env node

// Import packages
import chalk from 'chalk';
import boxen from 'boxen';
import { input } from '@inquirer/prompts';

// Import local modules
import boot from "./utility/boot.js"
import title from "./utility/title.js"
import wait from "./utility/wait.js"
import { search } from "./helpers/wiki.js";
import { objToPairs, output } from "./utility/objEntries.js"

console.clear(); // Clear console

await boot(); // Start function
await title(); // Title for whole script
await wait(1000); // Load for 1 sec

// Get Input (interactive)
const query = await input({ message: "Search: ", default: "Bleach anime" });

// Error Handling
const errorMsg = (query, err) => {
  // Return error in a red box for better ui
  return chalk.red(boxen(`Couldn't find search results for ${query}\n${err}`, { padding: 1, borderColor: "red" }))
}

// Search Result
const searchResult = async (result) => {
  const content = boxen(result.content, { padding: 1, borderColor: "gray", title: "Basic info" })
  const detailsObj = await result.details

  await console.log(content, "\n");
  await objToPairs(detailsObj);
  console.log(boxen(output, { padding: 1, borderColor: "gray", title: "Details" }))
}

// Search for given term (query) using wiki.js
search(query)
  .then(async data => await searchResult(data))
  .catch((err) => console.log(errorMsg(query, err)))

// for. e.g. search("Bleach Anime")