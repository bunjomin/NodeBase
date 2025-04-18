const fs = require('fs-extra'),
  path = require('path');

import StoreController from './storeController.js';

/**
 * Base class, used to instantiate a base on a directory
 * @param {String} baseDir The resolved absolute path to our base dir
 */
export default class Base {
  constructor(baseDir) {
    const nbDir = path.resolve(baseDir, '.nb_data');

    try {
      fs.ensureDirSync(nbDir);
    } catch (err) {
      console.log(err);
    }

    this.dir = nbDir;

    // Check if any stores exist within the base, if so
    // we're resuming a base rather than creating a new one
    /* const stores = fs.readdirSync(nbDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name); */

    this.store = new StoreController(this);
  }
}