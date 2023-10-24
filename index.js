#!/usr/bin/env node

// Import packages
import chalk from 'chalk';
import boxen from 'boxen';
import { input, confirm } from '@inquirer/prompts';

// Import local modules
import boot from "./utility/boot.js"
import title from "./utility/title.js"
import wait from "./utility/wait.js"
import { search } from "./helpers/wiki.js";
import { objToPairs, output } from "./utility/objEntries.js"
import { readCache, writeCache, clearCache } from "./helpers/cache.js";

import { Command } from 'commander';
const program = new Command();

program
  .name('wiki-cli')
  .description('Awesome and interactive wikipedia cli for nodejs')
  .version("1.0.0");

// Error Handling
const displayError = (query = "", err) => {
  // Return error in a red box for better ui
  console.log(chalk.red(boxen(`Couldn't find search results for ${query}\n${err}`, { padding: 1, borderColor: "red" })))
}

// Search Result
const displaySearchResult = async (result) => {
  const content = boxen(result.content, { padding: 1, borderColor: "gray", title: "Basic info" })
  const detailsObj = await result.details

  await console.log(content, "\n");
  await objToPairs(detailsObj);
  console.log(boxen(output, { padding: 1, borderColor: "gray", title: "Details" }))
}

// Main Function
const main = async () => {

  console.clear(); // Clear console

  await boot(); // Start function
  await title(); // Title for whole script
  await wait(1000); // Load for 1 sec

  // Get Input (interactive)
  const query = await input({ message: "Search: ", default: "Bleach anime" });

  if (!query) {
    console.error(chalk.red("Error: Query cannot be empty."));
    return;
  }

  // Load cache
  const cache = readCache();

  // Check if the query is in the cache
  if (cache[query]) {
    displaySearchResult(cache[query]);
    return;
  }

  // Search for the given term (query) using wiki.js

  await search(query)
    .then(result => {
      displaySearchResult(result);
      if (result) {
        cache[query] = result;
        writeCache(cache);
      }
    })
    .catch(err => displayError(query, err))
  // for. e.g. search("Bleach Anime")

}

const quickMain = async (query) => {

  console.clear();

  await title();
  await wait(250);

  if (!query) {
    console.error(chalk.red("Error: Query cannot be empty."));
    return;
  }

  // Load cache
  const cache = readCache();

  // Check if the query is in the cache
  if (cache[query]) {
    displaySearchResult(cache[query]);
    return;
  }

  // Search for the given term (query) using wiki.js

  await search(query)
    .then(result => {
      displaySearchResult(result);
      if (result) {
        cache[query] = result;
        writeCache(cache);
      }
    })
    .catch(err => displayError(query, err))
  // for. e.g. search("Bleach Anime")

}

program.command('search')
  .description('Search for your query wikipedia')
  .argument('<string>', 'query to search')
  .action((query) => {
    quickMain(query)
  });

program.command("interact")
  .description("Opens CLI in interactive mode")
  .action(() => {
    main();
  })

program.parse();
// main();