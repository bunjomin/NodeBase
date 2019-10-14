'use strict';

/**
 * Store
 * Controls read/write for stores,
 * belongs to a Base
 */

const fs = require('fs-extra'),
  globby = require('globby');

const __write = function ({ base, name, schema }) {
  console.log(base, name, schema);
  return;
};

class Store {
  constructor (base) {
    this.base = base;
    this.dir = base.dir;
  }

  create ({ name, schema }) {
    __write({ base: this.base, name, schema });
  }

  read () {
    // R
  }

  update () {
    // U
  }

  delete () {
    // D
  }
}

const fs$1 = require('fs-extra'),
  path = require('path');

/**
 * Base class, used to instantiate a base on a directory
 * @param {String} baseDir The resolved absolute path to our base dir
 */
class Base {
  constructor (baseDir) {
    const nbDir = path.resolve(baseDir, '.nb_data');

    try {
      fs$1.ensureDirSync(nbDir);
    } catch (err) {
      console.log(err);
    }

    this.dir = nbDir;

    // Check if any stores exist within the base, if so
    // we're resuming a base rather than creating a new one
    const stores = fs$1.readdirSync(nbDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    if (!stores.length) {
      this.stores = stores;
      this.store = new Store(this);
    }

    else console.log(stores);
  }
}

module.exports = Base;
