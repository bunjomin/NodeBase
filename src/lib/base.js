const fs = require('fs-extra'),
  path = require('path');

import Store from './store.js';

/**
 * Base class, used to instantiate a base on a directory
 * @param {String} baseDir The resolved absolute path to our base dir
 */
export default class Base {
  constructor (baseDir) {
    const nbDir = path.resolve(baseDir, '.nb_data');

    try {
      fs.ensureDirSync(nbDir);
    } catch (err) {
      console.log(err);
    }

    this.dir = nbDir;

    // Check if any stores exist within the base, if so
    // we're resuming a base rather than creating a new one
    const stores = fs.readdirSync(baseDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    if (!stores.length) {
      this.stores = stores;
      this.store = new Store(this);
    }

    else console.log(stores);
  }
}