'use strict';

class Schema {
  constructor({ store, schemaConfig }) {
    const fs = require('fs-extra');
    this.store = store;
    this.config = schemaConfig;
    fs.writeJSONSync(store.schemaPath, schemaConfig);
  }

  /**
   * Compare value to schema
   */
  validate(payload) {
    if (!payload.length) return false;
    return true;
  }
}

const uuid = () => {
  let uuid = '', i, random;
  for (i = 0; i < 32; i++) {
    random = Math.random() * 16 | 0;

    if (i == 8 || i == 12 || i == 16 || i == 20) {
      uuid += '-';
    }
    uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
  }
  return uuid;
};

const fs = require('fs-extra'),
  path = require('path');

/**
 * Store
 * Handles JSON read/write
 */
class Store {
  constructor({ base, identifier, name, schemaConfig }) {
    if (!schemaConfig.length) throw new Error('Invalid schema config!', schemaConfig);
    this.base = base;
    this.dir = path.resolve(base.dir, name);
    fs.ensureDir(path.resolve(this.dir));
    this.schemaPath = path.resolve(this.dir, 'schema.json');
    this.dataPath = path.resolve(this.dir, 'data.json');
    // Set schemaConfig to what was passed in
    this.schemaConfig = schemaConfig;
    // By default we're creating a new schema
    this.data = [];
    // If schema.json already exists, we're loading an existing store
    if (fs.existsSync(this.schemaPath)) {
      // Set existing schema
      this.schemaConfig = fs.readJSONSync(this.schemaPath);
      // Load data if present
      if (fs.existsSync(this.dataPath)) this.data = fs.readJSONSync(this.dataPath);
    }
    this.schema = new Schema({ store: this, schemaConfig: this.schemaConfig });
    this.name = name;
    this.identifier = identifier;
  }

  /**
   * Store.add
   * Insert a new entry to the store
   * @param {Array} payload Entries to be added
   *  [{
   *    first: 'Test',
   *    last: 'Jackson',
   *    email: 'tjackson@example.com'
   *  }]
   */
  async add(payload) {
    if (!this.schema.validate(payload)) throw new Error('Invalid payload passed to Store.add', payload);
    let added = {};
    payload.map(p => {
      const identifier = uuid();
      this.data[identifier] = p;
      added[identifier] = p;
    });
    await this.saveData();
    return added;
  }

  async saveData() {
    fs.writeJSON(this.dataPath, this.data);
  }
}

/**
 * StoreController
 * Controls stores for a base.
 */
class StoreController {
  constructor(base) {
    this.base = base;
    this.dir = base.dir;
    this.stores = {};
  }

  /**
   * Create
   * Instantiate a new Store and return it.
   */
  create({ name, schemaConfig }) {
    const identifier = uuid(),
      store = new Store({ base: this.base, identifier, name, schemaConfig });
    this.stores[identifier] = store;
    return this.stores[identifier];
  }

  get(identifier) {
    return this.stores[identifier] || null;
  }
}

const fs$1 = require('fs-extra'),
  path$1 = require('path');

/**
 * Base class, used to instantiate a base on a directory
 * @param {String} baseDir The resolved absolute path to our base dir
 */
class Base {
  constructor(baseDir) {
    const nbDir = path$1.resolve(baseDir, '.nb_data');

    try {
      fs$1.ensureDirSync(nbDir);
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

module.exports = Base;
