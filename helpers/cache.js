// Cache Functionality

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CACHE_FILE = path.join(__dirname, 'cache.json');

const readCache = () => {
  try {
    return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
  } catch (err) {
    return {};
  }
};

const writeCache = (cache) => {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache), 'utf8');
};

const clearCache = (cache) => {
  fs.writeFileSync(CACHE_FILE, "", "utf8")
};

export { readCache, writeCache, clearCache };