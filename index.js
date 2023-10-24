#!/usr/bin/env node

import chalk from 'chalk';
import boxen from 'boxen';
import { input, confirm, select } from '@inquirer/prompts';

import boot from "./utility/boot.js";
import title from "./utility/title.js";
import wait from "./utility/wait.js";
import { search } from "./helpers/wiki.js";
import { objToPairs, output } from "./utility/objEntries.js";
import { readCache, writeCache, clearCache } from "./helpers/cache.js";

const displayError = (query, err) => {
  console.error(chalk.red(boxen(`Couldn't find search results for ${query}\n${err}`, { padding: 1, borderColor: "red" })));
};

const displaySearchResult = async (result) => {
  const content = boxen(result.content, { padding: 1, borderColor: "gray", title: "Basic info" });
  const detailsObj = await result.details;

  console.log(content, "\n");
  await objToPairs(detailsObj);
  console.log(boxen(output, { padding: 1, borderColor: "gray", title: "Details" }));
};

const searchAndCache = async (query, cache) => {
  try {
    const result = await search(query);
    await displaySearchResult(result);
    if (result) {
      cache[query] = result;
      writeCache(cache);
    }
  } catch (err) {
    displayError(query, err);
  }
};

const main = async () => {
  console.clear();
  await boot();
  await title();
  await wait(1000);

  const operate = await select({
    message: "What you wanna do?",
    choices: [
      {
        name: "1. Search",
        value: "search",
        description: chalk.gray("Search for your query")
      },
      {
        name: "2. Clear Cache",
        value: "clear_cache",
        description: chalk.gray("Clear Cache of (your search history)")
      },
      {
        name: "3. Exit",
        value: "exit",
        description: chalk.gray("Exit the cli app")
      }
    ]
  })

  switch (operate) {
    case "search":

      const query = (await input({ message: "Search: ", default: "Bleach anime" })).trim();

      if (!query) {
        console.error(chalk.red("Error: Query cannot be empty."));
        return;
      }

      const cache = readCache();

      if (cache[query]) {
        displaySearchResult(cache[query]);
        return;
      }

      await searchAndCache(query, cache);
      break;

    case "clear_cache":
      clearCache();
      console.log(chalk.black.bgGreen("Success"), chalk.magenta("Successfully cleared the cache."))
      break;

    case "exit":
      console.log(chalk.magenta(chalk.black.bgGreen("Success"), "Exited process with status code (1)"))
      process.exit(1)
  }
};

main();