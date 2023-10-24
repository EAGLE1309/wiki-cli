#!/usr/bin/env node

import chalk from 'chalk';
import boxen from 'boxen';
import { input, confirm } from '@inquirer/prompts';
import { Command } from 'commander';

import boot from "./utility/boot.js";
import title from "./utility/title.js";
import wait from "./utility/wait.js";
import { search } from "./helpers/wiki.js";
import { objToPairs, output } from "./utility/objEntries.js";
import { readCache, writeCache, clearCache } from "./helpers/cache.js";

const program = new Command();

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
    displaySearchResult(result);
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
};

const quickMain = async (query) => {
  console.clear();
  await title();
  await wait(250);

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
};


// Main Program
program
  .name('wiki-cli')
  .description('Awesome and interactive Wikipedia CLI for Node.js')
  .version("1.0.0")

program.command('search <query>')
  .description('Search for your query on Wikipedia')
  .action((query) => {
    quickMain(query);
  });

program.command('interact')
  .description('Opens CLI in interactive mode')
  .action(() => {
    main();
  });

program.command('cache-clean')
  .description('Clears cache')
  .action(async () => {
    const answer = await confirm({ message: 'Continue?' });
    if (answer) {
      clearCache()
      console.log(chalk.magenta("Cleared Cache Successfully ✅"));
    }
    else {
      console.log(chalk.magenta("Cancelled ❌"))
      return;
    }
  });

program.parse();